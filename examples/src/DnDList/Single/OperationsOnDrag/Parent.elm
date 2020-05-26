module DnDList.Single.OperationsOnDrag.Parent exposing
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

import DnDList.Single.OperationsOnDrag.InsertAfter
import DnDList.Single.OperationsOnDrag.InsertBefore
import DnDList.Single.OperationsOnDrag.Rotate
import DnDList.Single.OperationsOnDrag.Swap
import DnDList.Single.OperationsOnDrag.Unaltered
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter DnDList.Single.OperationsOnDrag.InsertAfter.Model
    | InsertBefore DnDList.Single.OperationsOnDrag.InsertBefore.Model
    | Rotate DnDList.Single.OperationsOnDrag.Rotate.Model
    | Swap DnDList.Single.OperationsOnDrag.Swap.Model
    | Unaltered DnDList.Single.OperationsOnDrag.Unaltered.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter DnDList.Single.OperationsOnDrag.InsertAfter.initialModel
        , InsertBefore DnDList.Single.OperationsOnDrag.InsertBefore.initialModel
        , Rotate DnDList.Single.OperationsOnDrag.Rotate.initialModel
        , Swap DnDList.Single.OperationsOnDrag.Swap.initialModel
        , Unaltered DnDList.Single.OperationsOnDrag.Unaltered.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrag/DetectReorder.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrag/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrag/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrag/DetectReorder.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/OperationsOnDrag/Unaltered.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg DnDList.Single.OperationsOnDrag.InsertAfter.Msg
    | InsertBeforeMsg DnDList.Single.OperationsOnDrag.InsertBefore.Msg
    | RotateMsg DnDList.Single.OperationsOnDrag.Rotate.Msg
    | SwapMsg DnDList.Single.OperationsOnDrag.Swap.Msg
    | UnalteredMsg DnDList.Single.OperationsOnDrag.Unaltered.Msg


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
                                stepInsertAfter (DnDList.Single.OperationsOnDrag.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (DnDList.Single.OperationsOnDrag.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (DnDList.Single.OperationsOnDrag.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (DnDList.Single.OperationsOnDrag.Swap.update msg mo)

                            ( UnalteredMsg msg, Unaltered mo ) ->
                                stepUnaltered (DnDList.Single.OperationsOnDrag.Unaltered.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( DnDList.Single.OperationsOnDrag.InsertAfter.Model, Cmd DnDList.Single.OperationsOnDrag.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( DnDList.Single.OperationsOnDrag.InsertBefore.Model, Cmd DnDList.Single.OperationsOnDrag.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( DnDList.Single.OperationsOnDrag.Rotate.Model, Cmd DnDList.Single.OperationsOnDrag.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( DnDList.Single.OperationsOnDrag.Swap.Model, Cmd DnDList.Single.OperationsOnDrag.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )


stepUnaltered : ( DnDList.Single.OperationsOnDrag.Unaltered.Model, Cmd DnDList.Single.OperationsOnDrag.Unaltered.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map InsertAfterMsg (DnDList.Single.OperationsOnDrag.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (DnDList.Single.OperationsOnDrag.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (DnDList.Single.OperationsOnDrag.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (DnDList.Single.OperationsOnDrag.Swap.subscriptions mo)

                    Unaltered mo ->
                        Sub.map UnalteredMsg (DnDList.Single.OperationsOnDrag.Unaltered.subscriptions mo)
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
            Html.map InsertAfterMsg (DnDList.Single.OperationsOnDrag.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (DnDList.Single.OperationsOnDrag.InsertBefore.view mo)

        Rotate mo ->
            Html.map RotateMsg (DnDList.Single.OperationsOnDrag.Rotate.view mo)

        Swap mo ->
            Html.map SwapMsg (DnDList.Single.OperationsOnDrag.Swap.view mo)

        Unaltered mo ->
            Html.map UnalteredMsg (DnDList.Single.OperationsOnDrag.Unaltered.view mo)



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
