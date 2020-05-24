module DnDList.OperationsOnDrag.Parent exposing
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

import DnDList.OperationsOnDrag.InsertAfter
import DnDList.OperationsOnDrag.InsertBefore
import DnDList.OperationsOnDrag.Rotate
import DnDList.OperationsOnDrag.Swap
import DnDList.OperationsOnDrag.Unaltered
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter DnDList.OperationsOnDrag.InsertAfter.Model
    | InsertBefore DnDList.OperationsOnDrag.InsertBefore.Model
    | Rotate DnDList.OperationsOnDrag.Rotate.Model
    | Swap DnDList.OperationsOnDrag.Swap.Model
    | Unaltered DnDList.OperationsOnDrag.Unaltered.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter DnDList.OperationsOnDrag.InsertAfter.initialModel
        , InsertBefore DnDList.OperationsOnDrag.InsertBefore.initialModel
        , Rotate DnDList.OperationsOnDrag.Rotate.initialModel
        , Swap DnDList.OperationsOnDrag.Swap.initialModel
        , Unaltered DnDList.OperationsOnDrag.Unaltered.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrag/DetectReorder.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrag/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrag/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrag/DetectReorder.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrag/Unaltered.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg DnDList.OperationsOnDrag.InsertAfter.Msg
    | InsertBeforeMsg DnDList.OperationsOnDrag.InsertBefore.Msg
    | RotateMsg DnDList.OperationsOnDrag.Rotate.Msg
    | SwapMsg DnDList.OperationsOnDrag.Swap.Msg
    | UnalteredMsg DnDList.OperationsOnDrag.Unaltered.Msg


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
                                stepInsertAfter (DnDList.OperationsOnDrag.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (DnDList.OperationsOnDrag.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (DnDList.OperationsOnDrag.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (DnDList.OperationsOnDrag.Swap.update msg mo)

                            ( UnalteredMsg msg, Unaltered mo ) ->
                                stepUnaltered (DnDList.OperationsOnDrag.Unaltered.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( DnDList.OperationsOnDrag.InsertAfter.Model, Cmd DnDList.OperationsOnDrag.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( DnDList.OperationsOnDrag.InsertBefore.Model, Cmd DnDList.OperationsOnDrag.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( DnDList.OperationsOnDrag.Rotate.Model, Cmd DnDList.OperationsOnDrag.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( DnDList.OperationsOnDrag.Swap.Model, Cmd DnDList.OperationsOnDrag.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )


stepUnaltered : ( DnDList.OperationsOnDrag.Unaltered.Model, Cmd DnDList.OperationsOnDrag.Unaltered.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map InsertAfterMsg (DnDList.OperationsOnDrag.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (DnDList.OperationsOnDrag.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (DnDList.OperationsOnDrag.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (DnDList.OperationsOnDrag.Swap.subscriptions mo)

                    Unaltered mo ->
                        Sub.map UnalteredMsg (DnDList.OperationsOnDrag.Unaltered.subscriptions mo)
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
            Html.map InsertAfterMsg (DnDList.OperationsOnDrag.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (DnDList.OperationsOnDrag.InsertBefore.view mo)

        Rotate mo ->
            Html.map RotateMsg (DnDList.OperationsOnDrag.Rotate.view mo)

        Swap mo ->
            Html.map SwapMsg (DnDList.OperationsOnDrag.Swap.view mo)

        Unaltered mo ->
            Html.map UnalteredMsg (DnDList.OperationsOnDrag.Unaltered.view mo)



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
