module Configuration.Movement.Root exposing
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

import Configuration.Movement.FreeOnDrag
import Configuration.Movement.FreeOnDrop
import Configuration.Movement.HorizontalOnDrag
import Configuration.Movement.HorizontalOnDrop
import Configuration.Movement.VerticalOnDrag
import Configuration.Movement.VerticalOnDrop
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = FreeOnDrag Configuration.Movement.FreeOnDrag.Model
    | FreeOnDrop Configuration.Movement.FreeOnDrop.Model
    | HorizontalOnDrag Configuration.Movement.HorizontalOnDrag.Model
    | HorizontalOnDrop Configuration.Movement.HorizontalOnDrop.Model
    | VerticalOnDrag Configuration.Movement.VerticalOnDrag.Model
    | VerticalOnDrop Configuration.Movement.VerticalOnDrop.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ FreeOnDrag Configuration.Movement.FreeOnDrag.initialModel
        , FreeOnDrop Configuration.Movement.FreeOnDrop.initialModel
        , HorizontalOnDrag Configuration.Movement.HorizontalOnDrag.initialModel
        , HorizontalOnDrop Configuration.Movement.HorizontalOnDrop.initialModel
        , VerticalOnDrag Configuration.Movement.VerticalOnDrag.initialModel
        , VerticalOnDrop Configuration.Movement.VerticalOnDrop.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Movement/FreeOnDrag.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Movement/FreeOnDrop.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Movement/HorizontalOnDrag.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Movement/HorizontalOnDrop.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Movement/VerticalOnDrag.elm"

        5 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Configuration/Movement/VerticalOnDrop.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | FreeOnDragMsg Configuration.Movement.FreeOnDrag.Msg
    | FreeOnDropMsg Configuration.Movement.FreeOnDrop.Msg
    | HorizontalOnDragMsg Configuration.Movement.HorizontalOnDrag.Msg
    | HorizontalOnDropMsg Configuration.Movement.HorizontalOnDrop.Msg
    | VerticalOnDragMsg Configuration.Movement.VerticalOnDrag.Msg
    | VerticalOnDropMsg Configuration.Movement.VerticalOnDrop.Msg


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
                                stepFreeOnDrag (Configuration.Movement.FreeOnDrag.update msg mo)

                            ( FreeOnDropMsg msg, FreeOnDrop mo ) ->
                                stepFreeOnDrop (Configuration.Movement.FreeOnDrop.update msg mo)

                            ( HorizontalOnDragMsg msg, HorizontalOnDrag mo ) ->
                                stepHorizontalOnDrag (Configuration.Movement.HorizontalOnDrag.update msg mo)

                            ( HorizontalOnDropMsg msg, HorizontalOnDrop mo ) ->
                                stepHorizontalOnDrop (Configuration.Movement.HorizontalOnDrop.update msg mo)

                            ( VerticalOnDragMsg msg, VerticalOnDrag mo ) ->
                                stepVerticalOnDrag (Configuration.Movement.VerticalOnDrag.update msg mo)

                            ( VerticalOnDropMsg msg, VerticalOnDrop mo ) ->
                                stepVerticalOnDrop (Configuration.Movement.VerticalOnDrop.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepFreeOnDrag : ( Configuration.Movement.FreeOnDrag.Model, Cmd Configuration.Movement.FreeOnDrag.Msg ) -> ( Example, Cmd Msg )
stepFreeOnDrag ( mo, cmds ) =
    ( FreeOnDrag mo, Cmd.map FreeOnDragMsg cmds )


stepFreeOnDrop : ( Configuration.Movement.FreeOnDrop.Model, Cmd Configuration.Movement.FreeOnDrop.Msg ) -> ( Example, Cmd Msg )
stepFreeOnDrop ( mo, cmds ) =
    ( FreeOnDrop mo, Cmd.map FreeOnDropMsg cmds )


stepHorizontalOnDrag : ( Configuration.Movement.HorizontalOnDrag.Model, Cmd Configuration.Movement.HorizontalOnDrag.Msg ) -> ( Example, Cmd Msg )
stepHorizontalOnDrag ( mo, cmds ) =
    ( HorizontalOnDrag mo, Cmd.map HorizontalOnDragMsg cmds )


stepHorizontalOnDrop : ( Configuration.Movement.HorizontalOnDrop.Model, Cmd Configuration.Movement.HorizontalOnDrop.Msg ) -> ( Example, Cmd Msg )
stepHorizontalOnDrop ( mo, cmds ) =
    ( HorizontalOnDrop mo, Cmd.map HorizontalOnDropMsg cmds )


stepVerticalOnDrag : ( Configuration.Movement.VerticalOnDrag.Model, Cmd Configuration.Movement.VerticalOnDrag.Msg ) -> ( Example, Cmd Msg )
stepVerticalOnDrag ( mo, cmds ) =
    ( VerticalOnDrag mo, Cmd.map VerticalOnDragMsg cmds )


stepVerticalOnDrop : ( Configuration.Movement.VerticalOnDrop.Model, Cmd Configuration.Movement.VerticalOnDrop.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map FreeOnDragMsg (Configuration.Movement.FreeOnDrag.subscriptions mo)

                    FreeOnDrop mo ->
                        Sub.map FreeOnDropMsg (Configuration.Movement.FreeOnDrop.subscriptions mo)

                    HorizontalOnDrag mo ->
                        Sub.map HorizontalOnDragMsg (Configuration.Movement.HorizontalOnDrag.subscriptions mo)

                    HorizontalOnDrop mo ->
                        Sub.map HorizontalOnDropMsg (Configuration.Movement.HorizontalOnDrop.subscriptions mo)

                    VerticalOnDrag mo ->
                        Sub.map VerticalOnDragMsg (Configuration.Movement.VerticalOnDrag.subscriptions mo)

                    VerticalOnDrop mo ->
                        Sub.map VerticalOnDropMsg (Configuration.Movement.VerticalOnDrop.subscriptions mo)
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

        title : String
        title =
            (info >> .title) example
    in
    Html.div
        [ Html.Attributes.style "display" "flex"
        , Html.Attributes.style "justify-content" "center"
        , Html.Attributes.style "margin" "4em 0"
        ]
        [ demoView example
        , Html.div
            [ Html.Attributes.class "link"
            , Html.Events.onClick (LinkClicked globalId)
            ]
            [ Html.text title ]
        ]


demoView : Example -> Html.Html Msg
demoView example =
    case example of
        FreeOnDrag mo ->
            Html.map FreeOnDragMsg (Configuration.Movement.FreeOnDrag.view mo)

        FreeOnDrop mo ->
            Html.map FreeOnDropMsg (Configuration.Movement.FreeOnDrop.view mo)

        HorizontalOnDrag mo ->
            Html.map HorizontalOnDragMsg (Configuration.Movement.HorizontalOnDrag.view mo)

        HorizontalOnDrop mo ->
            Html.map HorizontalOnDropMsg (Configuration.Movement.HorizontalOnDrop.view mo)

        VerticalOnDrag mo ->
            Html.map VerticalOnDragMsg (Configuration.Movement.VerticalOnDrag.view mo)

        VerticalOnDrop mo ->
            Html.map VerticalOnDropMsg (Configuration.Movement.VerticalOnDrop.view mo)



-- EXAMPLE INFO


type alias Info =
    { title : String }


info : Example -> Info
info example =
    case example of
        FreeOnDrag _ ->
            { title = "Free on drag" }

        FreeOnDrop _ ->
            { title = "Free on drop" }

        HorizontalOnDrag _ ->
            { title = "Horizontal on drag" }

        HorizontalOnDrop _ ->
            { title = "Horizontal on drop" }

        VerticalOnDrag _ ->
            { title = "Vertical on drag" }

        VerticalOnDrop _ ->
            { title = "Vertical on drop" }
