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
import Configuration.Groups.InsertBefore
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
    = InsertAfter Configuration.Groups.InsertAfter.Model
    | InsertBefore Configuration.Groups.InsertBefore.Model
    | Swap Configuration.Groups.Swap.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ InsertAfter Configuration.Groups.InsertAfter.initialModel
        , InsertBefore Configuration.Groups.InsertBefore.initialModel
        , Swap Configuration.Groups.Swap.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Groups/InsertAfter.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Groups/InsertBefore.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Groups/Swap.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | InsertAfterMsg Configuration.Groups.InsertAfter.Msg
    | InsertBeforeMsg Configuration.Groups.InsertBefore.Msg
    | SwapMsg Configuration.Groups.Swap.Msg


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
                                stepInsertAfter (Configuration.Groups.InsertAfter.update msg mo)

                            ( InsertBeforeMsg msg, InsertBefore mo ) ->
                                stepInsertBefore (Configuration.Groups.InsertBefore.update msg mo)

                            ( SwapMsg msg, Swap mo ) ->
                                stepSwap (Configuration.Groups.Swap.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepInsertAfter : ( Configuration.Groups.InsertAfter.Model, Cmd Configuration.Groups.InsertAfter.Msg ) -> ( Example, Cmd Msg )
stepInsertAfter ( mo, cmds ) =
    ( InsertAfter mo, Cmd.map InsertAfterMsg cmds )


stepInsertBefore : ( Configuration.Groups.InsertBefore.Model, Cmd Configuration.Groups.InsertBefore.Msg ) -> ( Example, Cmd Msg )
stepInsertBefore ( mo, cmds ) =
    ( InsertBefore mo, Cmd.map InsertBeforeMsg cmds )


stepSwap : ( Configuration.Groups.Swap.Model, Cmd Configuration.Groups.Swap.Msg ) -> ( Example, Cmd Msg )
stepSwap ( mo, cmds ) =
    ( Swap mo, Cmd.map SwapMsg cmds )



-- COMMANDS


commands : Int -> Cmd Msg
commands id =
    Cmd.none



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    model.examples
        |> List.map
            (\example ->
                case example of
                    InsertAfter mo ->
                        Sub.map InsertAfterMsg (Configuration.Groups.InsertAfter.subscriptions mo)

                    InsertBefore mo ->
                        Sub.map InsertBeforeMsg (Configuration.Groups.InsertBefore.subscriptions mo)

                    Swap mo ->
                        Sub.map SwapMsg (Configuration.Groups.Swap.subscriptions mo)
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
            [ Html.Attributes.style "flex" "0 1 100px"
            , Html.Attributes.class "link"
            , Html.Events.onClick (LinkClicked id)
            , Html.Attributes.classList [ ( "is-active", id == currentId ) ]
            ]
            [ Html.text title ]
        ]


demoView : Example -> Html.Html Msg
demoView example =
    case example of
        InsertAfter mo ->
            Html.map InsertAfterMsg (Configuration.Groups.InsertAfter.view mo)

        InsertBefore mo ->
            Html.map InsertBeforeMsg (Configuration.Groups.InsertBefore.view mo)

        Swap mo ->
            Html.map SwapMsg (Configuration.Groups.Swap.view mo)



-- EXAMPLE INFO


type alias Info =
    { title : String
    , config : String
    }


info : Example -> Info
info example =
    case example of
        InsertAfter _ ->
            { title = "Insert after"
            , config = ""
            }

        InsertBefore _ ->
            { title = "Insert before"
            , config = ""
            }

        Swap _ ->
            { title = "Swap"
            , config = ""
            }
