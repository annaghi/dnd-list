module Configuration.OperationOnDrop.Unaltered exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
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
    { value : String
    , color : String
    }


data : List Item
data =
    List.range 0 9
        |> List.map (\i -> Item (String.fromInt i) baseColor)



-- SYSTEM


config : DnDList.Config Item
config =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrop
    , operation = DnDList.Unaltered
    , beforeUpdate = updateColors
    }


system : DnDList.System Item Msg
system =
    DnDList.create config MyMsg


updateColors : Int -> Int -> List Item -> List Item
updateColors dragIndex dropIndex items =
    if dragIndex /= dropIndex then
        List.indexedMap
            (\i { value } ->
                if i == dragIndex then
                    Item value targetColor

                else if i == dropIndex then
                    Item value sourceColor

                else
                    Item value baseColor
            )
            items

    else
        items



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , items : List Item
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = data
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
    | ResetColors


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( draggable, items ) =
                    system.update msg model.draggable model.items
            in
            ( { model | draggable = draggable, items = items }
            , system.commands model.draggable
            )

        ResetColors ->
            ( { model | items = List.map (\{ value } -> Item value baseColor) model.items }
            , Cmd.none
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Events.onMouseDown ResetColors ]
        [ model.items
            |> List.indexedMap (itemView model.draggable)
            |> Html.div containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : DnDList.Draggable -> Int -> Item -> Html.Html Msg
itemView draggable index { value, color } =
    let
        itemId : String
        itemId =
            "unaltered-" ++ value

        attrs : String -> List (Html.Attribute msg)
        attrs color_ =
            Html.Attributes.id itemId :: itemStyles color_
    in
    case system.info draggable of
        Just { dragIndex, dropIndex } ->
            if dragIndex /= index && dropIndex /= index then
                Html.div
                    (attrs color ++ system.dropEvents index itemId)
                    [ Html.text value ]

            else if dragIndex /= index && dropIndex == index then
                Html.div
                    (attrs sourceColor ++ system.dropEvents index itemId)
                    [ Html.text value ]

            else
                Html.div
                    (attrs sourceColor)
                    []

        _ ->
            Html.div
                (attrs color ++ system.dragEvents index itemId)
                [ Html.text value ]


draggedItemView : DnDList.Draggable -> List Item -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Item
        maybeDraggedItem =
            system.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedItem of
        Just { value } ->
            Html.div
                (itemStyles targetColor ++ system.draggedStyles draggable)
                [ Html.text value ]

        Nothing ->
            Html.text ""



-- COLORS


baseColor : String
baseColor =
    "dimgray"


sourceColor : String
sourceColor =
    "green"


targetColor : String
targetColor =
    "red"


affectedColor : String
affectedColor =
    "purple"



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "background" color
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    ]
