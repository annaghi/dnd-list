module Gallery.Parent exposing
    ( Example
    , Msg
    , chapterView
    , init
    , subscriptions
    , update
    , view
    )

import AssocList
import CustomElement
import Dict
import Gallery.Hanoi
import Gallery.Knight
import Gallery.Puzzle
import Gallery.Shapes
import Gallery.TaskBoard
import Gallery.TryOn
import Global
import Html
import Views



-- WORKAROUND ENUM TYPE


defaultMeta : Views.Metadata Example
defaultMeta =
    { segment = "hanoi"
    , title = "Towers of Hanoi"
    , description = "Single list with auxiliary items."
    , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Hanoi.elm"
    , initialModel = Hanoi Gallery.Hanoi.initialModel
    }


meta : List (Views.Metadata Example)
meta =
    [ defaultMeta
    , { segment = "puzzle"
      , title = "Puzzle"
      , description = "List with groups without auxiliary items."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Puzzle.elm"
      , initialModel = Puzzle Gallery.Puzzle.initialModel
      }
    , { segment = "shapes"
      , title = "Geometric shapes"
      , description = "Single list with the Unaltered operation and beforeUpdate."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Shapes.elm"
      , initialModel = Shapes Gallery.Shapes.initialModel
      }
    , { segment = "knight"
      , title = "Knight's tour"
      , description = "Single list with Swap. The top-left 5 × 5 sub-board is diced from the original 8 × 8 board."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Knight.elm"
      , initialModel = Knight Gallery.Knight.initialModel
      }
    , { segment = "try-on"
      , title = "Try on"
      , description = "Single list with info.targetElement."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/TryOn.elm"
      , initialModel = TryOn Gallery.TryOn.initialModel
      }
    , { segment = "taskboard"
      , title = "Task board"
      , description = "Two systems - one for the cards and one for the columns."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/TaskBoard.elm"
      , initialModel = TaskBoard Gallery.TaskBoard.initialModel
      }
    ]


type Tag
    = HanoiTag
    | PuzzleTag
    | ShapesTag
    | KnightTag
    | TryOnTag
    | TaskBoardTag


allTags : List Tag
allTags =
    let
        ignored : Tag -> ()
        ignored tag =
            case tag of
                HanoiTag ->
                    ()

                PuzzleTag ->
                    ()

                ShapesTag ->
                    ()

                KnightTag ->
                    ()

                TryOnTag ->
                    ()

                TaskBoardTag ->
                    ()
    in
    [ HanoiTag
    , PuzzleTag
    , ShapesTag
    , KnightTag
    , TryOnTag
    , TaskBoardTag
    ]


exampleToTag : Example -> Tag
exampleToTag example =
    case example of
        Hanoi _ ->
            HanoiTag

        Puzzle _ ->
            PuzzleTag

        Shapes _ ->
            ShapesTag

        Knight _ ->
            KnightTag

        TryOn _ ->
            TryOnTag

        TaskBoard _ ->
            TaskBoardTag


tagSegmentDict : AssocList.Dict Tag (Views.Metadata Example)
tagSegmentDict =
    List.map2 Tuple.pair allTags meta |> AssocList.fromList


tagToMetadata : Tag -> Views.Metadata Example
tagToMetadata tag =
    Maybe.withDefault defaultMeta <|
        case tag of
            HanoiTag ->
                AssocList.get HanoiTag tagSegmentDict

            PuzzleTag ->
                AssocList.get PuzzleTag tagSegmentDict

            ShapesTag ->
                AssocList.get ShapesTag tagSegmentDict

            KnightTag ->
                AssocList.get KnightTag tagSegmentDict

            TryOnTag ->
                AssocList.get TryOnTag tagSegmentDict

            TaskBoardTag ->
                AssocList.get TaskBoardTag tagSegmentDict



-- MODEL


type Example
    = Hanoi Gallery.Hanoi.Model
    | Puzzle Gallery.Puzzle.Model
    | Shapes Gallery.Shapes.Model
    | Knight Gallery.Knight.Model
    | TryOn Gallery.TryOn.Model
    | TaskBoard Gallery.TaskBoard.Model


init : String -> ( Example, Cmd Msg )
init segment =
    ( meta
        |> List.map (\m -> ( m.segment, m.initialModel ))
        |> Dict.fromList
        |> Dict.get segment
        |> Maybe.withDefault defaultMeta.initialModel
    , commands
    )



-- UPDATE


type Msg
    = HanoiMsg Gallery.Hanoi.Msg
    | PuzzleMsg Gallery.Puzzle.Msg
    | ShapesMsg Gallery.Shapes.Msg
    | KnightMsg Gallery.Knight.Msg
    | TryOnMsg Gallery.TryOn.Msg
    | TaskBoardMsg Gallery.TaskBoard.Msg


