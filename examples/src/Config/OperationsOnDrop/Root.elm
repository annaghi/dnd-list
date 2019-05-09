module Config.OperationsOnDrop.Root exposing
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

import Config.OperationsOnDrop.InsertAfter
import Config.OperationsOnDrop.InsertBefore
import Config.OperationsOnDrop.Rotate
import Config.OperationsOnDrop.Swap
import Config.OperationsOnDrop.Unaltered
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter Config.OperationsOnDrop.InsertAfter.Model
    | InsertBefore Config.OperationsOnDrop.InsertBefore.Model
    | Rotate Config.OperationsOnDrop.Rotate.Model
    | Swap Config.OperationsOnDrop.Swap.Model
    | Unaltered Config.OperationsOnDrop.Unaltered.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter Config.OperationsOnDrop.InsertAfter.initialModel
        , InsertBefore Config.OperationsOnDrop.InsertBefore.initialModel
        , Rotate Config.OperationsOnDrop.Rotate.initialModel
        , Swap Config.OperationsOnDrop.Swap.initialModel
        , Unaltered Config.OperationsOnDrop.Unaltered.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/InsertAfter.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/Swap.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/OperationsOnDrop/Unaltered.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg Config.OperationsOnDrop.InsertAfter.Msg
    | InsertBeforeMsg Config.OperationsOnDrop.InsertBefore.Msg
    | RotateMsg Config.OperationsOnDrop.Rotate.Msg
    | SwapMsg Config.OperationsOnDrop.Swap.Msg
    | UnalteredMsg Config.OperationsOnDrop.Unaltered.Msg


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
                                stepInsertAfter (Config.OperationsOnDrop.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (Config.OperationsOnDrop.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (Config.OperationsOnDrop.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (Config.OperationsOnDrop.Swap.update msg mo)

                            ( UnalteredMsg msg, Unaltered mo ) ->
                                stepUnaltered (Config.OperationsOnDrop.Unaltered.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( Config.OperationsOnDrop.InsertAfter.Model, Cmd Config.OperationsOnDrop.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( Config.OperationsOnDrop.InsertBefore.Model, Cmd Config.OperationsOnDrop.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( Config.OperationsOnDrop.Rotate.Model, Cmd Config.OperationsOnDrop.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( Config.OperationsOnDrop.Swap.Model, Cmd Config.OperationsOnDrop.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )


stepUnaltered : ( Config.OperationsOnDrop.Unaltered.Model, Cmd Config.OperationsOnDrop.Unaltered.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map InsertAfterMsg (Config.OperationsOnDrop.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (Config.OperationsOnDrop.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (Config.OperationsOnDrop.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (Config.OperationsOnDrop.Swap.subscriptions mo)

                    Unaltered mo ->
                        Sub.map UnalteredMsg (Config.OperationsOnDrop.Unaltered.subscriptions mo)
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
            Html.map InsertAfterMsg (Config.OperationsOnDrop.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (Config.OperationsOnDrop.InsertBefore.view mo)

        Rotate mo ->
            Html.map RotateMsg (Config.OperationsOnDrop.Rotate.view mo)

        Swap mo ->
            Html.map SwapMsg (Config.OperationsOnDrop.Swap.view mo)

        Unaltered mo ->
            Html.map UnalteredMsg (Config.OperationsOnDrop.Unaltered.view mo)



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
