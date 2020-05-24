module DnDListGroups.HookCommands.Parent exposing
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

import DnDListGroups.HookCommands.DetectDrop
import DnDListGroups.HookCommands.DetectReorder
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = DetectDrop DnDListGroups.HookCommands.DetectDrop.Model
    | DetectReorder DnDListGroups.HookCommands.DetectReorder.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ DetectDrop DnDListGroups.HookCommands.DetectDrop.initialModel
        , DetectReorder DnDListGroups.HookCommands.DetectReorder.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/HookCommands/DetectDrop.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDListGroups/HookCommands/DetectReorder.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | DetectDropMsg DnDListGroups.HookCommands.DetectDrop.Msg
    | DetectReorderMsg DnDListGroups.HookCommands.DetectReorder.Msg


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
                            ( DetectDropMsg msg, DetectDrop mo ) ->
                                stepDetectDrop (DnDListGroups.HookCommands.DetectDrop.update msg mo)

                            ( DetectReorderMsg msg, DetectReorder mo ) ->
                                stepDetectReorder (DnDListGroups.HookCommands.DetectReorder.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepDetectDrop : ( DnDListGroups.HookCommands.DetectDrop.Model, Cmd DnDListGroups.HookCommands.DetectDrop.Msg ) -> ( Example, Cmd Msg )
stepDetectDrop ( mo, cmds ) =
    ( DetectDrop mo, Cmd.map DetectDropMsg cmds )


stepDetectReorder : ( DnDListGroups.HookCommands.DetectReorder.Model, Cmd DnDListGroups.HookCommands.DetectReorder.Msg ) -> ( Example, Cmd Msg )
stepDetectReorder ( mo, cmds ) =
    ( DetectReorder mo, Cmd.map DetectReorderMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    model.examples
        |> List.map
            (\example ->
                case example of
                    DetectDrop mo ->
                        Sub.map DetectDropMsg (DnDListGroups.HookCommands.DetectDrop.subscriptions mo)

                    DetectReorder mo ->
                        Sub.map DetectReorderMsg (DnDListGroups.HookCommands.DetectReorder.subscriptions mo)
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
        DetectDrop mo ->
            Html.map DetectDropMsg (DnDListGroups.HookCommands.DetectDrop.view mo)

        DetectReorder mo ->
            Html.map DetectReorderMsg (DnDListGroups.HookCommands.DetectReorder.view mo)



-- EXAMPLE INFO


type alias Info =
    String


info : Example -> Info
info example =
    case example of
        DetectDrop _ ->
            "Detect drop"

        DetectReorder _ ->
            "Detect reorder"