commands : Cmd Msg
commands =
    Cmd.map PuzzleMsg Gallery.Puzzle.commands


subscriptions : Example -> Sub Msg
subscriptions example =
    case example of
        Hanoi subModel ->
            Sub.map HanoiMsg (Gallery.Hanoi.subscriptions subModel)

        Puzzle subModel ->
            Sub.map PuzzleMsg (Gallery.Puzzle.subscriptions subModel)

        Shapes subModel ->
            Sub.map ShapesMsg (Gallery.Shapes.subscriptions subModel)

        Knight subModel ->
            Sub.map KnightMsg (Gallery.Knight.subscriptions subModel)

        TryOn subModel ->
            Sub.map TryOnMsg (Gallery.TryOn.subscriptions subModel)

        TaskBoard subModel ->
            Sub.map TaskBoardMsg (Gallery.TaskBoard.subscriptions subModel)


update : Msg -> Example -> ( Example, Cmd Msg )
update msg example =
    case ( msg, example ) of
        ( HanoiMsg subMsg, Hanoi subModel ) ->
            stepHanoi (Gallery.Hanoi.update subMsg subModel)

        ( PuzzleMsg subMsg, Puzzle subModel ) ->
            stepPuzzle (Gallery.Puzzle.update subMsg subModel)

        ( ShapesMsg subMsg, Shapes subModel ) ->
            stepShapes (Gallery.Shapes.update subMsg subModel)

        ( KnightMsg subMsg, Knight subModel ) ->
            stepKnight (Gallery.Knight.update subMsg subModel)

        ( TryOnMsg subMsg, TryOn subModel ) ->
            stepTryOn (Gallery.TryOn.update subMsg subModel)

        ( TaskBoardMsg subMsg, TaskBoard subModel ) ->
            stepTaskBoard (Gallery.TaskBoard.update subMsg subModel)

        _ ->
            ( example, Cmd.none )


stepHanoi : ( Gallery.Hanoi.Model, Cmd Gallery.Hanoi.Msg ) -> ( Example, Cmd Msg )
stepHanoi ( subModel, subCmd ) =
    ( Hanoi subModel, Cmd.map HanoiMsg subCmd )


stepPuzzle : ( Gallery.Puzzle.Model, Cmd Gallery.Puzzle.Msg ) -> ( Example, Cmd Msg )
stepPuzzle ( subModel, subCmd ) =
    ( Puzzle subModel, Cmd.map PuzzleMsg subCmd )


stepShapes : ( Gallery.Shapes.Model, Cmd Gallery.Shapes.Msg ) -> ( Example, Cmd Msg )
stepShapes ( subModel, subCmd ) =
    ( Shapes subModel, Cmd.map ShapesMsg subCmd )


stepKnight : ( Gallery.Knight.Model, Cmd Gallery.Knight.Msg ) -> ( Example, Cmd Msg )
stepKnight ( subModel, subCmd ) =
    ( Knight subModel, Cmd.map KnightMsg subCmd )


stepTryOn : ( Gallery.TryOn.Model, Cmd Gallery.TryOn.Msg ) -> ( Example, Cmd Msg )
stepTryOn ( subModel, subCmd ) =
    ( TryOn subModel, Cmd.map TryOnMsg subCmd )


stepTaskBoard : ( Gallery.TaskBoard.Model, Cmd Gallery.TaskBoard.Msg ) -> ( Example, Cmd Msg )
stepTaskBoard ( subModel, subCmd ) =
    ( TaskBoard subModel, Cmd.map TaskBoardMsg subCmd )



-- VIEW


view : Example -> List (Html.Html Msg)
view example =
    [ Views.demoHeaderView
        (example
            |> exampleToTag
            |> tagToMetadata
            |> (\m -> { title = m.title, description = m.description, link = m.link })
        )
    , case example of
        Hanoi subModel ->
            Html.map HanoiMsg (Gallery.Hanoi.view subModel)

        Puzzle subModel ->
            Html.map PuzzleMsg (Gallery.Puzzle.view subModel)

        Shapes subModel ->
            Html.map ShapesMsg (Gallery.Shapes.view subModel)

        Knight subModel ->
            Html.map KnightMsg (Gallery.Knight.view subModel)

        TryOn subModel ->
            Html.map TryOnMsg (Gallery.TryOn.view subModel)

        TaskBoard subModel ->
            Html.map TaskBoardMsg (Gallery.TaskBoard.view subModel)
    , CustomElement.elmCode
        [ CustomElement.href (example |> exampleToTag |> tagToMetadata |> (\m -> m.link)) ]
        []
    ]


chapterView : String -> Html.Html msg
chapterView class =
    Views.chapterView
        class
        { title = "Gallery"
        , slug = "gallery"
        , allTags = allTags |> List.map (tagToMetadata >> (\m -> { segment = m.segment, title = m.title }))
        }
