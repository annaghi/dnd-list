module DnDList.Single.Movement.FreeOnDrag exposing (Model, Msg, initialModel, main, subscriptions, update, view)

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
    List.range 1 9
        |> List.map String.fromInt



-- DND


system : DnDList.Single.System Item Msg
system =
    DnDList.Single.config
        |> DnDList.Single.movement DnDList.Free
        |> DnDList.Single.listen DnDList.OnDrag
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
init () =
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
                                dragIndex :: dropIndex :: model.affected

                            else
                                model.affected

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
            "frdrag-" ++ item

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
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (attrs ++ system.dropEvents index itemId)
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
    [ Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-template-columns" "50px 50px 50px"
    , Html.Attributes.style "grid-template-rows" "50px 50px 50px"
    , Html.Attributes.style "grid-gap" "1em"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "background-color" "#44526f"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "1.2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


placeholderStyles : List (Html.Attribute msg)
placeholderStyles =
    [ Html.Attributes.style "background-color" "dimgray" ]


affectedStyles : List (Html.Attribute msg)
affectedStyles =
    [ Html.Attributes.style "background-color" "#691361" ]


ghostStyles : List (Html.Attribute msg)
ghostStyles =
    [ Html.Attributes.style "background-color" "#1e9daa" ]
