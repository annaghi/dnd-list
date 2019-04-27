module Configuration.OperationOnDrop.Root exposing
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

import Configuration.OperationOnDrop.InsertAfter
import Configuration.OperationOnDrop.InsertBefore
import Configuration.OperationOnDrop.RotateIn
import Configuration.OperationOnDrop.RotateOut
import Configuration.OperationOnDrop.Swap
import Configuration.OperationOnDrop.Unaltered
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfter Configuration.OperationOnDrop.InsertAfter.Model
    | InsertBefore Configuration.OperationOnDrop.InsertBefore.Model
    | RotateIn Configuration.OperationOnDrop.RotateIn.Model
    | RotateOut Configuration.OperationOnDrop.RotateOut.Model
    | Swap Configuration.OperationOnDrop.Swap.Model
    | Unaltered Configuration.OperationOnDrop.Unaltered.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter Configuration.OperationOnDrop.InsertAfter.initialModel
        , InsertBefore Configuration.OperationOnDrop.InsertBefore.initialModel
        , RotateIn Configuration.OperationOnDrop.RotateIn.initialModel
        , RotateOut Configuration.OperationOnDrop.RotateOut.initialModel
        , Swap Configuration.OperationOnDrop.Swap.initialModel
        , Unaltered Configuration.OperationOnDrop.Unaltered.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrop/InsertAfter.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrop/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrop/RotateIn.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrop/RotateOut.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrop/Swap.elm"

        5 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/OperationOnDrop/Unaltered.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg Configuration.OperationOnDrop.InsertAfter.Msg
    | InsertBeforeMsg Configuration.OperationOnDrop.InsertBefore.Msg
    | RotateInMsg Configuration.OperationOnDrop.RotateIn.Msg
    | RotateOutMsg Configuration.OperationOnDrop.RotateOut.Msg
    | SwapMsg Configuration.OperationOnDrop.Swap.Msg
    | UnalteredMsg Configuration.OperationOnDrop.Unaltered.Msg


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
                                stepInsertAfter (Configuration.OperationOnDrop.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (Configuration.OperationOnDrop.InsertBefore.update msg mo)

                            ( RotateInMsg msg, RotateIn mo ) ->
                                stepRotateIn (Configuration.OperationOnDrop.RotateIn.update msg mo)

                            ( RotateOutMsg msg, RotateOut mo ) ->
                                stepRotateOut (Configuration.OperationOnDrop.RotateOut.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (Configuration.OperationOnDrop.Swap.update msg mo)

                            ( UnalteredMsg msg, Unaltered mo ) ->
                                stepUnaltered (Configuration.OperationOnDrop.Unaltered.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( Configuration.OperationOnDrop.InsertAfter.Model, Cmd Configuration.OperationOnDrop.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( Configuration.OperationOnDrop.InsertBefore.Model, Cmd Configuration.OperationOnDrop.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepRotateIn : ( Configuration.OperationOnDrop.RotateIn.Model, Cmd Configuration.OperationOnDrop.RotateIn.Msg ) -> ( Example, Cmd Msg )
stepRotateIn ( mo, cmds ) =
    ( RotateIn mo, Cmd.map RotateInMsg cmds )


stepRotateOut : ( Configuration.OperationOnDrop.RotateOut.Model, Cmd Configuration.OperationOnDrop.RotateOut.Msg ) -> ( Example, Cmd Msg )
stepRotateOut ( mo, cmds ) =
    ( RotateOut mo, Cmd.map RotateOutMsg cmds )


stepSwap : ( Configuration.OperationOnDrop.Swap.Model, Cmd Configuration.OperationOnDrop.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )


stepUnaltered : ( Configuration.OperationOnDrop.Unaltered.Model, Cmd Configuration.OperationOnDrop.Unaltered.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map InsertAfterMsg (Configuration.OperationOnDrop.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (Configuration.OperationOnDrop.InsertBefore.subscriptions mo)

                    RotateIn mo ->
                        Sub.map RotateInMsg (Configuration.OperationOnDrop.RotateIn.subscriptions mo)

                    RotateOut mo ->
                        Sub.map RotateOutMsg (Configuration.OperationOnDrop.RotateOut.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (Configuration.OperationOnDrop.Swap.subscriptions mo)

                    Unaltered mo ->
                        Sub.map UnalteredMsg (Configuration.OperationOnDrop.Unaltered.subscriptions mo)
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
            [ Html.Attributes.classList [ ( "link", True ), ( "is-active", id == currentId ) ]
            , Html.Events.onClick (LinkClicked id)
            ]
            [ Html.text title ]
        ]


demoView : Example -> Html.Html Msg
demoView example =
    case example of
        InsertAfter mo ->
            Html.map InsertAfterMsg (Configuration.OperationOnDrop.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (Configuration.OperationOnDrop.InsertBefore.view mo)

        RotateIn mo ->
            Html.map RotateInMsg (Configuration.OperationOnDrop.RotateIn.view mo)

        RotateOut mo ->
            Html.map RotateOutMsg (Configuration.OperationOnDrop.RotateOut.view mo)

        Swap mo ->
            Html.map SwapMsg (Configuration.OperationOnDrop.Swap.view mo)

        Unaltered mo ->
            Html.map UnalteredMsg (Configuration.OperationOnDrop.Unaltered.view mo)



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

        Unaltered _ ->
            { title = "Unaltered" }
