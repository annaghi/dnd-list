module Gallery.TaskBoard exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Groups
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


type alias Card =
    { activity : Activity
    , description : String
    }


type Activity
    = ToDo
    | Doing
    | Done


gatheredByActivity : List Card
gatheredByActivity =
    [ Card ToDo "D"
    , Card ToDo "B"
    , Card ToDo "A"
    , Card ToDo ""
    , Card Doing "C"
    , Card Doing "F"
    , Card Doing ""
    , Card Done "G"
    , Card Done "E"
    , Card Done ""
    ]



-- SYSTEM


cardConfig : DnDList.Groups.Config Card
cardConfig =
    { trigger = DnDList.Groups.OnDrag
    , operation = DnDList.Groups.RotateOut
    , beforeUpdate = \_ _ list -> list
    , groups =
        { comparator = compareByActivity
        , trigger = DnDList.Groups.OnDrag
        , operation = DnDList.Groups.InsertBefore
        , beforeUpdate = updateOnActivityChange
        }
    }


cardSystem : DnDList.Groups.System Card Msg
cardSystem =
    DnDList.Groups.create cardConfig CardMoved


compareByActivity : Card -> Card -> Bool
compareByActivity dragItem dropItem =
    dragItem.activity == dropItem.activity


updateOnActivityChange : Int -> Int -> List Card -> List Card
updateOnActivityChange dragIndex dropIndex list =
    let
        drop : List Card
        drop =
            list |> List.drop dropIndex |> List.take 1
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == dragIndex then
                    List.map2
                        (\dragItem dropItem -> { dragItem | activity = dropItem.activity })
                        [ item ]
                        drop

                else
                    [ item ]
            )
        |> List.concat


columnConfig : DnDList.Config (List Card)
columnConfig =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrag
    , operation = DnDList.RotateOut
    , beforeUpdate = \_ _ list -> list
    }


columnSystem : DnDList.System (List Card) Msg
columnSystem =
    DnDList.create columnConfig ColumnMoved



-- MODEL


type alias Model =
    { cardDraggable : DnDList.Groups.Draggable
    , columnDraggable : DnDList.Draggable
    , cards : List Card
    }


initialModel : Model
initialModel =
    { cardDraggable = cardSystem.draggable
    , columnDraggable = columnSystem.draggable
    , cards = gatheredByActivity
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ cardSystem.subscriptions model.cardDraggable
        , columnSystem.subscriptions model.columnDraggable
        ]



-- UPDATE


