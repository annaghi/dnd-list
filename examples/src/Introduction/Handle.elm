module Introduction.Handle exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

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


type alias Fruit =
    String


data : List Fruit
data =
    [ "Apples", "Bananas", "Cherries", "Dates" ]



-- SYSTEM


config : DnDList.Config Fruit
config =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrag
    , operation = DnDList.Swap
    , beforeUpdate = \_ _ list -> list
    }


system : DnDList.System Fruit Msg
system =
    DnDList.create config MyMsg



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , fruits : List Fruit
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , fruits = data
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
                ( draggable, fruits ) =
                    system.update msg model.draggable model.fruits
            in
            ( { model | draggable = draggable, fruits = fruits }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section []
        [ model.fruits
            |> List.indexedMap (itemView model.draggable)
            |> Html.div containerStyles
        , draggedItemView model.draggable model.fruits
        ]


itemView : DnDList.Draggable -> Int -> Fruit -> Html.Html Msg
itemView draggable index fruit =
    let
        fruitId : String
        fruitId =
            "id-" ++ fruit
    in
    case system.info draggable of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (Html.Attributes.id fruitId :: itemStyles green ++ system.dropEvents index fruitId)
                    [ Html.div (handleStyles darkGreen) []
                    , Html.text fruit
                    ]

            else
                Html.div
                    (Html.Attributes.id fruitId :: itemStyles "dimgray")
                    []

        Nothing ->
            Html.div
                (Html.Attributes.id fruitId :: itemStyles green)
                [ Html.div (handleStyles darkGreen ++ system.dragEvents index fruitId) []
                , Html.text fruit
                ]


draggedItemView : DnDList.Draggable -> List Fruit -> Html.Html Msg
draggedItemView draggable fruits =
    let
        maybeDraggedFruit : Maybe Fruit
        maybeDraggedFruit =
            system.info draggable
                |> Maybe.andThen (\{ dragIndex } -> fruits |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedFruit of
        Just fruit ->
            Html.div
                (itemStyles orange ++ system.draggedStyles draggable)
                [ Html.div (handleStyles darkOrange) []
                , Html.text fruit
                ]

        Nothing ->
            Html.text ""



-- COLORS


green : String
green =
    "#cddc39"


orange : String
orange =
    "#dc9a39"


darkGreen : String
darkGreen =
    "#afb42b"


darkOrange : String
darkOrange =
    "#b4752b"



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-top" "4em"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "180px"
    , Html.Attributes.style "height" "100px"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "#000"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "margin" "0 4em 4em 0"
    ]


handleStyles : String -> List (Html.Attribute msg)
handleStyles color =
    [ Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "margin" "20px"
    , Html.Attributes.style "cursor" "pointer"
    ]
