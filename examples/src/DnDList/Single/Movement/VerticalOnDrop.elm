module DnDList.Single.Movement.VerticalOnDrop exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Single
import Html
import Html.Attributes
import Html.Events



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- DATA


type alias Item =
    String


data : List Item
data =
    List.range 1 7
        |> List.map String.fromInt



-- DND


system : DnDList.Single.System Item Msg
system =
    DnDList.Single.config
        |> DnDList.Single.movement DnDList.Vertical
        |> DnDList.Single.listen DnDList.OnDrop
        |> DnDList.Single.operation DnDList.Swap
        |> DnDList.Single.create DnDMsg



-- MODEL


type alias Model =
    { items : List Item
    , affected : List Int
    , dnd : DnDList.Single.Model
    }


initialModel : Model
initialModel =
    { items = data
    , affected = []
    , dnd = system.model
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.dnd



-- UPDATE


type Msg
    = DnDMsg DnDList.Single.Msg
    | ClearAffected


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DnDMsg dndMsg ->
            let
                ( items, dndModel, dndCmd ) =
                    system.update model.items dndMsg model.dnd

                affected : List Int
                affected =
                    case system.info dndModel of
                        Just { dragIndex, dropIndex } ->
                            if dragIndex /= dropIndex then
                                [ dragIndex, dropIndex ]

                            else
                                []

                        _ ->
                            model.affected
            in
            ( { model | items = items, affected = affected, dnd = dndModel }
            , dndCmd
            )

        ClearAffected ->
            ( { model | affected = [] }, Cmd.none )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Events.onMouseDown ClearAffected ]
        [ model.items
            |> List.indexedMap (itemView model.dnd model.affected)
            |> Html.div containerStyles
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Single.Model -> List Int -> Int -> Item -> Html.Html Msg
itemView dnd affected index item =
    let
        itemId : String
        itemId =
            "vrdrop-" ++ item

        attrs : List (Html.Attribute msg)
        attrs =
            Html.Attributes.id itemId
                :: itemStyles
                ++ (if List.member index affected then
                        affectedStyles

                    else
                        []
                   )
    in
    case system.info dnd of
        Just { dragIndex, dropIndex } ->
            if dragIndex /= index && dropIndex /= index then
                Html.div
                    (attrs ++ system.dropEvents index itemId)
                    [ Html.text item ]

            else if dragIndex /= index && dropIndex == index then
                Html.div
                    (attrs ++ overedStyles ++ system.dropEvents index itemId)
                    [ Html.text item ]

            else
                Html.div
                    (attrs ++ placeholderStyles)
                    []

        Nothing ->
            Html.div
                (attrs ++ system.dragEvents index itemId)
                [ Html.text item ]


ghostView : DnDList.Single.Model -> List Item -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Item
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just item ->
            Html.div
                (itemStyles ++ ghostStyles ++ system.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "background-color" "#1e9daa"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "1.2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin" "0 0 1.5em 0"
    , Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    ]


placeholderStyles : List (Html.Attribute msg)
placeholderStyles =
    [ Html.Attributes.style "background-color" "dimgray" ]


overedStyles : List (Html.Attribute msg)
overedStyles =
    [ Html.Attributes.style "background-color" "#63bdc7" ]


affectedStyles : List (Html.Attribute msg)
affectedStyles =
    [ Html.Attributes.style "background-color" "#136169" ]


ghostStyles : List (Html.Attribute msg)
ghostStyles =
    [ Html.Attributes.style "background-color" "#aa1e9d" ]
