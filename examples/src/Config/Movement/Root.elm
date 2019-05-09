module Config.Movement.Root exposing
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

import Config.Movement.FreeOnDrag
import Config.Movement.FreeOnDrop
import Config.Movement.HorizontalOnDrag
import Config.Movement.HorizontalOnDrop
import Config.Movement.VerticalOnDrag
import Config.Movement.VerticalOnDrop
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = FreeOnDrag Config.Movement.FreeOnDrag.Model
    | FreeOnDrop Config.Movement.FreeOnDrop.Model
    | HorizontalOnDrag Config.Movement.HorizontalOnDrag.Model
    | HorizontalOnDrop Config.Movement.HorizontalOnDrop.Model
    | VerticalOnDrag Config.Movement.VerticalOnDrag.Model
    | VerticalOnDrop Config.Movement.VerticalOnDrop.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ FreeOnDrag Config.Movement.FreeOnDrag.initialModel
        , FreeOnDrop Config.Movement.FreeOnDrop.initialModel
        , HorizontalOnDrag Config.Movement.HorizontalOnDrag.initialModel
        , HorizontalOnDrop Config.Movement.HorizontalOnDrop.initialModel
        , VerticalOnDrag Config.Movement.VerticalOnDrag.initialModel
        , VerticalOnDrop Config.Movement.VerticalOnDrop.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/FreeOnDrag.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/FreeOnDrop.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/HorizontalOnDrag.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/HorizontalOnDrop.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/VerticalOnDrag.elm"

        5 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Config/Movement/VerticalOnDrop.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | FreeOnDragMsg Config.Movement.FreeOnDrag.Msg
    | FreeOnDropMsg Config.Movement.FreeOnDrop.Msg
    | HorizontalOnDragMsg Config.Movement.HorizontalOnDrag.Msg
    | HorizontalOnDropMsg Config.Movement.HorizontalOnDrop.Msg
    | VerticalOnDragMsg Config.Movement.VerticalOnDrag.Msg
    | VerticalOnDropMsg Config.Movement.VerticalOnDrop.Msg


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
                            ( FreeOnDragMsg msg, FreeOnDrag mo ) ->
                                stepFreeOnDrag (Config.Movement.FreeOnDrag.update msg mo)

                            ( FreeOnDropMsg msg, FreeOnDrop mo ) ->
                                stepFreeOnDrop (Config.Movement.FreeOnDrop.update msg mo)

                            ( HorizontalOnDragMsg msg, HorizontalOnDrag mo ) ->
                                stepHorizontalOnDrag (Config.Movement.HorizontalOnDrag.update msg mo)

                            ( HorizontalOnDropMsg msg, HorizontalOnDrop mo ) ->
                                stepHorizontalOnDrop (Config.Movement.HorizontalOnDrop.update msg mo)

                            ( VerticalOnDragMsg msg, VerticalOnDrag mo ) ->
                                stepVerticalOnDrag (Config.Movement.VerticalOnDrag.update msg mo)

                            ( VerticalOnDropMsg msg, VerticalOnDrop mo ) ->
                                stepVerticalOnDrop (Config.Movement.VerticalOnDrop.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepFreeOnDrag : ( Config.Movement.FreeOnDrag.Model, Cmd Config.Movement.FreeOnDrag.Msg ) -> ( Example, Cmd Msg )
stepFreeOnDrag ( mo, cmds ) =
    ( FreeOnDrag mo, Cmd.map FreeOnDragMsg cmds )


stepFreeOnDrop : ( Config.Movement.FreeOnDrop.Model, Cmd Config.Movement.FreeOnDrop.Msg ) -> ( Example, Cmd Msg )
stepFreeOnDrop ( mo, cmds ) =
    ( FreeOnDrop mo, Cmd.map FreeOnDropMsg cmds )


stepHorizontalOnDrag : ( Config.Movement.HorizontalOnDrag.Model, Cmd Config.Movement.HorizontalOnDrag.Msg ) -> ( Example, Cmd Msg )
stepHorizontalOnDrag ( mo, cmds ) =
    ( HorizontalOnDrag mo, Cmd.map HorizontalOnDragMsg cmds )


stepHorizontalOnDrop : ( Config.Movement.HorizontalOnDrop.Model, Cmd Config.Movement.HorizontalOnDrop.Msg ) -> ( Example, Cmd Msg )
stepHorizontalOnDrop ( mo, cmds ) =
    ( HorizontalOnDrop mo, Cmd.map HorizontalOnDropMsg cmds )


stepVerticalOnDrag : ( Config.Movement.VerticalOnDrag.Model, Cmd Config.Movement.VerticalOnDrag.Msg ) -> ( Example, Cmd Msg )
stepVerticalOnDrag ( mo, cmds ) =
    ( VerticalOnDrag mo, Cmd.map VerticalOnDragMsg cmds )


stepVerticalOnDrop : ( Config.Movement.VerticalOnDrop.Model, Cmd Config.Movement.VerticalOnDrop.Msg ) -> ( Example, Cmd Msg )
stepVerticalOnDrop ( mo, cmds ) =
    ( VerticalOnDrop mo, Cmd.map VerticalOnDropMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    model.examples
        |> List.map
            (\example ->
                case example of
                    FreeOnDrag mo ->
                        Sub.map FreeOnDragMsg (Config.Movement.FreeOnDrag.subscriptions mo)

                    FreeOnDrop mo ->
                        Sub.map FreeOnDropMsg (Config.Movement.FreeOnDrop.subscriptions mo)

                    HorizontalOnDrag mo ->
                        Sub.map HorizontalOnDragMsg (Config.Movement.HorizontalOnDrag.subscriptions mo)

                    HorizontalOnDrop mo ->
                        Sub.map HorizontalOnDropMsg (Config.Movement.HorizontalOnDrop.subscriptions mo)

                    VerticalOnDrag mo ->
                        Sub.map VerticalOnDragMsg (Config.Movement.VerticalOnDrag.subscriptions mo)

                    VerticalOnDrop mo ->
                        Sub.map VerticalOnDropMsg (Config.Movement.VerticalOnDrop.subscriptions mo)
            )
        |> Sub.batch



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.div []
        [ model.examples
            |> List.take 2
            |> List.indexedMap (demoWrapperView 0 model.id)
            |> Html.section
                [ Html.Attributes.style "display" "flex"
                , Html.Attributes.style "flex-wrap" "wrap"
                , Html.Attributes.style "justify-content" "center"
                , Html.Attributes.style "padding-top" "2em"
                ]
        , model.examples
            |> List.drop 2
            |> List.take 2
            |> List.indexedMap (demoWrapperView 2 model.id)
            |> Html.section []
        , model.examples
            |> List.drop 4
            |> List.take 2
            |> List.indexedMap (demoWrapperView 4 model.id)
            |> Html.section
                [ Html.Attributes.style "display" "flex"
                , Html.Attributes.style "justify-content" "center"
                ]
        ]


demoWrapperView : Int -> Int -> Int -> Example -> Html.Html Msg
demoWrapperView offset currentId id example =
    let
        globalId : Int
        globalId =
            offset + id
    in
    Html.div
        [ Html.Attributes.style "display" "flex"
        , Html.Attributes.style "justify-content" "center"
        , Html.Attributes.style "margin" "4em 0"
        ]
        [ demoView example
        , Html.div
            [ Html.Attributes.classList [ ( "link", True ), ( "is-active", globalId == currentId ) ]
            , Html.Events.onClick (LinkClicked globalId)
            ]
            [ Html.text (info example) ]
        ]


demoView : Example -> Html.Html Msg
demoView example =
    case example of
        FreeOnDrag mo ->
            Html.map FreeOnDragMsg (Config.Movement.FreeOnDrag.view mo)

        FreeOnDrop mo ->
            Html.map FreeOnDropMsg (Config.Movement.FreeOnDrop.view mo)

        HorizontalOnDrag mo ->
            Html.map HorizontalOnDragMsg (Config.Movement.HorizontalOnDrag.view mo)

        HorizontalOnDrop mo ->
            Html.map HorizontalOnDropMsg (Config.Movement.HorizontalOnDrop.view mo)

        VerticalOnDrag mo ->
            Html.map VerticalOnDragMsg (Config.Movement.VerticalOnDrag.view mo)

        VerticalOnDrop mo ->
            Html.map VerticalOnDropMsg (Config.Movement.VerticalOnDrop.view mo)



-- EXAMPLE INFO


type alias Info =
    String


info : Example -> Info
info example =
    case example of
        FreeOnDrag _ ->
            "Free on drag"

        FreeOnDrop _ ->
            "Free on drop"

        HorizontalOnDrag _ ->
            "Horizontal on drag"

        HorizontalOnDrop _ ->
            "Horizontal on drop"

        VerticalOnDrag _ ->
            "Vertical on drag"

        VerticalOnDrop _ ->
            "Vertical on drop"
