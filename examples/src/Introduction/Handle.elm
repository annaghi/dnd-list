module Introduction.Handle exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Single
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



-- DND


system : DnDList.Single.System Fruit Msg
system =
    DnDList.Single.config
        |> DnDList.Single.operation DnDList.Swap
        |> DnDList.Single.create DnDMsg



-- MODEL


type alias Model =
    { fruits : List Fruit
    , dnd : DnDList.Single.Model
    }


initialModel : Model
initialModel =
    { fruits = data
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


itemView : DnDList.Single.Model -> Int -> Fruit -> Html.Html Msg
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
                    (Html.Attributes.id fruitId :: itemStyles "gainsboro")
                    []

        Nothing ->
            Html.div
                (Html.Attributes.id fruitId :: itemStyles green)
                [ Html.div (handleStyles darkGreen ++ system.dragEvents index fruitId) []
                , Html.text fruit
                ]


ghostView : DnDList.Single.Model -> List Fruit -> Html.Html Msg
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
                (ghostStyles "#d8dee9" ++ system.ghostStyles dnd)
                [ Html.div (handleStyles darkOrange) []
                , Html.text fruit
                ]

        Nothing ->
            Html.text ""



-- COLORS


green : String
green =
    "#8ca9cd"


orange : String
orange =
    "#3f6593"


darkGreen : String
darkGreen =
    "#88c0d0"


darkOrange : String
darkOrange =
    "#8ca9cd"



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-top" "2rem"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "10rem"
    , Html.Attributes.style "height" "5rem"
    , Html.Attributes.style "border" ("1px solid " ++ color)
    , Html.Attributes.style "box-shadow" "0 25px 50px -12px #d8dee9"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "margin" "0 4rem 4rem 0"
    ]


handleStyles : String -> List (Html.Attribute msg)
handleStyles color =
    [ Html.Attributes.style "width" "2.5rem"
    , Html.Attributes.style "height" "2.5rem"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "margin" "1rem"
    , Html.Attributes.style "cursor" "pointer"
    ]


ghostStyles : String -> List (Html.Attribute msg)
ghostStyles color =
    [ Html.Attributes.style "width" "10rem"
    , Html.Attributes.style "height" "5rem"
    , Html.Attributes.style "border" ("1px solid " ++ "#8ca9cd")
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "margin" "0 4rem 4rem 0"
    ]
