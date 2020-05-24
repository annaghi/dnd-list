module DnDList.OperationsOnDrop.Parent exposing
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

import DnDList.OperationsOnDrop.InsertAfter
import DnDList.OperationsOnDrop.InsertBefore
import DnDList.OperationsOnDrop.Rotate
import DnDList.OperationsOnDrop.Swap
import DnDList.OperationsOnDrop.Unaltered
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter DnDList.OperationsOnDrop.InsertAfter.Model
    | InsertBefore DnDList.OperationsOnDrop.InsertBefore.Model
    | Rotate DnDList.OperationsOnDrop.Rotate.Model
    | Swap DnDList.OperationsOnDrop.Swap.Model
    | Unaltered DnDList.OperationsOnDrop.Unaltered.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter DnDList.OperationsOnDrop.InsertAfter.initialModel
        , InsertBefore DnDList.OperationsOnDrop.InsertBefore.initialModel
        , Rotate DnDList.OperationsOnDrop.Rotate.initialModel
        , Swap DnDList.OperationsOnDrop.Swap.initialModel
        , Unaltered DnDList.OperationsOnDrop.Unaltered.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrop/DetectReorder.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrop/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrop/Rotate.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrop/DetectReorder.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/OperationsOnDrop/Unaltered.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg DnDList.OperationsOnDrop.InsertAfter.Msg
    | InsertBeforeMsg DnDList.OperationsOnDrop.InsertBefore.Msg
    | RotateMsg DnDList.OperationsOnDrop.Rotate.Msg
    | SwapMsg DnDList.OperationsOnDrop.Swap.Msg
    | UnalteredMsg DnDList.OperationsOnDrop.Unaltered.Msg


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
                                stepInsertAfter (DnDList.OperationsOnDrop.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (DnDList.OperationsOnDrop.InsertBefore.update msg mo)

                            ( RotateMsg msg, Rotate mo ) ->
                                stepRotate (DnDList.OperationsOnDrop.Rotate.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (DnDList.OperationsOnDrop.Swap.update msg mo)

                            ( UnalteredMsg msg, Unaltered mo ) ->
                                stepUnaltered (DnDList.OperationsOnDrop.Unaltered.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( DnDList.OperationsOnDrop.InsertAfter.Model, Cmd DnDList.OperationsOnDrop.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( DnDList.OperationsOnDrop.InsertBefore.Model, Cmd DnDList.OperationsOnDrop.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotate : ( DnDList.OperationsOnDrop.Rotate.Model, Cmd DnDList.OperationsOnDrop.Rotate.Msg ) -> ( Example, Cmd Msg )
stepRotate ( mo, cmds ) =
    ( Rotate mo, Cmd.map RotateMsg cmds )


stepSwap : ( DnDList.OperationsOnDrop.Swap.Model, Cmd DnDList.OperationsOnDrop.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )


stepUnaltered : ( DnDList.OperationsOnDrop.Unaltered.Model, Cmd DnDList.OperationsOnDrop.Unaltered.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map InsertAfterMsg (DnDList.OperationsOnDrop.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (DnDList.OperationsOnDrop.InsertBefore.subscriptions mo)

                    Rotate mo ->
                        Sub.map RotateMsg (DnDList.OperationsOnDrop.Rotate.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (DnDList.OperationsOnDrop.Swap.subscriptions mo)

                    Unaltered mo ->
                        Sub.map UnalteredMsg (DnDList.OperationsOnDrop.Unaltered.subscriptions mo)
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
            Html.map InsertAfterMsg (DnDList.OperationsOnDrop.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (DnDList.OperationsOnDrop.InsertBefore.view mo)

        Rotate mo ->
            Html.map RotateMsg (DnDList.OperationsOnDrop.Rotate.view mo)

        Swap mo ->
            Html.map SwapMsg (DnDList.OperationsOnDrop.Swap.view mo)

        Unaltered mo ->
            Html.map UnalteredMsg (DnDList.OperationsOnDrop.Unaltered.view mo)



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
