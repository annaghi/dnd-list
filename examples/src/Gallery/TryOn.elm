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
    [ Item Color 1 1 papayaWhip
    , Item Color 1 1 pink
    , Item Color 1 1 violet
    , Item Color 1 1 lavender
    , Item Size 1 2 gray
    , Item Size 2 2 gray
    , Item Size 1 3 gray
    , Item Size 2 3 gray
    , Item Size 3 3 gray
    ]



-- SYSTEM


config : DnDList.Config Item
config =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrop
    , operation = DnDList.Unaltered
    , beforeUpdate = updateColor
    }


system : DnDList.System Item Msg
system =
    DnDList.create config MyMsg


updateColor : Int -> Int -> List Item -> List Item
updateColor dragIndex dropIndex list =
    let
        drag : List Item
        drag =
            list |> List.drop dragIndex |> List.take 1
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == dropIndex then
                    List.map2
                        (\dragItem dropItem -> { dropItem | color = dragItem.color })
                        drag
                        [ item ]

                else if index == dragIndex then
                    case item.property of
                        Size ->
                            [ { item | color = gray } ]

                        _ ->
                            [ item ]

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
            |> Html.div sizeStyles
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
            item.width * 5

        height : Int
        height =
            item.height * 5
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
            item.width * 4

        height : Int
        height =
            item.height * 4
    in
    case system.info model.draggable of
        Just { dragIndex } ->
            if dragIndex /= globalIndex then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles width height item.color
                        ++ system.dropEvents globalIndex itemId
                    )
                    []

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles width height gray
                        ++ system.dropEvents globalIndex itemId
                    )
                    []

        _ ->
            if item.color /= gray then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles width height item.color
                        ++ system.dragEvents globalIndex itemId
                    )
                    []

            else
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
                baseFontSize : Float
                baseFontSize =
                    16

                width : Int
                width =
                    round (targetElement.element.width / baseFontSize)

                height : Int
                height =
                    round (targetElement.element.height / baseFontSize)
            in
            Html.div
                (itemStyles width height color
                    ++ system.draggedStyles model.draggable
                    ++ [ Html.Attributes.style "width" (String.fromInt width ++ "rem")
                       , Html.Attributes.style "height" (String.fromInt height ++ "rem")
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


lavender : Color
lavender =
    "#956dbd"


violet : Color
violet =
    "#d291bc"


pink : Color
pink =
    "#fec8d8"


papayaWhip : Color
papayaWhip =
    "#ffead3"


gray : Color
gray =
    "dimgray"



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-top" "3rem"
    ]


colorStyles : List (Html.Attribute msg)
colorStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-right" "3rem"
    ]


sizeStyles : List (Html.Attribute msg)
sizeStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "baseline"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : Int -> Int -> String -> List (Html.Attribute msg)
itemStyles width height color =
    [ Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "margin" "0 3rem 3rem 0"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "width" (String.fromInt width ++ "rem")
    , Html.Attributes.style "height" (String.fromInt height ++ "rem")
    ]
