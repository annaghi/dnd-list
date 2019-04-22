module Configuration.OperationOnDrag.Root exposing
    ( Model
    , Msg
    , demoView
    , init
    , initialModel
    , subscriptions
    , update
    , url
    , view
    )

import Configuration.OperationOnDrag.InsertAfter
import Configuration.OperationOnDrag.InsertBefore
import Configuration.OperationOnDrag.RotateIn
import Configuration.OperationOnDrag.RotateOut
import Configuration.OperationOnDrag.Swap
import Configuration.OperationOnDrag.Unmove
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter Configuration.OperationOnDrag.InsertAfter.Model
    | InsertBefore Configuration.OperationOnDrag.InsertBefore.Model
    | RotateIn Configuration.OperationOnDrag.RotateIn.Model
    | RotateOut Configuration.OperationOnDrag.RotateOut.Model
    | Swap Configuration.OperationOnDrag.Swap.Model
    | Unmove Configuration.OperationOnDrag.Unmove.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter Configuration.OperationOnDrag.InsertAfter.initialModel
        , InsertBefore Configuration.OperationOnDrag.InsertBefore.initialModel
        , RotateIn Configuration.OperationOnDrag.RotateIn.initialModel
        , RotateOut Configuration.OperationOnDrag.RotateOut.initialModel
        , Swap Configuration.OperationOnDrag.Swap.initialModel
        , Unmove Configuration.OperationOnDrag.Unmove.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrag/InsertAfter.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrag/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrag/RotateIn.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrag/RotateOut.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrag/Swap.elm"

        5 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrag/Unmove.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg Configuration.OperationOnDrag.InsertAfter.Msg
    | InsertBeforeMsg Configuration.OperationOnDrag.InsertBefore.Msg
    | RotateInMsg Configuration.OperationOnDrag.RotateIn.Msg
    | RotateOutMsg Configuration.OperationOnDrag.RotateOut.Msg
    | SwapMsg Configuration.OperationOnDrag.Swap.Msg
    | UnmoveMsg Configuration.OperationOnDrag.Unmove.Msg


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
                                stepInsertAfter (Configuration.OperationOnDrag.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (Configuration.OperationOnDrag.InsertBefore.update msg mo)

                            ( RotateInMsg msg, RotateIn mo ) ->
                                stepRotateIn (Configuration.OperationOnDrag.RotateIn.update msg mo)

                            ( RotateOutMsg msg, RotateOut mo ) ->
                                stepRotateOut (Configuration.OperationOnDrag.RotateOut.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (Configuration.OperationOnDrag.Swap.update msg mo)

                            ( UnmoveMsg msg, Unmove mo ) ->
                                stepUnmove (Configuration.OperationOnDrag.Unmove.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( Configuration.OperationOnDrag.InsertAfter.Model, Cmd Configuration.OperationOnDrag.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( Configuration.OperationOnDrag.InsertBefore.Model, Cmd Configuration.OperationOnDrag.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotateIn : ( Configuration.OperationOnDrag.RotateIn.Model, Cmd Configuration.OperationOnDrag.RotateIn.Msg ) -> ( Example, Cmd Msg )
stepRotateIn ( mo, cmds ) =
    ( RotateIn mo, Cmd.map RotateInMsg cmds )


stepRotateOut : ( Configuration.OperationOnDrag.RotateOut.Model, Cmd Configuration.OperationOnDrag.RotateOut.Msg ) -> ( Example, Cmd Msg )
stepRotateOut ( mo, cmds ) =
    ( RotateOut mo, Cmd.map RotateOutMsg cmds )


stepSwap : ( Configuration.OperationOnDrag.Swap.Model, Cmd Configuration.OperationOnDrag.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )


stepUnmove : ( Configuration.OperationOnDrag.Unmove.Model, Cmd Configuration.OperationOnDrag.Unmove.Msg ) -> ( Example, Cmd Msg )
stepUnmove ( mo, cmds ) =
    ( Unmove mo, Cmd.map UnmoveMsg cmds )



-- COMMANDS


commands : Int -> Cmd Msg
commands id =
    Cmd.none



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    model.examples
        |> List.map
            (\example ->
                case example of
                    InsertAfter mo ->
                        Sub.map InsertAfterMsg (Configuration.OperationOnDrag.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (Configuration.OperationOnDrag.InsertBefore.subscriptions mo)

                    RotateIn mo ->
                        Sub.map RotateInMsg (Configuration.OperationOnDrag.RotateIn.subscriptions mo)

                    RotateOut mo ->
                        Sub.map RotateOutMsg (Configuration.OperationOnDrag.RotateOut.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (Configuration.OperationOnDrag.Swap.subscriptions mo)

                    Unmove mo ->
                        Sub.map UnmoveMsg (Configuration.OperationOnDrag.Unmove.subscriptions mo)
            )
        |> Sub.batch



-- VIEW


view : Model -> Html.Html Msg
view model =
    model.examples
        |> List.indexedMap (demoWrapperView model.id)
        |> Html.section []


demoWrapperView : Int -> Int -> Example -> Html.Html Msg
demoWrapperView currentId id example =
    let
        title : String
        title =
            (info >> .title) example
    in
    Html.div
        [ Html.Attributes.style "display" "flex"
        , Html.Attributes.style "flex-wrap" "wrap"
        , Html.Attributes.style "justify-content" "center"
        , Html.Attributes.style "margin" "4em 0"
        ]
        [ demoView example
        , Html.div
            [ Html.Attributes.style "flex" "0 1 100px"
            , Html.Attributes.class "link"
            , Html.Events.onClick (LinkClicked id)
            , Html.Attributes.classList [ ( "is-active", id == currentId ) ]
            ]
            [ Html.text title ]
        ]


demoView : Example -> Html.Html Msg
demoView example =
    case example of
        InsertAfter mo ->
            Html.map InsertAfterMsg (Configuration.OperationOnDrag.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (Configuration.OperationOnDrag.InsertBefore.view mo)

        RotateIn mo ->
            Html.map RotateInMsg (Configuration.OperationOnDrag.RotateIn.view mo)

        RotateOut mo ->
            Html.map RotateOutMsg (Configuration.OperationOnDrag.RotateOut.view mo)

        Swap mo ->
            Html.map SwapMsg (Configuration.OperationOnDrag.Swap.view mo)

        Unmove mo ->
            Html.map UnmoveMsg (Configuration.OperationOnDrag.Unmove.view mo)



-- EXAMPLE INFO


type alias Info =
    { title : String }


info : Example -> Info
info example =
    case example of
        InsertAfter _ ->
            { title = "Insert after" }

        InsertBefore _ ->
            { title = "Insert before" }

        RotateIn _ ->
            { title = "Rotate in" }

        RotateOut _ ->
            { title = "Rotate out" }

        Swap _ ->
            { title = "Swap" }

        Unmove _ ->
            { title = "Unmove" }
