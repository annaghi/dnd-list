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


data1 : List ( String, Fruit )
data1 =
    [ "Apples", "Bananas", "Cherries", "Dates" ]
        |> List.indexedMap Tuple.pair
        |> List.map (\( k, v ) -> ( "key-fruit-" ++ String.fromInt k, v ))


data2 : List ( String, String )
data2 =
    List.range 1 6
        |> List.indexedMap Tuple.pair
        |> List.map (\( k, v ) -> ( "key-number-" ++ String.fromInt k, String.fromInt v ))



-- SYSTEM


systemFruit : DnDList.System Msg
systemFruit =
    DnDList.create FruitMsg


systemNumber : DnDList.System Msg
systemNumber =
    DnDList.create NumberMsg



-- MODEL


type alias Model =
    { draggableFruit : DnDList.Draggable
    , draggableNumber : DnDList.Draggable
    , fruits : List ( String, Fruit )
    , numbers : List ( String, String )
    }


initialModel : Model
initialModel =
    { draggableFruit = systemFruit.draggable
    , draggableNumber = systemNumber.draggable
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
        [ systemFruit.subscriptions model.draggableFruit
        , systemNumber.subscriptions model.draggableNumber
        ]



-- UPDATE


type Msg
    = NoOp
    | FruitMsg DnDList.Msg
    | NumberMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        FruitMsg message ->
            let
                ( draggableFruit, fruits ) =
                    DnDList.update message model.draggableFruit model.fruits
            in
            ( { model
                | draggableFruit = draggableFruit
                , fruits = fruits
              }
            , systemFruit.commands model.draggableFruit
            )

        NumberMsg message ->
            let
                ( draggableNumber, numbers ) =
                    DnDList.update message model.draggableNumber model.numbers
            in
            ( { model
                | draggableNumber = draggableNumber
                , numbers = numbers
              }
            , systemNumber.commands model.draggableNumber
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    let
        maybeDragFruitIndex : Maybe Int
        maybeDragFruitIndex =
            DnDList.getDragIndex model.draggableFruit

        maybeDragNumberIndex : Maybe Int
        maybeDragNumberIndex =
            DnDList.getDragIndex model.draggableNumber
    in
    Html.section
        [ Html.Attributes.style "margin" "6em 0" ]
        [ model.fruits
            |> List.indexedMap (fruitView maybeDragFruitIndex)
            |> Html.Keyed.node "div" containerStyles
        , model.numbers
            |> List.indexedMap (numberView maybeDragNumberIndex)
            |> Html.Keyed.node "div" containerStyles
        , draggedFruitView model.draggableFruit model.fruits
        , draggedNumberView model.draggableNumber model.numbers
        ]


fruitView : Maybe Int -> Int -> ( String, Fruit ) -> ( String, Html.Html Msg )
fruitView maybeDragIndex index ( key, fruit ) =
    case maybeDragIndex of
        Nothing ->
            let
                fruitId : String
                fruitId =
                    "id-" ++ String.replace " " "-" fruit
            in
            ( key
            , Html.div
                [ Html.Attributes.style "margin" "0 2em 2em 2em" ]
                [ Html.div
                    (Html.Attributes.id fruitId :: itemStyles ++ fruitStyles)
                    [ Html.div (handleStyles ++ fruitHandleStyles ++ systemFruit.dragEvents index fruitId) []
                    , Html.div [] [ Html.text fruit ]
                    ]
                ]
            )

        Just dragIndex ->
            if dragIndex /= index then
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "0 2em 2em 2em" ]
                    [ Html.div
                        (itemStyles
                            ++ fruitStyles
                            ++ systemFruit.dropEvents index
                        )
                        [ Html.div (handleStyles ++ fruitHandleStyles) []
                        , Html.div [] [ Html.text fruit ]
                        ]
                    ]
                )

            else
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "0 2em 2em 2em" ]
                    [ Html.div (itemStyles ++ overedItemStyles) [] ]
                )


draggedFruitView : DnDList.Draggable -> List ( String, Fruit ) -> Html.Html Msg
draggedFruitView draggableFruit fruits =
    let
        maybeDraggedFruit : Maybe ( String, Fruit )
        maybeDraggedFruit =
            DnDList.getDragIndex draggableFruit
                |> Maybe.andThen (\index -> fruits |> List.drop index |> List.head)
    in
    case maybeDraggedFruit of
        Just ( _, fruit ) ->
            Html.div
                (itemStyles
                    ++ draggedItemStyles
                    ++ systemFruit.draggedStyles draggableFruit DnDList.Free
                )
                [ Html.div (handleStyles ++ draggedHandleStyles) []
                , Html.div [] [ Html.text fruit ]
                ]

        Nothing ->
            Html.text ""


numberView : Maybe Int -> Int -> ( String, String ) -> ( String, Html.Html Msg )
numberView maybeDragIndex index ( key, number ) =
    case maybeDragIndex of
        Nothing ->
            let
                numberId : String
                numberId =
                    "id-" ++ String.replace " " "-" number
            in
            ( key
            , Html.div
                [ Html.Attributes.style "margin" "2em 2em 0 2em" ]
                [ Html.div
                    (Html.Attributes.id numberId :: itemStyles ++ numberStyles)
                    [ Html.div (handleStyles ++ numberHandleStyles ++ systemNumber.dragEvents index numberId) []
                    , Html.div [] [ Html.text number ]
                    ]
                ]
            )

        Just dragIndex ->
            if dragIndex /= index then
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "2em 2em 0 2em" ]
                    [ Html.div
                        (itemStyles
                            ++ numberStyles
                            ++ systemNumber.dropEvents index
                        )
                        [ Html.div (handleStyles ++ numberHandleStyles) []
                        , Html.div [] [ Html.text number ]
                        ]
                    ]
                )

            else
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "2em 2em 0 2em" ]
                    [ Html.div (itemStyles ++ overedItemStyles) [] ]
                )


draggedNumberView : DnDList.Draggable -> List ( String, String ) -> Html.Html Msg
draggedNumberView draggableNumber numbers =
    let
        maybeDraggedNumber : Maybe ( String, String )
        maybeDraggedNumber =
            DnDList.getDragIndex draggableNumber
                |> Maybe.andThen (\index -> numbers |> List.drop index |> List.head)
    in
    case maybeDraggedNumber of
        Just ( _, number ) ->
            Html.div
                (itemStyles
                    ++ draggedItemStyles
                    ++ systemNumber.draggedStyles draggableNumber DnDList.Free
                )
                [ Html.div (handleStyles ++ draggedHandleStyles) []
                , Html.div [] [ Html.text number ]
                ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "flex-end"
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
    [ Html.Attributes.style "background" "#39cddc" ]


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
    [ Html.Attributes.style "background" "#2bafb4" ]


draggedHandleStyles : List (Html.Attribute msg)
draggedHandleStyles =
    [ Html.Attributes.style "background" "#b4752b" ]
