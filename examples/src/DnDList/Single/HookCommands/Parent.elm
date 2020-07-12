module DnDList.Single.HookCommands.Parent exposing
    ( Model
    , Msg
    , init
    , initialModel
    , subscriptions
    , update
    , url
    , view
    )

import DnDList.Single.HookCommands.DetectDrop
import DnDList.Single.HookCommands.DetectReorder
import Html
import Views



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = DetectDrop DnDList.Single.HookCommands.DetectDrop.Model
    | DetectReorder DnDList.Single.HookCommands.DetectReorder.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ DetectDrop DnDList.Single.HookCommands.DetectDrop.initialModel
        , DetectReorder DnDList.Single.HookCommands.DetectReorder.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/HookCommands/DetectDrop.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/HookCommands/DetectReorder.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | DetectDropMsg DnDList.Single.HookCommands.DetectDrop.Msg
    | DetectReorderMsg DnDList.Single.HookCommands.DetectReorder.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        LinkClicked id ->
            ( { model | id = id }, Cmd.none )

        _ ->
            model.examples
                |> List.map
                    (\example ->
                        case ( message, example ) of
                            ( DetectDropMsg msg, DetectDrop mo ) ->
                                stepDetectDrop (DnDList.Single.HookCommands.DetectDrop.update msg mo)

                            ( DetectReorderMsg msg, DetectReorder mo ) ->
                                stepDetectReorder (DnDList.Single.HookCommands.DetectReorder.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepDetectDrop : ( DnDList.Single.HookCommands.DetectDrop.Model, Cmd DnDList.Single.HookCommands.DetectDrop.Msg ) -> ( Example, Cmd Msg )
stepDetectDrop ( mo, cmds ) =
    ( DetectDrop mo, Cmd.map DetectDropMsg cmds )


stepDetectReorder : ( DnDList.Single.HookCommands.DetectReorder.Model, Cmd DnDList.Single.HookCommands.DetectReorder.Msg ) -> ( Example, Cmd Msg )
stepDetectReorder ( mo, cmds ) =
    ( DetectReorder mo, Cmd.map DetectReorderMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    model.examples
        |> List.map
            (\example ->
                case example of
                    DetectDrop mo ->
                        Sub.map DetectDropMsg (DnDList.Single.HookCommands.DetectDrop.subscriptions mo)

                    DetectReorder mo ->
                        Sub.map DetectReorderMsg (DnDList.Single.HookCommands.DetectReorder.subscriptions mo)
            )
        |> Sub.batch



-- VIEW


view : Model -> Html.Html Msg
view model =
    Views.examplesView LinkClicked info model.id model.examples


info : Example -> Views.SubInfo Msg
info example =
    case example of
        DetectDrop mo ->
            { title = "Detect drop with swap"
            , subView = Html.map DetectDropMsg (DnDList.Single.HookCommands.DetectDrop.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/HookCommands/DetectDrop.elm"
            }

        DetectReorder mo ->
            { title = "Detect reorder with swap"
            , subView = Html.map DetectReorderMsg (DnDList.Single.HookCommands.DetectReorder.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/HookCommands/DetectReorder.elm"
            }
