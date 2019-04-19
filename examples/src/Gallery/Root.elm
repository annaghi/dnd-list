module Gallery.Root exposing
    ( Model
    , Msg
    , codeView
    , demoView
    , headerView
    , init
    , initialCommand
    , navigationView
    , subscriptions
    , update
    )

import Base
import CustomElement
import Gallery.Hanoi
import Gallery.Puzzle
import Gallery.Shapes
import Gallery.TaskBoard
import Html
import Html.Attributes
import Url.Builder



-- MODEL


type alias Model =
    { slug : String
    , example : Example
    }


type Example
    = Hanoi Gallery.Hanoi.Model
    | Puzzle Gallery.Puzzle.Model
    | Shapes Gallery.Shapes.Model
    | TaskBoard Gallery.TaskBoard.Model


init : String -> ( Model, Cmd Msg )
init slug =
    ( { slug = slug, example = selectExample slug }, initialCommand )


selectExample : String -> Example
selectExample slug =
    case slug of
        "hanoi" ->
            Hanoi Gallery.Hanoi.initialModel

        "puzzle" ->
            Puzzle Gallery.Puzzle.initialModel

        "shapes" ->
            Shapes Gallery.Shapes.initialModel

        "taskboard" ->
            TaskBoard Gallery.TaskBoard.initialModel

        _ ->
            Hanoi Gallery.Hanoi.initialModel


initialCommand : Cmd Msg
initialCommand =
    Cmd.batch
        [ Cmd.map PuzzleMsg Gallery.Puzzle.commands ]



-- UPDATE


type Msg
    = HanoiMsg Gallery.Hanoi.Msg
    | PuzzleMsg Gallery.Puzzle.Msg
    | ShapesMsg Gallery.Shapes.Msg
    | TaskBoardMsg Gallery.TaskBoard.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model.example ) of
        ( HanoiMsg msg, Hanoi mo ) ->
            stepHanoi model (Gallery.Hanoi.update msg mo)

        ( PuzzleMsg msg, Puzzle mo ) ->
            stepPuzzle model (Gallery.Puzzle.update msg mo)

        ( ShapesMsg msg, Shapes mo ) ->
            stepShapes model (Gallery.Shapes.update msg mo)

        ( TaskBoardMsg msg, TaskBoard mo ) ->
            stepTaskBoard model (Gallery.TaskBoard.update msg mo)

        _ ->
            ( model, Cmd.none )


stepHanoi : Model -> ( Gallery.Hanoi.Model, Cmd Gallery.Hanoi.Msg ) -> ( Model, Cmd Msg )
stepHanoi model ( mo, cmds ) =
    ( { model | example = Hanoi mo }, Cmd.map HanoiMsg cmds )


stepPuzzle : Model -> ( Gallery.Puzzle.Model, Cmd Gallery.Puzzle.Msg ) -> ( Model, Cmd Msg )
stepPuzzle model ( mo, cmds ) =
    ( { model | example = Puzzle mo }, Cmd.map PuzzleMsg cmds )


stepShapes : Model -> ( Gallery.Shapes.Model, Cmd Gallery.Shapes.Msg ) -> ( Model, Cmd Msg )
stepShapes model ( mo, cmds ) =
    ( { model | example = Shapes mo }, Cmd.map ShapesMsg cmds )


stepTaskBoard : Model -> ( Gallery.TaskBoard.Model, Cmd Gallery.TaskBoard.Msg ) -> ( Model, Cmd Msg )
stepTaskBoard model ( mo, cmds ) =
    ( { model | example = TaskBoard mo }, Cmd.map TaskBoardMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.example of
        Hanoi mo ->
            Sub.map HanoiMsg (Gallery.Hanoi.subscriptions mo)

        Puzzle mo ->
            Sub.map PuzzleMsg (Gallery.Puzzle.subscriptions mo)

        Shapes mo ->
            Sub.map ShapesMsg (Gallery.Shapes.subscriptions mo)

        TaskBoard mo ->
            Sub.map TaskBoardMsg (Gallery.TaskBoard.subscriptions mo)



-- VIEW


navigationView : Html.Html Msg
navigationView =
    Html.div
        [ Html.Attributes.class "navigation" ]
        [ Html.h4 [] [ Html.text "Gallery" ]
        , [ Hanoi Gallery.Hanoi.initialModel
          , Puzzle Gallery.Puzzle.initialModel
          , Shapes Gallery.Shapes.initialModel
          , TaskBoard Gallery.TaskBoard.initialModel
          ]
            |> List.map linkView
            |> Html.ul []
        ]


linkView : Example -> Html.Html Msg
linkView example =
    let
        path : String
        path =
            Url.Builder.absolute [ Base.base, "gallery", (info >> .slug) example ] []
    in
    Html.li []
        [ Html.a
            [ Html.Attributes.href path ]
            [ Html.text ((info >> .title) example) ]
        ]


headerView : Model -> Html.Html Msg
headerView model =
    let
        title : String
        title =
            (info >> .title) model.example

        description : String
        description =
            (info >> .description) model.example
    in
    Html.header []
        [ Html.h2 [] [ Html.text title ]
        , Html.p [] [ Html.text description ]
        ]


demoView : Model -> Html.Html Msg
demoView model =
    case model.example of
        Hanoi mo ->
            Html.map HanoiMsg (Gallery.Hanoi.view mo)

        Puzzle mo ->
            Html.map PuzzleMsg (Gallery.Puzzle.view mo)

        Shapes mo ->
            Html.map ShapesMsg (Gallery.Shapes.view mo)

        TaskBoard mo ->
            Html.map TaskBoardMsg (Gallery.TaskBoard.view mo)


codeView : Model -> Html.Html Msg
codeView model =
    case model.example of
        Hanoi _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Hanoi.elm"

        Puzzle _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Puzzle.elm"

        Shapes _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/Shapes.elm"

        TaskBoard _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Gallery/TaskBoard.elm"


toCode : String -> Html.Html msg
toCode url =
    CustomElement.elmCode [ CustomElement.href url ] []



-- EXAMPLE INFO


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
            , description = ""
            }

        Puzzle _ ->
            { slug = "puzzle"
            , title = "Puzzle"
            , description = ""
            }

        Shapes _ ->
            { slug = "shapes"
            , title = "Geometric shapes"
            , description = ""
            }

        TaskBoard _ ->
            { slug = "taskboard"
            , title = "Task board"
            , description = ""
            }
