module DnDList.Groups.OperationsOnDrag.Parent exposing
    ( Model
    , Msg
    , init
    , initialModel
    , subscriptions
    , update
    , url
    , view
    )

import DnDList.Groups.OperationsOnDrag.InsertAfter
import DnDList.Groups.OperationsOnDrag.InsertBefore
import DnDList.Groups.OperationsOnDrag.Rotate
import DnDList.Groups.OperationsOnDrag.Swap
import Html
import Views



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter DnDList.Groups.OperationsOnDrag.InsertAfter.Model
    | InsertBefore DnDList.Groups.OperationsOnDrag.InsertBefore.Model
    | Rotate DnDList.Groups.OperationsOnDrag.Rotate.Model
    | Swap DnDList.Groups.OperationsOnDrag.Swap.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter DnDList.Groups.OperationsOnDrag.InsertAfter.initialModel
        , InsertBefore DnDList.Groups.OperationsOnDrag.InsertBefore.initialModel
        , Rotate DnDList.Groups.OperationsOnDrag.Rotate.initialModel
        , Swap DnDList.Groups.OperationsOnDrag.Swap.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList.Groups/OperationsOnDrag/DetectReorder.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList.Groups/OperationsOnDrag/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList.Groups/OperationsOnDrag/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList.Groups/OperationsOnDrag/DetectReorder.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg DnDList.Groups.OperationsOnDrag.InsertAfter.Msg
    | InsertBeforeMsg DnDList.Groups.OperationsOnDrag.InsertBefore.Msg
    | RotateMsg DnDList.Groups.OperationsOnDrag.Rotate.Msg
    | SwapMsg DnDList.Groups.OperationsOnDrag.Swap.Msg


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
                            ( InsertAfterMsg msg, InsertAfter mo ) ->
                                stepInsertAfter (DnDList.Groups.OperationsOnDrag.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (DnDList.Groups.OperationsOnDrag.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (DnDList.Groups.OperationsOnDrag.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (DnDList.Groups.OperationsOnDrag.Swap.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( DnDList.Groups.OperationsOnDrag.InsertAfter.Model, Cmd DnDList.Groups.OperationsOnDrag.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( DnDList.Groups.OperationsOnDrag.InsertBefore.Model, Cmd DnDList.Groups.OperationsOnDrag.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( DnDList.Groups.OperationsOnDrag.Rotate.Model, Cmd DnDList.Groups.OperationsOnDrag.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( DnDList.Groups.OperationsOnDrag.Swap.Model, Cmd DnDList.Groups.OperationsOnDrag.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    model.examples
        |> List.map
            (\example ->
                case example of
                    InsertAfter mo ->
                        Sub.map InsertAfterMsg (DnDList.Groups.OperationsOnDrag.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (DnDList.Groups.OperationsOnDrag.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (DnDList.Groups.OperationsOnDrag.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (DnDList.Groups.OperationsOnDrag.Swap.subscriptions mo)
            )
        |> Sub.batch



-- VIEW


view : Model -> Html.Html Msg
view model =
    Views.examplesView LinkClicked info model.id model.examples


info : Example -> Views.SubInfo Msg
info example =
    case example of
        InsertAfter mo ->
            { title = "Insert after"
            , subView = Html.map InsertAfterMsg (DnDList.Groups.OperationsOnDrag.InsertAfter.view mo)
            }

        InsertBefore mo ->
            { title = "Insert before"
            , subView = Html.map InsertBeforeMsg (DnDList.Groups.OperationsOnDrag.InsertBefore.view mo)
            }

        Rotate mo ->
            { title = "Rotate"
            , subView = Html.map RotateMsg (DnDList.Groups.OperationsOnDrag.Rotate.view mo)
            }

        Swap mo ->
            { title = "Swap"
            , subView = Html.map SwapMsg (DnDList.Groups.OperationsOnDrag.Swap.view mo)
            }
