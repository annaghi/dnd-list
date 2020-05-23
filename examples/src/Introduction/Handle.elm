module Introduction.Handle exposing (Model, Msg, initialModel, main, subscriptions, update, view)

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


config : DnDList.Config Fruit Msg
config =
    DnDList.config
        { movement = DnDList.Free
        , listen = DnDList.OnDrag
        , operation = DnDList.Swap
        }


system : DnDList.System Fruit Msg
system =
    DnDList.create DnDMsg config



-- MODEL


type alias Model =
    { fruits : List Fruit
    , dnd : DnDList.Model
    }


initialModel : Model
initialModel =
    { fruits = data
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
    = DnDMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DnDMsg dndMsg ->
            let
                ( fruits, dndModel, dndCmd ) =
                    system.update model.fruits dndMsg model.dnd
            in
            ( { model | fruits = fruits, dnd = dndModel }
            , dndCmd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section []
        [ model.fruits
            |> List.indexedMap (itemView model.dnd)
            |> Html.div containerStyles
        , ghostView model.dnd model.fruits
        ]


itemView : DnDList.Model -> Int -> Fruit -> Html.Html Msg
itemView dnd index fruit =
    let
        fruitId : String
        fruitId =
            "id-" ++ fruit
    in
    case system.info dnd of
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


ghostView : DnDList.Model -> List Fruit -> Html.Html Msg
ghostView dnd fruits =
    let
        maybeDragFruit : Maybe Fruit
        maybeDragFruit =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> fruits |> List.drop dragIndex |> List.head)
    in
    case maybeDragFruit of
        Just fruit ->
            Html.div
                (itemStyles orange ++ system.ghostStyles dnd)
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
