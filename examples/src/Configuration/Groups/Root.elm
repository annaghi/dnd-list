module Configuration.Groups.Root exposing
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

import Configuration.Groups.InsertAfter
import Configuration.Groups.InsertAfterAux
import Configuration.Groups.InsertBefore
import Configuration.Groups.InsertBeforeAux
import Configuration.Groups.Swap
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = InsertAfterAux Configuration.Groups.InsertAfterAux.Model
    | InsertBeforeAux Configuration.Groups.InsertBeforeAux.Model
    | Swap Configuration.Groups.Swap.Model
    | InsertAfter Configuration.Groups.InsertAfter.Model
    | InsertBefore Configuration.Groups.InsertBefore.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfterAux Configuration.Groups.InsertAfterAux.initialModel
        , InsertBeforeAux Configuration.Groups.InsertBeforeAux.initialModel
        , Swap Configuration.Groups.Swap.initialModel
        , InsertAfter Configuration.Groups.InsertAfter.initialModel
        , InsertBefore Configuration.Groups.InsertBefore.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Groups/InsertAfterAux.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Groups/InsertBeforeAux.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Groups/Swap.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Groups/InsertAfter.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Groups/InsertBefore.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterAuxMsg Configuration.Groups.InsertAfterAux.Msg
    | InsertBeforeAuxMsg Configuration.Groups.InsertBeforeAux.Msg
    | SwapMsg Configuration.Groups.Swap.Msg
    | InsertAfterMsg Configuration.Groups.InsertAfter.Msg
    | InsertBeforeMsg Configuration.Groups.InsertBefore.Msg


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
                            ( InsertAfterAuxMsg msg, InsertAfterAux mo ) ->
                                stepInsertAfterAux (Configuration.Groups.InsertAfterAux.update msg mo)

                            ( InsertBeforeAuxMsg msg, InsertBeforeAux mo ) ->
                                stepInsertBeforeAux (Configuration.Groups.InsertBeforeAux.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (Configuration.Groups.Swap.update msg mo)

                            ( InsertAfterMsg msg, InsertAfter mo ) ->
                                stepInsertAfter (Configuration.Groups.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (Configuration.Groups.InsertBefore.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfterAux : ( Configuration.Groups.InsertAfterAux.Model, Cmd Configuration.Groups.InsertAfterAux.Msg ) -> ( Example, Cmd Msg )
stepInsertAfterAux ( mo, cmds ) =
    ( InsertAfterAux mo, Cmd.map InsertAfterAuxMsg cmds )


stepInsertBeforeAux : ( Configuration.Groups.InsertBeforeAux.Model, Cmd Configuration.Groups.InsertBeforeAux.Msg ) -> ( Example, Cmd Msg )
stepInsertBeforeAux ( mo, cmds ) =
    ( InsertBeforeAux mo, Cmd.map InsertBeforeAuxMsg cmds )


stepSwap : ( Configuration.Groups.Swap.Model, Cmd Configuration.Groups.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )


stepInsertAfter : ( Configuration.Groups.InsertAfter.Model, Cmd Configuration.Groups.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( Configuration.Groups.InsertBefore.Model, Cmd Configuration.Groups.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    model.examples
        |> List.map
            (\example ->
                case example of
                    InsertAfterAux mo ->
                        Sub.map InsertAfterAuxMsg (Configuration.Groups.InsertAfterAux.subscriptions mo)

                    InsertBeforeAux mo ->
                        Sub.map InsertBeforeAuxMsg (Configuration.Groups.InsertBeforeAux.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (Configuration.Groups.Swap.subscriptions mo)

                    InsertAfter mo ->
                        Sub.map InsertAfterMsg (Configuration.Groups.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (Configuration.Groups.InsertBefore.subscriptions mo)
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
        InsertAfterAux mo ->
            Html.map InsertAfterAuxMsg (Configuration.Groups.InsertAfterAux.view mo)

        InsertBeforeAux mo ->
            Html.map InsertBeforeAuxMsg (Configuration.Groups.InsertBeforeAux.view mo)

        Swap mo ->
            Html.map SwapMsg (Configuration.Groups.Swap.view mo)

        InsertAfter mo ->
            Html.map InsertAfterMsg (Configuration.Groups.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (Configuration.Groups.InsertBefore.view mo)



-- EXAMPLE INFO


type alias Info =
    { title : String }


info : Example -> Info
info example =
    case example of
        InsertAfterAux _ ->
            { title = "Insert after + Auxiliary items" }

        InsertBeforeAux _ ->
            { title = "Insert before + Auxiliary items" }

        Swap _ ->
            { title = "Swap" }

        InsertAfter _ ->
            { title = "Insert after" }

        InsertBefore _ ->
            { title = "Insert before" }
