module Config.OperationsOnDrag.Root exposing
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

import Config.OperationsOnDrag.InsertAfter
import Config.OperationsOnDrag.InsertBefore
import Config.OperationsOnDrag.Rotate
import Config.OperationsOnDrag.Swap
import Config.OperationsOnDrag.Unaltered
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter Config.OperationsOnDrag.InsertAfter.Model
    | InsertBefore Config.OperationsOnDrag.InsertBefore.Model
    | Rotate Config.OperationsOnDrag.Rotate.Model
    | Swap Config.OperationsOnDrag.Swap.Model
    | Unaltered Config.OperationsOnDrag.Unaltered.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter Config.OperationsOnDrag.InsertAfter.initialModel
        , InsertBefore Config.OperationsOnDrag.InsertBefore.initialModel
        , Rotate Config.OperationsOnDrag.Rotate.initialModel
        , Swap Config.OperationsOnDrag.Swap.initialModel
        , Unaltered Config.OperationsOnDrag.Unaltered.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/InsertAfter.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/Swap.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrag/Unaltered.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg Config.OperationsOnDrag.InsertAfter.Msg
    | InsertBeforeMsg Config.OperationsOnDrag.InsertBefore.Msg
    | RotateMsg Config.OperationsOnDrag.Rotate.Msg
    | SwapMsg Config.OperationsOnDrag.Swap.Msg
    | UnalteredMsg Config.OperationsOnDrag.Unaltered.Msg


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
                                stepInsertAfter (Config.OperationsOnDrag.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (Config.OperationsOnDrag.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (Config.OperationsOnDrag.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (Config.OperationsOnDrag.Swap.update msg mo)

                            ( UnalteredMsg msg, Unaltered mo ) ->
                                stepUnaltered (Config.OperationsOnDrag.Unaltered.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( Config.OperationsOnDrag.InsertAfter.Model, Cmd Config.OperationsOnDrag.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( Config.OperationsOnDrag.InsertBefore.Model, Cmd Config.OperationsOnDrag.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( Config.OperationsOnDrag.Rotate.Model, Cmd Config.OperationsOnDrag.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( Config.OperationsOnDrag.Swap.Model, Cmd Config.OperationsOnDrag.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )


stepUnaltered : ( Config.OperationsOnDrag.Unaltered.Model, Cmd Config.OperationsOnDrag.Unaltered.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map InsertAfterMsg (Config.OperationsOnDrag.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (Config.OperationsOnDrag.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (Config.OperationsOnDrag.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (Config.OperationsOnDrag.Swap.subscriptions mo)

                    Unaltered mo ->
                        Sub.map UnalteredMsg (Config.OperationsOnDrag.Unaltered.subscriptions mo)
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
    Html.div
        [ Html.Attributes.style "display" "flex"
        , Html.Attributes.style "flex-wrap" "wrap"
        , Html.Attributes.style "justify-content" "center"
        , Html.Attributes.style "margin" "4em 0"
        ]
        [ demoView example
        , Html.div
            [ Html.Attributes.classList [ ( "link", True ), ( "is-active", id == currentId ) ]
            , Html.Events.onClick (LinkClicked id)
            ]
            [ Html.text (info example) ]
        ]


demoView : Example -> Html.Html Msg
demoView example =
    case example of
        InsertAfter mo ->
            Html.map InsertAfterMsg (Config.OperationsOnDrag.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (Config.OperationsOnDrag.InsertBefore.view mo)

        Rotate mo ->
            Html.map RotateMsg (Config.OperationsOnDrag.Rotate.view mo)

        Swap mo ->
            Html.map SwapMsg (Config.OperationsOnDrag.Swap.view mo)

        Unaltered mo ->
            Html.map UnalteredMsg (Config.OperationsOnDrag.Unaltered.view mo)



-- EXAMPLE INFO


type alias Info =
    String


info : Example -> Info
info example =
    case example of
        InsertAfter _ ->
            "Insert after"

        InsertBefore _ ->
            "Insert before"

        Rotate _ ->
            "Rotate"

        Swap _ ->
            "Swap"

        Unaltered _ ->
            "Unaltered"
