module Configuration.Movement.HorizontalOnDrop exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

import Browser
import Browser.Events
import DnDList
import Html
import Html.Attributes
import Html.Events
import Json.Decode



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



-- SYSTEM


config : DnDList.Config Item
config =
    { movement = DnDList.Horizontal
    , trigger = DnDList.OnDrop
    , operation = DnDList.Swap
    , beforeUpdate = \_ _ list -> list
    }


system : DnDList.System Item Msg
system =
    DnDList.create config MyMsg



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , items : List Item
    , affected : List Int
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = data
    , affected = []
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.draggable



-- UPDATE


type Msg
    = MyMsg DnDList.Msg
    | ClearAffected


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( draggable, items ) =
                    system.update msg model.draggable model.items

                affected : List Int
                affected =
                    case system.info draggable of
                        Just { dragIndex, dropIndex } ->
                            if dragIndex /= dropIndex then
                                dragIndex :: dropIndex :: []

                            else
                                []

                        _ ->
                            model.affected
            in
            ( { model | draggable = draggable, items = items, affected = affected }
            , system.commands model.draggable
            )

        ClearAffected ->
            ( { model | affected = [] }, Cmd.none )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Events.onMouseDown ClearAffected ]
        [ model.items
            |> List.indexedMap (itemView model.draggable model.affected)
            |> Html.div containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : DnDList.Draggable -> List Int -> Int -> Item -> Html.Html Msg
itemView draggable affected index item =
    let
        itemId : String
        itemId =
            "hrdrop-" ++ item

        attrs : List (Html.Attribute msg)
        attrs =
            Html.Attributes.id itemId
                :: itemStyles
                ++ (if List.member index affected then
                        affectedItemStyles

                    else
                        []
                   )
    in
    case system.info draggable of
        Just { dragIndex, dropIndex } ->
            if dragIndex /= index && dropIndex /= index then
                Html.div
                    (attrs ++ system.dropEvents index itemId)
                    [ Html.text item ]

            else if dragIndex /= index && dropIndex == index then
                Html.div
                    (attrs ++ overedItemStyles ++ system.dropEvents index itemId)
                    [ Html.text item ]

            else
                Html.div
                    (attrs ++ placeholderItemStyles)
                    []

        Nothing ->
            Html.div
                (attrs ++ system.dragEvents index itemId)
                [ Html.text item ]


draggedItemView : DnDList.Draggable -> List Item -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Item
        maybeDraggedItem =
            system.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedItem of
        Just item ->
            Html.div
                (itemStyles ++ draggedItemStyles ++ system.draggedStyles draggable)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex" ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "background" "#1e9daa"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "1.2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    ]


draggedItemStyles : List (Html.Attribute msg)
draggedItemStyles =
    [ Html.Attributes.style "background" "#aa1e9d" ]


placeholderItemStyles : List (Html.Attribute msg)
placeholderItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]


overedItemStyles : List (Html.Attribute msg)
overedItemStyles =
    [ Html.Attributes.style "background" "#63bdc7" ]


affectedItemStyles : List (Html.Attribute msg)
affectedItemStyles =
    [ Html.Attributes.style "background" "#136169" ]