type Msg
    = CardMoved DnDList.Groups.Msg
    | ColumnMoved DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        CardMoved msg ->
            let
                ( cardDraggable, cards ) =
                    cardSystem.update msg model.cardDraggable model.cards
            in
            ( { model
                | cardDraggable = cardDraggable
                , cards = cards
              }
            , cardSystem.commands model.cardDraggable
            )

        ColumnMoved msg ->
            let
                ( columnDraggable, columns ) =
                    columnSystem.update msg model.columnDraggable (gatherByActivity model.cards)
            in
            ( { model
                | columnDraggable = columnDraggable
                , cards = List.concat columns
              }
            , columnSystem.commands model.columnDraggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    let
        columns : List (List Card)
        columns =
            gatherByActivity model.cards

        calculateOffset : Int -> Int
        calculateOffset columnIndex =
            columns |> List.map List.length |> List.take columnIndex |> List.foldl (+) 0
    in
    Html.section []
        [ columns
            |> List.indexedMap (\i column -> columnView model (calculateOffset i) i column)
            |> Html.div boardStyles
        , draggedColumnView model
        , draggedCardView model
        ]


columnView : Model -> Int -> Int -> List Card -> Html.Html Msg
columnView model offset index cards =
    let
        heading : Heading
        heading =
            getActivity (List.take 1 cards)

        columnId : String
        columnId =
            "column-" ++ String.fromInt index

        attrs color =
            Html.Attributes.id columnId :: columnStyles color
    in
    case columnSystem.info model.columnDraggable of
        Just { dragIndex, sourceElement } ->
            if dragIndex /= index then
                Html.div
                    (attrs "transparent" ++ columnSystem.dropEvents index columnId)
                    [ Html.h3
                        (columnHeadingStyles heading.color)
                        [ Html.text heading.title ]
                    , cards
                        |> List.map eventlessCardView
                        |> Html.div containerStyles
                    ]

            else
                let
                    height : String
                    height =
                        sourceElement.element.height |> round |> String.fromInt
                in
                Html.div
                    (attrs gray ++ [ Html.Attributes.style "height" (height ++ "px") ])
                    []

        _ ->
            Html.div
                (attrs "transparent")
                [ Html.h3
                    (columnHeadingStyles heading.color ++ columnSystem.dragEvents index columnId)
                    [ Html.text heading.title ]
                , cards
                    |> List.indexedMap (eventfulCardView model offset)
                    |> Html.div containerStyles
                ]


eventlessCardView : Card -> Html.Html Msg
eventlessCardView { description } =
    if description == "" then
        Html.div auxiliaryCardStyles []

    else
        Html.div (cardStyles yellow) [ Html.text description ]


eventfulCardView : Model -> Int -> Int -> Card -> Html.Html Msg
eventfulCardView model offset localIndex { activity, description } =
    let
        globalIndex : Int
        globalIndex =
            localIndex + offset

        cardId : String
        cardId =
            "card-" ++ String.fromInt globalIndex

        attrs styles =
            Html.Attributes.id cardId :: styles
    in
    case ( cardSystem.info model.cardDraggable, maybeDraggedCard model ) of
        ( Just { dragIndex }, Just dragCard ) ->
            if description == "" && activity /= dragCard.activity then
                Html.div
                    (attrs auxiliaryCardStyles ++ cardSystem.dropEvents globalIndex cardId)
                    []

            else if description == "" && activity == dragCard.activity then
                Html.div
                    (attrs auxiliaryCardStyles)
                    []

            else if globalIndex /= dragIndex then
                Html.div
                    (attrs (cardStyles yellow) ++ cardSystem.dropEvents globalIndex cardId)
                    [ Html.text description ]

            else
                Html.div
                    (attrs (cardStyles gray))
                    []

        _ ->
            if description == "" then
                Html.div
                    (attrs auxiliaryCardStyles)
                    []

            else
                Html.div
                    (attrs (cardStyles yellow) ++ draggableCardStyles ++ cardSystem.dragEvents globalIndex cardId)
                    [ Html.text description ]


draggedColumnView : Model -> Html.Html Msg
draggedColumnView model =
    case maybeDraggedColumn model of
        Just cards ->
            let
                heading : Heading
                heading =
                    getActivity (List.take 1 cards)
            in
            Html.div
                (columnStyles "transparent" ++ columnSystem.draggedStyles model.columnDraggable)
                [ Html.h3
                    (columnHeadingStyles heading.color)
                    [ Html.text heading.title ]
                , cards
                    |> List.map eventlessCardView
                    |> Html.div containerStyles
                ]

        _ ->
            Html.text ""


draggedCardView : Model -> Html.Html Msg
draggedCardView model =
    case maybeDraggedCard model of
        Just { description } ->
            Html.div
                (cardStyles yellow ++ draggableCardStyles ++ cardSystem.draggedStyles model.cardDraggable)
                [ Html.text description ]

        _ ->
            Html.text ""



-- HELPERS


gatherByActivity : List Card -> List (List Card)
gatherByActivity cards =
    List.foldr
        (\x acc ->
            case acc of
                [] ->
                    [ [ x ] ]

                (y :: restOfGroup) :: groups ->
                    if x.activity == y.activity then
                        (x :: y :: restOfGroup) :: groups

                    else
                        [ x ] :: acc

                [] :: _ ->
                    acc
        )
        []
        cards


maybeDraggedColumn : Model -> Maybe (List Card)
maybeDraggedColumn { columnDraggable, cards } =
    columnSystem.info columnDraggable
        |> Maybe.andThen (\{ dragIndex } -> gatherByActivity cards |> List.drop dragIndex |> List.head)


maybeDraggedCard : Model -> Maybe Card
maybeDraggedCard { cardDraggable, cards } =
    cardSystem.info cardDraggable
        |> Maybe.andThen (\{ dragIndex } -> cards |> List.drop dragIndex |> List.head)


type alias Heading =
    { title : String
    , color : String
    }


getActivity : List Card -> Heading
getActivity cards =
    case cards of
        [] ->
            Heading "" ""

        card :: rest ->
            case card.activity of
                ToDo ->
                    Heading "To Do" blue

                Doing ->
                    Heading "Doing" red

                Done ->
                    Heading "Done" green



-- COLORS


yellow : String
yellow =
    "#ffdf76"


blue : String
blue =
    "#055b8f"


red : String
red =
    "#8f055b"


green : String
green =
    "#5b8f05"


gray : String
gray =
    "#a5a5a5"



-- STYLES


boardStyles : List (Html.Attribute msg)
boardStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin" "0 auto"
    , Html.Attributes.style "min-height" "600px"
    , Html.Attributes.style "padding" "3em"
    ]


columnStyles : String -> List (Html.Attribute msg)
columnStyles color =
    [ Html.Attributes.style "background" color
    , Html.Attributes.style "box-shadow" "0 0 0 1px black"
    , Html.Attributes.style "width" "220px"
    ]


columnHeadingStyles : String -> List (Html.Attribute msg)
columnHeadingStyles color =
    [ Html.Attributes.style "background" color
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "height" "60px"
    , Html.Attributes.style "margin" "0"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "background" "#999999"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "height" "calc(100% - 80px)"
    , Html.Attributes.style "padding-top" "20px"
    ]


cardStyles : String -> List (Html.Attribute msg)
cardStyles color =
    [ Html.Attributes.style "background" color
    , Html.Attributes.style "color" "black"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin-bottom" "20px"
    , Html.Attributes.style "width" "170px"
    , Html.Attributes.style "height" "60px"
    ]


draggableCardStyles : List (Html.Attribute msg)
draggableCardStyles =
    [ Html.Attributes.style "cursor" "pointer" ]


auxiliaryCardStyles : List (Html.Attribute msg)
auxiliaryCardStyles =
    [ Html.Attributes.style "background" "transparent"

    -- , Html.Attributes.style "box-shadow" "0 0 0 1px red"
    , Html.Attributes.style "flex-grow" "1"
    , Html.Attributes.style "width" "220px"
    , Html.Attributes.style "height" "auto"
    , Html.Attributes.style "min-height" "60px"
    ]
