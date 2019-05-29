module Gallery.Root exposing
    ( Model
    , Msg
    , codeView
    , demoView
    , headerView
    , init
    , navigationView
    , subscriptions
    , update
    )

import CustomElement
import Gallery.Hanoi
import Gallery.Knight
import Gallery.Puzzle
import Gallery.Shapes
import Gallery.TaskBoard
import Gallery.TryOn
import Html
import Html.Attributes
import Path
import Url.Builder



-- MODEL


type alias Model =
    Example


type Example
    = Hanoi Gallery.Hanoi.Model
    | Puzzle Gallery.Puzzle.Model
    | Shapes Gallery.Shapes.Model
    | Knight Gallery.Knight.Model
    | TryOn Gallery.TryOn.Model
    | TaskBoard Gallery.TaskBoard.Model


init : String -> ( Model, Cmd Msg )
init slug =
    ( toExample slug, commands )



-- UPDATE


type Msg
    = HanoiMsg Gallery.Hanoi.Msg
    | PuzzleMsg Gallery.Puzzle.Msg
    | ShapesMsg Gallery.Shapes.Msg
    | KnightMsg Gallery.Knight.Msg
    | TryOnMsg Gallery.TryOn.Msg
    | TaskBoardMsg Gallery.TaskBoard.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model ) of
        ( HanoiMsg msg, Hanoi mo ) ->
            stepHanoi (Gallery.Hanoi.update msg mo)

        ( PuzzleMsg msg, Puzzle mo ) ->
            stepPuzzle (Gallery.Puzzle.update msg mo)

        ( ShapesMsg msg, Shapes mo ) ->
            stepShapes (Gallery.Shapes.update msg mo)

        ( KnightMsg msg, Knight mo ) ->
            stepKnight (Gallery.Knight.update msg mo)

        ( TryOnMsg msg, TryOn mo ) ->
            stepTryOn (Gallery.TryOn.update msg mo)

        ( TaskBoardMsg msg, TaskBoard mo ) ->
            stepTaskBoard (Gallery.TaskBoard.update msg mo)

        _ ->
            ( model, Cmd.none )


stepHanoi : ( Gallery.Hanoi.Model, Cmd Gallery.Hanoi.Msg ) -> ( Model, Cmd Msg )
stepHanoi ( mo, cmds ) =
    ( Hanoi mo, Cmd.map HanoiMsg cmds )


stepPuzzle : ( Gallery.Puzzle.Model, Cmd Gallery.Puzzle.Msg ) -> ( Model, Cmd Msg )
stepPuzzle ( mo, cmds ) =
    ( Puzzle mo, Cmd.map PuzzleMsg cmds )


stepShapes : ( Gallery.Shapes.Model, Cmd Gallery.Shapes.Msg ) -> ( Model, Cmd Msg )
stepShapes ( mo, cmds ) =
    ( Shapes mo, Cmd.map ShapesMsg cmds )


stepKnight : ( Gallery.Knight.Model, Cmd Gallery.Knight.Msg ) -> ( Model, Cmd Msg )
stepKnight ( mo, cmds ) =
    ( Knight mo, Cmd.map KnightMsg cmds )


stepTryOn : ( Gallery.TryOn.Model, Cmd Gallery.TryOn.Msg ) -> ( Model, Cmd Msg )
stepTryOn ( mo, cmds ) =
    ( TryOn mo, Cmd.map TryOnMsg cmds )


