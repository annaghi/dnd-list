module WithTwoLists exposing (main)

import Browser
import DnDList
import Html
import Html.Attributes
import Html.Keyed



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


type alias KeyedFruit =
    ( String, Fruit )


type alias KeyedNumber =
    ( String, Int )


data1 : List KeyedFruit
data1 =
    [ "Apples", "Bananas", "Cherries", "Dates" ]
        |> List.indexedMap (\k v -> ( "key-fruit-" ++ String.fromInt k, v ))


data2 : List KeyedNumber
data2 =
    List.range 1 6
        |> List.map (\i -> ( "key-number-" ++ String.fromInt i, i ))



-- SYSTEM


fruitConfig : DnDList.Config Msg
fruitConfig =
    { message = FruitMsg
    , movement = DnDList.Free DnDList.Rotate
    }


fruitSystem : DnDList.System Msg KeyedFruit
fruitSystem =
    DnDList.create fruitConfig


numberConfig : DnDList.Config Msg
numberConfig =
    { message = NumberMsg
    , movement = DnDList.Free DnDList.Rotate
    }


numberSystem : DnDList.System Msg KeyedNumber
numberSystem =
    DnDList.create numberConfig



-- MODEL


type alias Model =
    { fruitDraggable : DnDList.Draggable
    , numberDraggable : DnDList.Draggable
    , fruits : List KeyedFruit
    , numbers : List KeyedNumber
    }


initialModel : Model
initialModel =
    { fruitDraggable = fruitSystem.draggable
    , numberDraggable = numberSystem.draggable
    , fruits = data1
    , numbers = data2
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ fruitSystem.subscriptions model.fruitDraggable
        , numberSystem.subscriptions model.numberDraggable
        ]



-- UPDATE


type Msg
    = FruitMsg DnDList.Msg
    | NumberMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FruitMsg message ->
            let
                ( fruitDraggable, fruits ) =
                    fruitSystem.update message model.fruitDraggable model.fruits
            in
            ( { model
                | fruitDraggable = fruitDraggable
                , fruits = fruits
              }
            , fruitSystem.commands model.fruitDraggable
            )

        NumberMsg message ->
            let
                ( numberDraggable, numbers ) =
                    numberSystem.update message model.numberDraggable model.numbers
            in
            ( { model
                | numberDraggable = numberDraggable
                , numbers = numbers
              }
            , numberSystem.commands model.numberDraggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    let
        maybeFruitDragIndex : Maybe Int
        maybeFruitDragIndex =
            fruitSystem.dragIndex model.fruitDraggable

        maybeNumberDragIndex : Maybe Int
        maybeNumberDragIndex =
            numberSystem.dragIndex model.numberDraggable
    in
    Html.section
        [ Html.Attributes.style "margin" "6em 0" ]
        [ model.fruits
            |> List.indexedMap (fruitView maybeFruitDragIndex)
            |> Html.Keyed.node "div" containerStyles
        , model.numbers
            |> List.indexedMap (numberView maybeNumberDragIndex)
            |> Html.Keyed.node "div" containerStyles
        , draggedFruitView model.fruitDraggable model.fruits
        , draggedNumberView model.numberDraggable model.numbers
        ]


fruitView : Maybe Int -> Int -> KeyedFruit -> ( String, Html.Html Msg )
fruitView maybeDragIndex index ( key, fruit ) =
    case maybeDragIndex of
        Nothing ->
            let
                fruitId : String
                fruitId =
                    "id-" ++ fruit
            in
            ( key
            , Html.div
                [ Html.Attributes.style "margin" "0 2em 2em 0" ]
                [ Html.div
                    (Html.Attributes.id fruitId :: itemStyles ++ fruitStyles)
                    [ Html.div (handleStyles ++ fruitHandleStyles ++ fruitSystem.dragEvents index fruitId) []
                    , Html.text fruit
                    ]
                ]
            )

        Just dragIndex ->
            if dragIndex /= index then
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "0 2em 2em 0" ]
                    [ Html.div
                        (itemStyles
                            ++ fruitStyles
                            ++ fruitSystem.dropEvents index
                        )
                        [ Html.div (handleStyles ++ fruitHandleStyles) []
                        , Html.text fruit
                        ]
                    ]
                )

            else
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "0 2em 2em 0" ]
                    [ Html.div (itemStyles ++ overedItemStyles) [] ]
                )


