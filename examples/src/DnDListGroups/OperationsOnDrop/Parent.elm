module DnDListGroups.OperationsOnDrop.Parent exposing
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

import DnDListGroups.OperationsOnDrop.InsertAfter
import DnDListGroups.OperationsOnDrop.InsertBefore
import DnDListGroups.OperationsOnDrop.Rotate
import DnDListGroups.OperationsOnDrop.Swap
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter DnDListGroups.OperationsOnDrop.InsertAfter.Model
    | InsertBefore DnDListGroups.OperationsOnDrop.InsertBefore.Model
    | Rotate DnDListGroups.OperationsOnDrop.Rotate.Model
    | Swap DnDListGroups.OperationsOnDrop.Swap.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter DnDListGroups.OperationsOnDrop.InsertAfter.initialModel
        , InsertBefore DnDListGroups.OperationsOnDrop.InsertBefore.initialModel
        , Rotate DnDListGroups.OperationsOnDrop.Rotate.initialModel
        , Swap DnDListGroups.OperationsOnDrop.Swap.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/OperationsOnDrop/DetectReorder.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/OperationsOnDrop/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/OperationsOnDrop/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/OperationsOnDrop/DetectReorder.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg DnDListGroups.OperationsOnDrop.InsertAfter.Msg
    | InsertBeforeMsg DnDListGroups.OperationsOnDrop.InsertBefore.Msg
    | RotateMsg DnDListGroups.OperationsOnDrop.Rotate.Msg
    | SwapMsg DnDListGroups.OperationsOnDrop.Swap.Msg


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
                                stepInsertAfter (DnDListGroups.OperationsOnDrop.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (DnDListGroups.OperationsOnDrop.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (DnDListGroups.OperationsOnDrop.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (DnDListGroups.OperationsOnDrop.Swap.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( DnDListGroups.OperationsOnDrop.InsertAfter.Model, Cmd DnDListGroups.OperationsOnDrop.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( DnDListGroups.OperationsOnDrop.InsertBefore.Model, Cmd DnDListGroups.OperationsOnDrop.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( DnDListGroups.OperationsOnDrop.Rotate.Model, Cmd DnDListGroups.OperationsOnDrop.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( DnDListGroups.OperationsOnDrop.Swap.Model, Cmd DnDListGroups.OperationsOnDrop.Swap.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map InsertAfterMsg (DnDListGroups.OperationsOnDrop.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (DnDListGroups.OperationsOnDrop.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (DnDListGroups.OperationsOnDrop.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (DnDListGroups.OperationsOnDrop.Swap.subscriptions mo)
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
            Html.map InsertAfterMsg (DnDListGroups.OperationsOnDrop.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (DnDListGroups.OperationsOnDrop.InsertBefore.view mo)

        Rotate mo ->
            Html.map RotateMsg (DnDListGroups.OperationsOnDrop.Rotate.view mo)

        Swap mo ->
            Html.map SwapMsg (DnDListGroups.OperationsOnDrop.Swap.view mo)



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
