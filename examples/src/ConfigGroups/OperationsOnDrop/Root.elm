module ConfigGroups.OperationsOnDrop.Root exposing
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

import ConfigGroups.OperationsOnDrop.InsertAfter
import ConfigGroups.OperationsOnDrop.InsertBefore
import ConfigGroups.OperationsOnDrop.Rotate
import ConfigGroups.OperationsOnDrop.Swap
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter ConfigGroups.OperationsOnDrop.InsertAfter.Model
    | InsertBefore ConfigGroups.OperationsOnDrop.InsertBefore.Model
    | Rotate ConfigGroups.OperationsOnDrop.Rotate.Model
    | Swap ConfigGroups.OperationsOnDrop.Swap.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter ConfigGroups.OperationsOnDrop.InsertAfter.initialModel
        , InsertBefore ConfigGroups.OperationsOnDrop.InsertBefore.initialModel
        , Rotate ConfigGroups.OperationsOnDrop.Rotate.initialModel
        , Swap ConfigGroups.OperationsOnDrop.Swap.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrop/InsertAfter.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrop/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrop/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/ConfigGroups/OperationsOnDrop/Swap.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg ConfigGroups.OperationsOnDrop.InsertAfter.Msg
    | InsertBeforeMsg ConfigGroups.OperationsOnDrop.InsertBefore.Msg
    | RotateMsg ConfigGroups.OperationsOnDrop.Rotate.Msg
    | SwapMsg ConfigGroups.OperationsOnDrop.Swap.Msg


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
                                stepInsertAfter (ConfigGroups.OperationsOnDrop.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (ConfigGroups.OperationsOnDrop.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (ConfigGroups.OperationsOnDrop.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (ConfigGroups.OperationsOnDrop.Swap.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( ConfigGroups.OperationsOnDrop.InsertAfter.Model, Cmd ConfigGroups.OperationsOnDrop.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( ConfigGroups.OperationsOnDrop.InsertBefore.Model, Cmd ConfigGroups.OperationsOnDrop.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( ConfigGroups.OperationsOnDrop.Rotate.Model, Cmd ConfigGroups.OperationsOnDrop.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( ConfigGroups.OperationsOnDrop.Swap.Model, Cmd ConfigGroups.OperationsOnDrop.Swap.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map InsertAfterMsg (ConfigGroups.OperationsOnDrop.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (ConfigGroups.OperationsOnDrop.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (ConfigGroups.OperationsOnDrop.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (ConfigGroups.OperationsOnDrop.Swap.subscriptions mo)
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
            Html.map InsertAfterMsg (ConfigGroups.OperationsOnDrop.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (ConfigGroups.OperationsOnDrop.InsertBefore.view mo)

        Rotate mo ->
            Html.map RotateMsg (ConfigGroups.OperationsOnDrop.Rotate.view mo)

        Swap mo ->
            Html.map SwapMsg (ConfigGroups.OperationsOnDrop.Swap.view mo)



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
