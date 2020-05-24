module DnDListGroups.OperationsOnDrag.Parent exposing
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

import DnDListGroups.OperationsOnDrag.InsertAfter
import DnDListGroups.OperationsOnDrag.InsertBefore
import DnDListGroups.OperationsOnDrag.Rotate
import DnDListGroups.OperationsOnDrag.Swap
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter DnDListGroups.OperationsOnDrag.InsertAfter.Model
    | InsertBefore DnDListGroups.OperationsOnDrag.InsertBefore.Model
    | Rotate DnDListGroups.OperationsOnDrag.Rotate.Model
    | Swap DnDListGroups.OperationsOnDrag.Swap.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter DnDListGroups.OperationsOnDrag.InsertAfter.initialModel
        , InsertBefore DnDListGroups.OperationsOnDrag.InsertBefore.initialModel
        , Rotate DnDListGroups.OperationsOnDrag.Rotate.initialModel
        , Swap DnDListGroups.OperationsOnDrag.Swap.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/OperationsOnDrag/DetectReorder.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/OperationsOnDrag/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/OperationsOnDrag/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/OperationsOnDrag/DetectReorder.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg DnDListGroups.OperationsOnDrag.InsertAfter.Msg
    | InsertBeforeMsg DnDListGroups.OperationsOnDrag.InsertBefore.Msg
    | RotateMsg DnDListGroups.OperationsOnDrag.Rotate.Msg
    | SwapMsg DnDListGroups.OperationsOnDrag.Swap.Msg


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
                                stepInsertAfter (DnDListGroups.OperationsOnDrag.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (DnDListGroups.OperationsOnDrag.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (DnDListGroups.OperationsOnDrag.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (DnDListGroups.OperationsOnDrag.Swap.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( DnDListGroups.OperationsOnDrag.InsertAfter.Model, Cmd DnDListGroups.OperationsOnDrag.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( DnDListGroups.OperationsOnDrag.InsertBefore.Model, Cmd DnDListGroups.OperationsOnDrag.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( DnDListGroups.OperationsOnDrag.Rotate.Model, Cmd DnDListGroups.OperationsOnDrag.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( DnDListGroups.OperationsOnDrag.Swap.Model, Cmd DnDListGroups.OperationsOnDrag.Swap.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map InsertAfterMsg (DnDListGroups.OperationsOnDrag.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (DnDListGroups.OperationsOnDrag.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (DnDListGroups.OperationsOnDrag.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (DnDListGroups.OperationsOnDrag.Swap.subscriptions mo)
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
            Html.map InsertAfterMsg (DnDListGroups.OperationsOnDrag.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (DnDListGroups.OperationsOnDrag.InsertBefore.view mo)

        Rotate mo ->
            Html.map RotateMsg (DnDListGroups.OperationsOnDrag.Rotate.view mo)

        Swap mo ->
            Html.map SwapMsg (DnDListGroups.OperationsOnDrag.Swap.view mo)



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
