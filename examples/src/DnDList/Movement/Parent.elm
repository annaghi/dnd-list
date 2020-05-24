module DnDList.Movement.Parent exposing
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

import DnDList.Movement.FreeOnDrag
import DnDList.Movement.FreeOnDrop
import DnDList.Movement.HorizontalOnDrag
import DnDList.Movement.HorizontalOnDrop
import DnDList.Movement.VerticalOnDrag
import DnDList.Movement.VerticalOnDrop
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = FreeOnDrag DnDList.Movement.FreeOnDrag.Model
    | FreeOnDrop DnDList.Movement.FreeOnDrop.Model
    | HorizontalOnDrag DnDList.Movement.HorizontalOnDrag.Model
    | HorizontalOnDrop DnDList.Movement.HorizontalOnDrop.Model
    | VerticalOnDrag DnDList.Movement.VerticalOnDrag.Model
    | VerticalOnDrop DnDList.Movement.VerticalOnDrop.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ FreeOnDrag DnDList.Movement.FreeOnDrag.initialModel
        , FreeOnDrop DnDList.Movement.FreeOnDrop.initialModel
        , HorizontalOnDrag DnDList.Movement.HorizontalOnDrag.initialModel
        , HorizontalOnDrop DnDList.Movement.HorizontalOnDrop.initialModel
        , VerticalOnDrag DnDList.Movement.VerticalOnDrag.initialModel
        , VerticalOnDrop DnDList.Movement.VerticalOnDrop.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Movement/FreeOnDrag.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Movement/FreeOnDrop.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Movement/HorizontalOnDrag.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Movement/HorizontalOnDrop.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Movement/VerticalOnDrag.elm"

        5 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Movement/VerticalOnDrop.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | FreeOnDragMsg DnDList.Movement.FreeOnDrag.Msg
    | FreeOnDropMsg DnDList.Movement.FreeOnDrop.Msg
    | HorizontalOnDragMsg DnDList.Movement.HorizontalOnDrag.Msg
    | HorizontalOnDropMsg DnDList.Movement.HorizontalOnDrop.Msg
    | VerticalOnDragMsg DnDList.Movement.VerticalOnDrag.Msg
    | VerticalOnDropMsg DnDList.Movement.VerticalOnDrop.Msg


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
                                stepFreeOnDrag (DnDList.Movement.FreeOnDrag.update msg mo)

                            ( FreeOnDropMsg msg, FreeOnDrop mo ) ->
                                stepFreeOnDrop (DnDList.Movement.FreeOnDrop.update msg mo)

                            ( HorizontalOnDragMsg msg, HorizontalOnDrag mo ) ->
                                stepHorizontalOnDrag (DnDList.Movement.HorizontalOnDrag.update msg mo)

                            ( HorizontalOnDropMsg msg, HorizontalOnDrop mo ) ->
                                stepHorizontalOnDrop (DnDList.Movement.HorizontalOnDrop.update msg mo)

                            ( VerticalOnDragMsg msg, VerticalOnDrag mo ) ->
                                stepVerticalOnDrag (DnDList.Movement.VerticalOnDrag.update msg mo)

                            ( VerticalOnDropMsg msg, VerticalOnDrop mo ) ->
                                stepVerticalOnDrop (DnDList.Movement.VerticalOnDrop.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepFreeOnDrag : ( DnDList.Movement.FreeOnDrag.Model, Cmd DnDList.Movement.FreeOnDrag.Msg ) -> ( Example, Cmd Msg )
stepFreeOnDrag ( mo, cmds ) =
    ( FreeOnDrag mo, Cmd.map FreeOnDragMsg cmds )


stepFreeOnDrop : ( DnDList.Movement.FreeOnDrop.Model, Cmd DnDList.Movement.FreeOnDrop.Msg ) -> ( Example, Cmd Msg )
stepFreeOnDrop ( mo, cmds ) =
    ( FreeOnDrop mo, Cmd.map FreeOnDropMsg cmds )


stepHorizontalOnDrag : ( DnDList.Movement.HorizontalOnDrag.Model, Cmd DnDList.Movement.HorizontalOnDrag.Msg ) -> ( Example, Cmd Msg )
stepHorizontalOnDrag ( mo, cmds ) =
    ( HorizontalOnDrag mo, Cmd.map HorizontalOnDragMsg cmds )


stepHorizontalOnDrop : ( DnDList.Movement.HorizontalOnDrop.Model, Cmd DnDList.Movement.HorizontalOnDrop.Msg ) -> ( Example, Cmd Msg )
stepHorizontalOnDrop ( mo, cmds ) =
    ( HorizontalOnDrop mo, Cmd.map HorizontalOnDropMsg cmds )


stepVerticalOnDrag : ( DnDList.Movement.VerticalOnDrag.Model, Cmd DnDList.Movement.VerticalOnDrag.Msg ) -> ( Example, Cmd Msg )
stepVerticalOnDrag ( mo, cmds ) =
    ( VerticalOnDrag mo, Cmd.map VerticalOnDragMsg cmds )


stepVerticalOnDrop : ( DnDList.Movement.VerticalOnDrop.Model, Cmd DnDList.Movement.VerticalOnDrop.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map FreeOnDragMsg (DnDList.Movement.FreeOnDrag.subscriptions mo)

                    FreeOnDrop mo ->
                        Sub.map FreeOnDropMsg (DnDList.Movement.FreeOnDrop.subscriptions mo)

                    HorizontalOnDrag mo ->
                        Sub.map HorizontalOnDragMsg (DnDList.Movement.HorizontalOnDrag.subscriptions mo)

                    HorizontalOnDrop mo ->
                        Sub.map HorizontalOnDropMsg (DnDList.Movement.HorizontalOnDrop.subscriptions mo)

                    VerticalOnDrag mo ->
                        Sub.map VerticalOnDragMsg (DnDList.Movement.VerticalOnDrag.subscriptions mo)

                    VerticalOnDrop mo ->
                        Sub.map VerticalOnDropMsg (DnDList.Movement.VerticalOnDrop.subscriptions mo)
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
            Html.map FreeOnDragMsg (DnDList.Movement.FreeOnDrag.view mo)

        FreeOnDrop mo ->
            Html.map FreeOnDropMsg (DnDList.Movement.FreeOnDrop.view mo)

        HorizontalOnDrag mo ->
            Html.map HorizontalOnDragMsg (DnDList.Movement.HorizontalOnDrag.view mo)

        HorizontalOnDrop mo ->
            Html.map HorizontalOnDropMsg (DnDList.Movement.HorizontalOnDrop.view mo)

        VerticalOnDrag mo ->
            Html.map VerticalOnDragMsg (DnDList.Movement.VerticalOnDrag.view mo)

        VerticalOnDrop mo ->
            Html.map VerticalOnDropMsg (DnDList.Movement.VerticalOnDrop.view mo)



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
