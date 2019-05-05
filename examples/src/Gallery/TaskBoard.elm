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


type Activity
    = ToDo
    | Doing
    | Done


type alias Card =
    { activity : Activity
    , description : String
    }


data : List Card
data =
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
    { beforeUpdate = \_ _ list -> list
    , listen = DnDList.Groups.OnDrag
    , operation = DnDList.Groups.Rotate
    , groups =
        { listen = DnDList.Groups.OnDrag
        , operation = DnDList.Groups.InsertBefore
        , comparator = comparator
        , setter = setter
        }
    }


comparator : Card -> Card -> Bool
comparator card1 card2 =
    card1.activity == card2.activity


setter : Card -> Card -> Card
setter card1 card2 =
    { card2 | activity = card1.activity }


cardSystem : DnDList.Groups.System Card Msg
cardSystem =
    DnDList.Groups.create cardConfig CardMoved


columnConfig : DnDList.Config (List Card)
columnConfig =
    { beforeUpdate = \_ _ list -> list
    , movement = DnDList.Free
    , listen = DnDList.OnDrag
    , operation = DnDList.Rotate
    }


columnSystem : DnDList.System (List Card) Msg
columnSystem =
    DnDList.create columnConfig ColumnMoved



-- MODEL


type alias Model =
    { cardDnD : DnDList.Groups.Model
    , columnDnD : DnDList.Model
    , cards : List Card
    }


initialModel : Model
initialModel =
    { cardDnD = cardSystem.model
    , columnDnD = columnSystem.model
    , cards = data
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ cardSystem.subscriptions model.cardDnD
        , columnSystem.subscriptions model.columnDnD
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
                ( cardDnD, cards ) =
                    cardSystem.update msg model.cardDnD model.cards
            in
            ( { model
                | cardDnD = cardDnD
                , cards = cards
              }
            , cardSystem.commands model.cardDnD
            )

        ColumnMoved msg ->
            let
                ( columnDnD, columns ) =
                    columnSystem.update msg model.columnDnD (gatherByActivity model.cards)
            in
            ( { model
                | columnDnD = columnDnD
                , cards = List.concat columns
              }
            , columnSystem.commands model.columnDnD
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
        , columnGhostView model
        , cardGhostView model
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
    in
    case columnSystem.info model.columnDnD of
        Just { dragIndex, dragElement } ->
            if dragIndex /= index then
                Html.div
                    (Html.Attributes.id columnId
                        :: columnStyles "transparent"
                        ++ columnSystem.dropEvents index columnId
                    )
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
                        dragElement.element.height |> round |> String.fromInt
                in
                Html.div
                    (Html.Attributes.id columnId
                        :: columnStyles gray
                        ++ [ Html.Attributes.style "height" (height ++ "px") ]
                    )
                    []

        _ ->
            Html.div
                (Html.Attributes.id columnId
                    :: columnStyles "transparent"
                )
                [ Html.h3
                    (columnHeadingStyles heading.color
                        ++ columnSystem.dragEvents index columnId
                    )
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
            offset + localIndex

        cardId : String
        cardId =
            "card-" ++ String.fromInt globalIndex
    in
    case ( cardSystem.info model.cardDnD, maybeDragCard model ) of
        ( Just { dragIndex }, Just dragCard ) ->
            if description == "" && activity /= dragCard.activity then
                Html.div
                    (Html.Attributes.id cardId :: auxiliaryCardStyles ++ cardSystem.dropEvents globalIndex cardId)
                    []

            else if description == "" && activity == dragCard.activity then
                Html.div
                    (Html.Attributes.id cardId :: auxiliaryCardStyles)
                    []

            else if globalIndex /= dragIndex then
                Html.div
                    (Html.Attributes.id cardId :: cardStyles yellow ++ cardSystem.dropEvents globalIndex cardId)
                    [ Html.text description ]

            else
                Html.div
                    (Html.Attributes.id cardId :: cardStyles gray)
                    []

        _ ->
            if description == "" then
                Html.div
                    (Html.Attributes.id cardId :: auxiliaryCardStyles)
                    []

            else
                Html.div
                    (Html.Attributes.id cardId :: cardStyles yellow ++ cursorStyles ++ cardSystem.dragEvents globalIndex cardId)
                    [ Html.text description ]


columnGhostView : Model -> Html.Html Msg
columnGhostView model =
    case maybeDragColumn model of
        Just cards ->
            let
                heading : Heading
                heading =
                    getActivity (List.take 1 cards)
            in
            Html.div
                (columnStyles "transparent" ++ columnSystem.ghostStyles model.columnDnD)
                [ Html.h3
                    (columnHeadingStyles heading.color)
                    [ Html.text heading.title ]
                , cards
                    |> List.map eventlessCardView
                    |> Html.div containerStyles
                ]

        _ ->
            Html.text ""


cardGhostView : Model -> Html.Html Msg
cardGhostView model =
    case maybeDragCard model of
        Just { description } ->
            Html.div
                (cardStyles yellow ++ cursorStyles ++ cardSystem.ghostStyles model.cardDnD)
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


maybeDragColumn : Model -> Maybe (List Card)
maybeDragColumn { columnDnD, cards } =
    columnSystem.info columnDnD
        |> Maybe.andThen (\{ dragIndex } -> gatherByActivity cards |> List.drop dragIndex |> List.head)


maybeDragCard : Model -> Maybe Card
maybeDragCard { cardDnD, cards } =
    cardSystem.info cardDnD
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
    , Html.Attributes.style "padding" "2em 0"
    ]


columnStyles : String -> List (Html.Attribute msg)
columnStyles color =
    [ Html.Attributes.style "background-color" color
    , Html.Attributes.style "box-shadow" "0 0 0 1px black"
    , Html.Attributes.style "width" "220px"
    ]


columnHeadingStyles : String -> List (Html.Attribute msg)
columnHeadingStyles color =
    [ Html.Attributes.style "background-color" color
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
    [ Html.Attributes.style "background-color" "#999999"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "height" "calc(100% - 80px)"
    , Html.Attributes.style "padding-top" "20px"
    ]


cardStyles : String -> List (Html.Attribute msg)
cardStyles color =
    [ Html.Attributes.style "background-color" color
    , Html.Attributes.style "color" "black"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin-bottom" "20px"
    , Html.Attributes.style "width" "170px"
    , Html.Attributes.style "height" "60px"
    ]


auxiliaryCardStyles : List (Html.Attribute msg)
auxiliaryCardStyles =
    [ Html.Attributes.style "background-color" "transparent"

    -- , Html.Attributes.style "box-shadow" "0 0 0 1px red"
    , Html.Attributes.style "flex-grow" "1"
    , Html.Attributes.style "width" "220px"
    , Html.Attributes.style "height" "auto"
    , Html.Attributes.style "min-height" "60px"
    ]


cursorStyles : List (Html.Attribute msg)
cursorStyles =
    [ Html.Attributes.style "cursor" "pointer" ]
