module Gallery.TryOn exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes



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


type Property
    = Size
    | Color


type alias Item =
    { property : Property
    , width : Int
    , height : Int
    , color : Color
    }


data : List Item
data =
    [ Item Color 1 1 red
    , Item Color 1 1 green
    , Item Color 1 1 blue
    , Item Color 1 1 yellow
    , Item Size 1 2 gray
    , Item Size 2 2 gray
    , Item Size 2 1 gray
    , Item Size 1 3 gray
    , Item Size 3 2 gray
    , Item Size 3 1 gray
    , Item Size 3 3 gray
    ]



-- SYSTEM


config : DnDList.Config Item
config =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrop
    , operation = DnDList.Unmove
    , beforeUpdate = updateColor
    }


system : DnDList.System Item Msg
system =
    DnDList.create config MyMsg


updateColor : Int -> Int -> List Item -> List Item
updateColor dragIndex dropIndex list =
    let
        dragItem : List Item
        dragItem =
            list |> List.drop dragIndex |> List.take 1
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == dropIndex then
                    List.map2
                        (\dropElement dragElement ->
                            case ( dropElement.property, dragElement.property ) of
                                ( Size, Color ) ->
                                    { dropElement | color = dragElement.color }

                                _ ->
                                    dropElement
                        )
                        [ item ]
                        dragItem

                else
                    [ item ]
            )
        |> List.concat



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


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( draggable, items ) =
                    system.update msg model.draggable model.items
            in
            ( { model
                | draggable = draggable
                , items = items
              }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section sectionStyles
        [ model.items
            |> List.filter (\item -> item.property == Color)
            |> List.indexedMap (colorView model)
            |> Html.div colorStyles
        , model.items
            |> List.filter (\item -> item.property == Size)
            |> List.indexedMap
                (sizeView model (model.items |> List.filter (\item -> item.property == Color) |> List.length))
            |> Html.div containerStyles
        , draggedItemView model
        ]


colorView : Model -> Int -> Item -> Html.Html Msg
colorView model index item =
    let
        itemId : String
        itemId =
            "color-" ++ String.fromInt index

        width : Int
        width =
            item.width * 60

        height : Int
        height =
            item.height * 60
    in
    case system.info model.draggable of
        Just _ ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles width height item.color
                    ++ [ Html.Attributes.style "cursor" "pointer" ]
                )
                []

        _ ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles width height item.color
                    ++ system.dragEvents index itemId
                    ++ [ Html.Attributes.style "cursor" "pointer" ]
                )
                []


sizeView : Model -> Int -> Int -> Item -> Html.Html Msg
sizeView model offset index item =
    let
        globalIndex : Int
        globalIndex =
            index + offset

        itemId : String
        itemId =
            "size-" ++ String.fromInt index

        width : Int
        width =
            item.width * 60

        height : Int
        height =
            item.height * 60
    in
    case system.info model.draggable of
        Just _ ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles width height item.color
                    ++ system.dropEvents globalIndex itemId
                )
                []

        _ ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles width height item.color
                )
                []


draggedItemView : Model -> Html.Html Msg
draggedItemView model =
    case ( system.info model.draggable, maybeDraggedItem model ) of
        ( Just { dragIndex, targetElement }, Just { color } ) ->
            let
                width : Int
                width =
                    round targetElement.element.width

                height : Int
                height =
                    round targetElement.element.height
            in
            Html.div
                (itemStyles width height color
                    ++ system.draggedStyles model.draggable
                    ++ [ Html.Attributes.style "width" (String.fromInt width ++ "px")
                       , Html.Attributes.style "height" (String.fromInt height ++ "px")
                       , Html.Attributes.style "transition" "width 0.5s, height 0.5s"
                       ]
                )
                []

        _ ->
            Html.text ""



-- HELPERS


maybeDraggedItem : Model -> Maybe Item
maybeDraggedItem { draggable, items } =
    system.info draggable
        |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)



-- COLORS


type alias Color =
    String


yellow : Color
yellow =
    "#cddc39"


blue : Color
blue =
    "#2592d3"


green : Color
green =
    "#25D366"


orange : Color
orange =
    "#dc9a39"


red : Color
red =
    "#dc4839"


gray : Color
gray =
    "dimgray"



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-top" "3em"
    ]


colorStyles : List (Html.Attribute msg)
colorStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-right" "3em"
    ]


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : Int -> Int -> String -> List (Html.Attribute msg)
itemStyles width height color =
    [ Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "margin" "0 3em 3em 0"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "width" (String.fromInt width ++ "px")
    , Html.Attributes.style "height" (String.fromInt height ++ "px")
    ]