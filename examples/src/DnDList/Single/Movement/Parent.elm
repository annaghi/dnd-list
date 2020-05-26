module DnDList.Single.Movement.Parent exposing
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

import DnDList.Single.Movement.FreeOnDrag
import DnDList.Single.Movement.FreeOnDrop
import DnDList.Single.Movement.HorizontalOnDrag
import DnDList.Single.Movement.HorizontalOnDrop
import DnDList.Single.Movement.VerticalOnDrag
import DnDList.Single.Movement.VerticalOnDrop
import Html
import Html.Attributes
import Html.Events



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = FreeOnDrag DnDList.Single.Movement.FreeOnDrag.Model
    | FreeOnDrop DnDList.Single.Movement.FreeOnDrop.Model
    | HorizontalOnDrag DnDList.Single.Movement.HorizontalOnDrag.Model
    | HorizontalOnDrop DnDList.Single.Movement.HorizontalOnDrop.Model
    | VerticalOnDrag DnDList.Single.Movement.VerticalOnDrag.Model
    | VerticalOnDrop DnDList.Single.Movement.VerticalOnDrop.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ FreeOnDrag DnDList.Single.Movement.FreeOnDrag.initialModel
        , FreeOnDrop DnDList.Single.Movement.FreeOnDrop.initialModel
        , HorizontalOnDrag DnDList.Single.Movement.HorizontalOnDrag.initialModel
        , HorizontalOnDrop DnDList.Single.Movement.HorizontalOnDrop.initialModel
        , VerticalOnDrag DnDList.Single.Movement.VerticalOnDrag.initialModel
        , VerticalOnDrop DnDList.Single.Movement.VerticalOnDrop.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Movement/FreeOnDrag.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Movement/FreeOnDrop.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Movement/HorizontalOnDrag.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Movement/HorizontalOnDrop.elm"

        4 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Movement/VerticalOnDrag.elm"

        5 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Movement/VerticalOnDrop.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | FreeOnDragMsg DnDList.Single.Movement.FreeOnDrag.Msg
    | FreeOnDropMsg DnDList.Single.Movement.FreeOnDrop.Msg
    | HorizontalOnDragMsg DnDList.Single.Movement.HorizontalOnDrag.Msg
    | HorizontalOnDropMsg DnDList.Single.Movement.HorizontalOnDrop.Msg
    | VerticalOnDragMsg DnDList.Single.Movement.VerticalOnDrag.Msg
    | VerticalOnDropMsg DnDList.Single.Movement.VerticalOnDrop.Msg


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
                                stepFreeOnDrag (DnDList.Single.Movement.FreeOnDrag.update msg mo)

                            ( FreeOnDropMsg msg, FreeOnDrop mo ) ->
                                stepFreeOnDrop (DnDList.Single.Movement.FreeOnDrop.update msg mo)

                            ( HorizontalOnDragMsg msg, HorizontalOnDrag mo ) ->
                                stepHorizontalOnDrag (DnDList.Single.Movement.HorizontalOnDrag.update msg mo)

                            ( HorizontalOnDropMsg msg, HorizontalOnDrop mo ) ->
                                stepHorizontalOnDrop (DnDList.Single.Movement.HorizontalOnDrop.update msg mo)

                            ( VerticalOnDragMsg msg, VerticalOnDrag mo ) ->
                                stepVerticalOnDrag (DnDList.Single.Movement.VerticalOnDrag.update msg mo)

                            ( VerticalOnDropMsg msg, VerticalOnDrop mo ) ->
                                stepVerticalOnDrop (DnDList.Single.Movement.VerticalOnDrop.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepFreeOnDrag : ( DnDList.Single.Movement.FreeOnDrag.Model, Cmd DnDList.Single.Movement.FreeOnDrag.Msg ) -> ( Example, Cmd Msg )
stepFreeOnDrag ( mo, cmds ) =
    ( FreeOnDrag mo, Cmd.map FreeOnDragMsg cmds )


stepFreeOnDrop : ( DnDList.Single.Movement.FreeOnDrop.Model, Cmd DnDList.Single.Movement.FreeOnDrop.Msg ) -> ( Example, Cmd Msg )
stepFreeOnDrop ( mo, cmds ) =
    ( FreeOnDrop mo, Cmd.map FreeOnDropMsg cmds )


stepHorizontalOnDrag : ( DnDList.Single.Movement.HorizontalOnDrag.Model, Cmd DnDList.Single.Movement.HorizontalOnDrag.Msg ) -> ( Example, Cmd Msg )
stepHorizontalOnDrag ( mo, cmds ) =
    ( HorizontalOnDrag mo, Cmd.map HorizontalOnDragMsg cmds )


stepHorizontalOnDrop : ( DnDList.Single.Movement.HorizontalOnDrop.Model, Cmd DnDList.Single.Movement.HorizontalOnDrop.Msg ) -> ( Example, Cmd Msg )
stepHorizontalOnDrop ( mo, cmds ) =
    ( HorizontalOnDrop mo, Cmd.map HorizontalOnDropMsg cmds )


stepVerticalOnDrag : ( DnDList.Single.Movement.VerticalOnDrag.Model, Cmd DnDList.Single.Movement.VerticalOnDrag.Msg ) -> ( Example, Cmd Msg )
stepVerticalOnDrag ( mo, cmds ) =
    ( VerticalOnDrag mo, Cmd.map VerticalOnDragMsg cmds )


stepVerticalOnDrop : ( DnDList.Single.Movement.VerticalOnDrop.Model, Cmd DnDList.Single.Movement.VerticalOnDrop.Msg ) -> ( Example, Cmd Msg )
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
                        Sub.map FreeOnDragMsg (DnDList.Single.Movement.FreeOnDrag.subscriptions mo)

                    FreeOnDrop mo ->
                        Sub.map FreeOnDropMsg (DnDList.Single.Movement.FreeOnDrop.subscriptions mo)

                    HorizontalOnDrag mo ->
                        Sub.map HorizontalOnDragMsg (DnDList.Single.Movement.HorizontalOnDrag.subscriptions mo)

                    HorizontalOnDrop mo ->
                        Sub.map HorizontalOnDropMsg (DnDList.Single.Movement.HorizontalOnDrop.subscriptions mo)

                    VerticalOnDrag mo ->
                        Sub.map VerticalOnDragMsg (DnDList.Single.Movement.VerticalOnDrag.subscriptions mo)

                    VerticalOnDrop mo ->
                        Sub.map VerticalOnDropMsg (DnDList.Single.Movement.VerticalOnDrop.subscriptions mo)
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
            Html.map FreeOnDragMsg (DnDList.Single.Movement.FreeOnDrag.view mo)

        FreeOnDrop mo ->
            Html.map FreeOnDropMsg (DnDList.Single.Movement.FreeOnDrop.view mo)

        HorizontalOnDrag mo ->
            Html.map HorizontalOnDragMsg (DnDList.Single.Movement.HorizontalOnDrag.view mo)

        HorizontalOnDrop mo ->
            Html.map HorizontalOnDropMsg (DnDList.Single.Movement.HorizontalOnDrop.view mo)

        VerticalOnDrag mo ->
            Html.map VerticalOnDragMsg (DnDList.Single.Movement.VerticalOnDrag.view mo)

        VerticalOnDrop mo ->
            Html.map VerticalOnDropMsg (DnDList.Single.Movement.VerticalOnDrop.view mo)



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