draggedFruitView : DnDList.Draggable -> List KeyedFruit -> Html.Html Msg
draggedFruitView fruitDraggable fruits =
    let
        maybeDraggedFruit : Maybe KeyedFruit
        maybeDraggedFruit =
            fruitSystem.dragIndex fruitDraggable
                |> Maybe.andThen (\index -> fruits |> List.drop index |> List.head)
    in
    case maybeDraggedFruit of
        Just ( _, fruit ) ->
            Html.div
                (itemStyles ++ draggedItemStyles ++ fruitSystem.draggedStyles fruitDraggable)
                [ Html.div (handleStyles ++ draggedHandleStyles) []
                , Html.text fruit
                ]

        Nothing ->
            Html.text ""


numberView : Maybe Int -> Int -> KeyedNumber -> ( String, Html.Html Msg )
numberView maybeDragIndex index ( key, number ) =
    case maybeDragIndex of
        Nothing ->
            let
                numberId : String
                numberId =
                    "id-" ++ String.fromInt number
            in
            ( key
            , Html.div
                [ Html.Attributes.style "margin" "2em 2em 0 0" ]
                [ Html.div
                    (Html.Attributes.id numberId :: itemStyles ++ numberStyles)
                    [ Html.div (handleStyles ++ numberHandleStyles ++ numberSystem.dragEvents index numberId) []
                    , Html.text (String.fromInt number)
                    ]
                ]
            )

        Just dragIndex ->
            if dragIndex /= index then
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "2em 2em 0 0" ]
                    [ Html.div
                        (itemStyles
                            ++ numberStyles
                            ++ numberSystem.dropEvents index
                        )
                        [ Html.div (handleStyles ++ numberHandleStyles) []
                        , Html.text (String.fromInt number)
                        ]
                    ]
                )

            else
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "2em 2em 0 0" ]
                    [ Html.div (itemStyles ++ overedItemStyles) [] ]
                )


draggedNumberView : DnDList.Draggable -> List KeyedNumber -> Html.Html Msg
draggedNumberView numberDraggable numbers =
    let
        maybeDraggedNumber : Maybe KeyedNumber
        maybeDraggedNumber =
            numberSystem.dragIndex numberDraggable
                |> Maybe.andThen (\index -> numbers |> List.drop index |> List.head)
    in
    case maybeDraggedNumber of
        Just ( _, number ) ->
            Html.div
                (itemStyles ++ draggedItemStyles ++ numberSystem.draggedStyles numberDraggable)
                [ Html.div (handleStyles ++ draggedHandleStyles) []
                , Html.text (String.fromInt number)
                ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "flex-start"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "width" "180px"
    , Html.Attributes.style "height" "100px"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    ]


fruitStyles : List (Html.Attribute msg)
fruitStyles =
    [ Html.Attributes.style "background" "#cddc39" ]


numberStyles : List (Html.Attribute msg)
numberStyles =
    [ Html.Attributes.style "background" "#7cdc39" ]


draggedItemStyles : List (Html.Attribute msg)
draggedItemStyles =
    [ Html.Attributes.style "background" "#dc9a39" ]


overedItemStyles : List (Html.Attribute msg)
overedItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]


handleStyles : List (Html.Attribute msg)
handleStyles =
    [ Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "margin" "20px"
    , Html.Attributes.style "cursor" "pointer"
    ]


fruitHandleStyles : List (Html.Attribute msg)
fruitHandleStyles =
    [ Html.Attributes.style "background" "#afb42b" ]


numberHandleStyles : List (Html.Attribute msg)
numberHandleStyles =
    [ Html.Attributes.style "background" "#6bb42b" ]


draggedHandleStyles : List (Html.Attribute msg)
draggedHandleStyles =
    [ Html.Attributes.style "background" "#b4752b" ]
