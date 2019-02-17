module Example.Horizontal exposing (Model, Msg, initialModel, source, subscriptions, update, view)

import DnDList
import Html
import Html.Attributes
import Html.Keyed



-- DATA


type alias Fruit =
    String


data : List ( String, Fruit )
data =
    [ "Apples", "Bananas", "Cherries", "Dates" ]
        |> List.indexedMap Tuple.pair
        |> List.map (\( k, v ) -> ( "key-" ++ String.fromInt k, v ))



-- SYSTEM


system : DnDList.System Msg
system =
    DnDList.create DnDMsg



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , fruits : List ( String, Fruit )
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
    = NoOp
    | DnDMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        DnDMsg message ->
            let
                ( draggable, fruits ) =
                    DnDList.update message model.draggable model.fruits
            in
            ( { model | draggable = draggable, fruits = fruits }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    let
        maybeDragIndex : Maybe Int
        maybeDragIndex =
            DnDList.getDragIndex model.draggable
    in
    Html.section
        [ Html.Attributes.style "margin" "6em 0" ]
        [ model.fruits
            |> List.indexedMap (itemView maybeDragIndex)
            |> Html.Keyed.node "div" containerStyles
        , draggedItemView model.draggable model.fruits
        ]


itemView : Maybe Int -> Int -> ( String, Fruit ) -> ( String, Html.Html Msg )
itemView maybeDragIndex index ( key, fruit ) =
    case maybeDragIndex of
        Nothing ->
            let
                fruitId : String
                fruitId =
                    "id-" ++ String.replace " " "-" fruit
            in
            ( key
            , Html.div
                [ Html.Attributes.style "margin" "0 2em" ]
                [ Html.div
                    (Html.Attributes.id fruitId :: itemStyles)
                    [ Html.div (handleStyles ++ system.dragEvents index fruitId) []
                    , Html.div [] [ Html.text fruit ]
                    ]
                ]
            )

        Just dragIndex ->
            if dragIndex /= index then
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "0 2em" ]
                    [ Html.div
                        (itemStyles ++ system.dropEvents index)
                        [ Html.div handleStyles []
                        , Html.div [] [ Html.text fruit ]
                        ]
                    ]
                )

            else
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "0 2em" ]
                    [ Html.div (itemStyles ++ overedItemStyles) [] ]
                )


draggedItemView : DnDList.Draggable -> List ( String, Fruit ) -> Html.Html Msg
draggedItemView draggable fruits =
    let
        maybeDraggedFruit : Maybe ( String, Fruit )
        maybeDraggedFruit =
            DnDList.getDragIndex draggable
                |> Maybe.andThen (\index -> fruits |> List.drop index |> List.head)
    in
    case maybeDraggedFruit of
        Just ( _, fruit ) ->
            Html.div
                (itemStyles
                    ++ draggedItemStyles
                    ++ system.draggedStyles draggable DnDList.Horizontal
                )
                [ Html.div (handleStyles ++ draggedHandleStyles) []
                , Html.div [] [ Html.text fruit ]
                ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "width" "180px"
    , Html.Attributes.style "height" "100px"
    , Html.Attributes.style "background" "#cddc39"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    ]


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
    , Html.Attributes.style "background" "#afb42b"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "margin" "20px"
    , Html.Attributes.style "cursor" "pointer"
    ]


draggedHandleStyles : List (Html.Attribute msg)
draggedHandleStyles =
    [ Html.Attributes.style "background" "#b4752b" ]



-- SOURCE


