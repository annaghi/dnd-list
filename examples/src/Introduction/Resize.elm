module Introduction.Resize exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

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


data : List Color
data =
    [ green
    , yellow
    , blue
    , orange
    , red
    ]


type alias Spot =
    { width : Int
    , height : Int
    }


spots : List Spot
spots =
    [ Spot 1 1
    , Spot 1 3
    , Spot 2 2
    , Spot 2 1
    , Spot 2 3
    ]



-- SYSTEM


config : DnDList.Config Color
config =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrag
    , operation = DnDList.Swap
    , beforeUpdate = \_ _ list -> list
    }


system : DnDList.System Color Msg
system =
    DnDList.create config MyMsg



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , colors : List Color
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , colors = data
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
                ( draggable, colors ) =
                    system.update msg model.draggable model.colors
            in
            ( { model
                | draggable = draggable
                , colors = colors
              }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section []
        [ List.map2 (\color spot -> ( color, spot )) model.colors spots
            |> List.indexedMap (itemView model)
            |> Html.div containerStyles
        , draggedItemView model
        ]


itemView : Model -> Int -> ( Color, Spot ) -> Html.Html Msg
itemView model index ( color, spot ) =
    let
        itemId : String
        itemId =
            "id-" ++ String.fromInt index

        width : Int
        width =
            spot.width * 5

        height : Int
        height =
            spot.height * 5
    in
    case system.info model.draggable of
        Just { dragIndex } ->
            if index /= dragIndex then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles width height color
                        ++ system.dropEvents index itemId
                    )
                    [ Html.div
                        handleStyles
                        [ Html.text "⠶" ]
                    ]

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles width height gray
                    )
                    []

        _ ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles width height color
                )
                [ Html.div
                    (handleStyles ++ system.dragEvents index itemId)
                    [ Html.text "⠶" ]
                ]


draggedItemView : Model -> Html.Html Msg
draggedItemView model =
    case ( system.info model.draggable, maybeDraggedItem model ) of
        ( Just { dragIndex, targetElement }, Just color ) ->
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
                [ Html.div
                    handleStyles
                    [ Html.text "⠶" ]
                ]

        _ ->
            Html.text ""



-- HELPERS


maybeDraggedItem : Model -> Maybe Color
maybeDraggedItem { draggable, colors } =
    system.info draggable
        |> Maybe.andThen (\{ dragIndex } -> colors |> List.drop dragIndex |> List.head)



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


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-top" "3em"
    ]


itemStyles : Int -> Int -> String -> List (Html.Attribute msg)
itemStyles width height color =
    [ Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "margin" "0 3em 3em 0"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "flex-start"
    , Html.Attributes.style "justify-content" "flex-start"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "width" (String.fromInt width ++ "rem")
    , Html.Attributes.style "height" (String.fromInt height ++ "rem")
    ]


handleStyles : List (Html.Attribute msg)
handleStyles =
    [ Html.Attributes.style "width" "60px"
    , Html.Attributes.style "height" "60px"
    , Html.Attributes.style "color" "black"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]
