module DnDList.Single.OperationsOnDrop.Parent exposing
    ( Model
    , Msg
    , init
    , initialModel
    , subscriptions
    , update
    , url
    , view
    )

import DnDList.Single.OperationsOnDrop.InsertAfter
import DnDList.Single.OperationsOnDrop.InsertBefore
import DnDList.Single.OperationsOnDrop.Rotate
import DnDList.Single.OperationsOnDrop.Swap
import DnDList.Single.OperationsOnDrop.Unaltered
import Html
import Views



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter DnDList.Single.OperationsOnDrop.InsertAfter.Model
    | InsertBefore DnDList.Single.OperationsOnDrop.InsertBefore.Model
    | Rotate DnDList.Single.OperationsOnDrop.Rotate.Model
    | Swap DnDList.Single.OperationsOnDrop.Swap.Model
    | Unaltered DnDList.Single.OperationsOnDrop.Unaltered.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter DnDList.Single.OperationsOnDrop.InsertAfter.initialModel
        , InsertBefore DnDList.Single.OperationsOnDrop.InsertBefore.initialModel
        , Rotate DnDList.Single.OperationsOnDrop.Rotate.initialModel
        , Swap DnDList.Single.OperationsOnDrop.Swap.initialModel
        , Unaltered DnDList.Single.OperationsOnDrop.Unaltered.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/DetectReorder.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/DetectReorder.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/Unaltered.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg DnDList.Single.OperationsOnDrop.InsertAfter.Msg
    | InsertBeforeMsg DnDList.Single.OperationsOnDrop.InsertBefore.Msg
    | RotateMsg DnDList.Single.OperationsOnDrop.Rotate.Msg
    | SwapMsg DnDList.Single.OperationsOnDrop.Swap.Msg
    | UnalteredMsg DnDList.Single.OperationsOnDrop.Unaltered.Msg


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
                                stepInsertAfter (DnDList.Single.OperationsOnDrop.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (DnDList.Single.OperationsOnDrop.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (DnDList.Single.OperationsOnDrop.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (DnDList.Single.OperationsOnDrop.Swap.update msg mo)

                            ( UnalteredMsg msg, Unaltered mo ) ->
                                stepUnaltered (DnDList.Single.OperationsOnDrop.Unaltered.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( DnDList.Single.OperationsOnDrop.InsertAfter.Model, Cmd DnDList.Single.OperationsOnDrop.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( DnDList.Single.OperationsOnDrop.InsertBefore.Model, Cmd DnDList.Single.OperationsOnDrop.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( DnDList.Single.OperationsOnDrop.Rotate.Model, Cmd DnDList.Single.OperationsOnDrop.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( DnDList.Single.OperationsOnDrop.Swap.Model, Cmd DnDList.Single.OperationsOnDrop.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )


stepUnaltered : ( DnDList.Single.OperationsOnDrop.Unaltered.Model, Cmd DnDList.Single.OperationsOnDrop.Unaltered.Msg ) -> ( Example, Cmd Msg )
stepUnaltered ( mo, cmds ) =
    ( Unaltered mo, Cmd.map UnalteredMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    model.examples
        |> List.map
            (\example ->
                case example of
                    InsertAfter mo ->
                        Sub.map InsertAfterMsg (DnDList.Single.OperationsOnDrop.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (DnDList.Single.OperationsOnDrop.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (DnDList.Single.OperationsOnDrop.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (DnDList.Single.OperationsOnDrop.Swap.subscriptions mo)

                    Unaltered mo ->
                        Sub.map UnalteredMsg (DnDList.Single.OperationsOnDrop.Unaltered.subscriptions mo)
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
            , subView = Html.map InsertAfterMsg (DnDList.Single.OperationsOnDrop.InsertAfter.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/DetectReorder.elm"
            }

        InsertBefore mo ->
            { title = "Insert before"
            , subView = Html.map InsertBeforeMsg (DnDList.Single.OperationsOnDrop.InsertBefore.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/InsertBefore.elm"
            }

        Rotate mo ->
            { title = "Rotate"
            , subView = Html.map RotateMsg (DnDList.Single.OperationsOnDrop.Rotate.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/Rotate.elm"
            }

        Swap mo ->
            { title = "Swap"
            , subView = Html.map SwapMsg (DnDList.Single.OperationsOnDrop.Swap.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/DetectReorder.elm"
            }

        Unaltered mo ->
            { title = "Unaltered"
            , subView = Html.map UnalteredMsg (DnDList.Single.OperationsOnDrop.Unaltered.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrop/Unaltered.elm"
            }