source : String
source =
    """
    module Horizontal exposing (main)

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


    data : List ( String, Fruit )
    data =
        [ "Apples", "Bananas", "Cherries", "Dates" ]
            |> List.indexedMap Tuple.pair
            |> List.map (\\( k, v ) -> ( "key-" ++ String.fromInt k, v ))



    -- SYSTEM


    system : DnDList.System Msg
    system =
        DnDList.create DnDMsg



    -- MODEL


    type alias Model =
        { draggable : DnDList.Draggable
        , fruits : List ( String, Fruit )
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
        = NoOp
        | DnDMsg DnDList.Msg


    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            NoOp ->
                ( model, Cmd.none )

            DnDMsg message ->
                let
                    ( draggable, fruits ) =
                        DnDList.update message model.draggable model.fruits
                in
                ( { model | draggable = draggable, fruits = fruits }
                , system.commands model.draggable
                )



    -- VIEW


    view : Model -> Html.Html Msg
    view model =
        let
            maybeDragIndex : Maybe Int
            maybeDragIndex =
                DnDList.getDragIndex model.draggable
        in
        Html.section
            [ Html.Attributes.style "margin" "6em 0" ]
            [ model.fruits
                |> List.indexedMap (itemView maybeDragIndex)
                |> Html.Keyed.node "div" containerStyles
            , draggedItemView model.draggable model.fruits
            ]


    itemView : Maybe Int -> Int -> ( String, Fruit ) -> ( String, Html.Html Msg )
    itemView maybeDragIndex index ( key, fruit ) =
        case maybeDragIndex of
            Nothing ->
                let
                    fruitId : String
                    fruitId =
                        "id-" ++ String.replace " " "-" fruit
                in
                ( key
                , Html.div
                    [ Html.Attributes.style "margin" "0 2em" ]
                    [ Html.div
                        (Html.Attributes.id fruitId :: itemStyles)
                        [ Html.div (handleStyles ++ system.dragEvents index fruitId) []
                        , Html.div [] [ Html.text fruit ]
                        ]
                    ]
                )

            Just dragIndex ->
                if dragIndex /= index then
                    ( key
                    , Html.div
                        [ Html.Attributes.style "margin" "0 2em" ]
                        [ Html.div
                            (itemStyles ++ system.dropEvents index)
                            [ Html.div handleStyles []
                            , Html.div [] [ Html.text fruit ]
                            ]
                        ]
                    )

                else
                    ( key
                    , Html.div
                        [ Html.Attributes.style "margin" "0 2em" ]
                        [ Html.div (itemStyles ++ overedItemStyles) [] ]
                    )


    draggedItemView : DnDList.Draggable -> List ( String, Fruit ) -> Html.Html Msg
    draggedItemView draggable fruits =
        let
            maybeDraggedFruit : Maybe ( String, Fruit )
            maybeDraggedFruit =
                DnDList.getDragIndex draggable
                    |> Maybe.andThen (\\index -> fruits |> List.drop index |> List.head)
        in
        case maybeDraggedFruit of
            Just ( _, fruit ) ->
                Html.div
                    (itemStyles
                        ++ draggedItemStyles
                        ++ system.draggedStyles draggable DnDList.Horizontal
                    )
                    [ Html.div (handleStyles ++ draggedHandleStyles) []
                    , Html.div [] [ Html.text fruit ]
                    ]

            Nothing ->
                Html.text ""



    -- STYLES


    containerStyles : List (Html.Attribute msg)
    containerStyles =
        [ Html.Attributes.style "display" "flex"
        , Html.Attributes.style "align-items" "center"
        , Html.Attributes.style "justify-content" "center"
        ]


    itemStyles : List (Html.Attribute msg)
    itemStyles =
        [ Html.Attributes.style "width" "180px"
        , Html.Attributes.style "height" "100px"
        , Html.Attributes.style "background" "#cddc39"
        , Html.Attributes.style "border-radius" "8px"
        , Html.Attributes.style "display" "flex"
        , Html.Attributes.style "align-items" "center"
        ]


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
        , Html.Attributes.style "background" "#afb42b"
        , Html.Attributes.style "border-radius" "8px"
        , Html.Attributes.style "margin" "20px"
        , Html.Attributes.style "cursor" "pointer"
        ]


    draggedHandleStyles : List (Html.Attribute msg)
    draggedHandleStyles =
        [ Html.Attributes.style "background" "#b4752b" ]
    """