stepTaskBoard : ( Gallery.TaskBoard.Model, Cmd Gallery.TaskBoard.Msg ) -> ( Model, Cmd Msg )
stepTaskBoard ( mo, cmds ) =
    ( TaskBoard mo, Cmd.map TaskBoardMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        Hanoi mo ->
            Sub.map HanoiMsg (Gallery.Hanoi.subscriptions mo)

        Puzzle mo ->
            Sub.map PuzzleMsg (Gallery.Puzzle.subscriptions mo)

        Shapes mo ->
            Sub.map ShapesMsg (Gallery.Shapes.subscriptions mo)

        Knight mo ->
            Sub.map KnightMsg (Gallery.Knight.subscriptions mo)

        TryOn mo ->
            Sub.map TryOnMsg (Gallery.TryOn.subscriptions mo)

        TaskBoard mo ->
            Sub.map TaskBoardMsg (Gallery.TaskBoard.subscriptions mo)



-- COMMANDS


commands : Cmd Msg
commands =
    Cmd.map PuzzleMsg Gallery.Puzzle.commands



-- VIEW


navigationView : String -> Html.Html Msg
navigationView currentPath =
    Html.div
        [ Html.Attributes.class "navigation" ]
        [ Html.h4 [] [ Html.text "Gallery" ]
        , [ Hanoi Gallery.Hanoi.initialModel
          , Puzzle Gallery.Puzzle.initialModel
          , Shapes Gallery.Shapes.initialModel
          , Knight Gallery.Knight.initialModel
          , TryOn Gallery.TryOn.initialModel
          , TaskBoard Gallery.TaskBoard.initialModel
          ]
            |> List.map (linkView currentPath)
            |> Html.ul []
        ]


linkView : String -> Example -> Html.Html Msg
linkView currentPath example =
    let
        path : String
        path =
            Url.Builder.absolute [ Path.rootPath, "gallery", (info >> .slug) example ] []
    in
    Html.li []
        [ Html.a
            [ Html.Attributes.classList [ ( "is-active", path == currentPath ) ]
            , Html.Attributes.href path
            ]
            [ Html.text ((info >> .title) example) ]
        ]


headerView : Model -> Html.Html Msg
headerView model =
    let
        title : String
        title =
            (info >> .title) model

        description : String
        description =
            (info >> .description) model
    in
    Html.header []
        [ Html.h2 [] [ Html.text title ]
        , Html.p [] [ Html.text description ]
        ]


demoView : Model -> Html.Html Msg
demoView model =
    case model of
        Hanoi mo ->
            Html.map HanoiMsg (Gallery.Hanoi.view mo)

        Puzzle mo ->
            Html.map PuzzleMsg (Gallery.Puzzle.view mo)

        Shapes mo ->
            Html.map ShapesMsg (Gallery.Shapes.view mo)

        Knight mo ->
            Html.map KnightMsg (Gallery.Knight.view mo)

        TryOn mo ->
            Html.map TryOnMsg (Gallery.TryOn.view mo)

        TaskBoard mo ->
            Html.map TaskBoardMsg (Gallery.TaskBoard.view mo)


codeView : Model -> Html.Html Msg
codeView model =
    case model of
        Hanoi _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Hanoi.elm"

        Puzzle _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Puzzle.elm"

        Shapes _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Shapes.elm"

        Knight _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Knight.elm"

        TryOn _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/TryOn.elm"

        TaskBoard _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/TaskBoard.elm"


toCode : String -> Html.Html msg
toCode url =
    CustomElement.elmCode [ CustomElement.href url ] []



-- EXAMPLE INFO


toExample : String -> Example
toExample slug =
    case slug of
        "hanoi" ->
            Hanoi Gallery.Hanoi.initialModel

        "puzzle" ->
            Puzzle Gallery.Puzzle.initialModel

        "shapes" ->
            Shapes Gallery.Shapes.initialModel

        "knight" ->
            Knight Gallery.Knight.initialModel

        "try-on" ->
            TryOn Gallery.TryOn.initialModel

        "taskboard" ->
            TaskBoard Gallery.TaskBoard.initialModel

        _ ->
            Hanoi Gallery.Hanoi.initialModel


type alias Info =
    { slug : String
    , title : String
    , description : String
    }


info : Example -> Info
info example =
    case example of
        Hanoi _ ->
            { slug = "hanoi"
            , title = "Towers of Hanoi"
            , description = "Flat list with auxiliary items."
            }

        Puzzle _ ->
            { slug = "puzzle"
            , title = "Puzzle"
            , description = "List with groups without auxiliary items."
            }

        Shapes _ ->
            { slug = "shapes"
            , title = "Geometric shapes"
            , description = "Flat list with the Unaltered operation and beforeUpdate."
            }

        Knight _ ->
            { slug = "knight"
            , title = "Knight's tour"
            , description = "Flat list with Swap. The top-left 5 × 5 sub-board is diced from the original 8 × 8 board."
            }

        TryOn _ ->
            { slug = "try-on"
            , title = "Try on"
            , description = "Flat list with info.targetElement."
            }

        TaskBoard _ ->
            { slug = "taskboard"
            , title = "Task board"
            , description = "Two systems - one for the cards and one for the columns."
            }
