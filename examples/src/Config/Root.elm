module Config.Root exposing
    ( Model
    , Msg
    , codeView
    , demoView
    , headerView
    , init
    , navigationView
    , subscriptions
    , update
    )

import Config.Movement.Root
import Config.OperationsOnDrag.Root
import Config.OperationsOnDrop.Root
import CustomElement
import Html
import Html.Attributes
import Path
import Url.Builder



-- MODEL


type alias Model =
    Example


type Example
    = Movement Config.Movement.Root.Model
    | OperationsOnDrag Config.OperationsOnDrag.Root.Model
    | OperationsOnDrop Config.OperationsOnDrop.Root.Model


init : String -> ( Model, Cmd Msg )
init slug =
    ( toExample slug, Cmd.none )



-- UPDATE


type Msg
    = MovementMsg Config.Movement.Root.Msg
    | OperationsOnDragMsg Config.OperationsOnDrag.Root.Msg
    | OperationsOnDropMsg Config.OperationsOnDrop.Root.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model ) of
        ( MovementMsg msg, Movement mo ) ->
            stepMovement (Config.Movement.Root.update msg mo)

        ( OperationsOnDragMsg msg, OperationsOnDrag mo ) ->
            stepOperationsOnDrag (Config.OperationsOnDrag.Root.update msg mo)

        ( OperationsOnDropMsg msg, OperationsOnDrop mo ) ->
            stepOperationsOnDrop (Config.OperationsOnDrop.Root.update msg mo)

        _ ->
            ( model, Cmd.none )


stepMovement : ( Config.Movement.Root.Model, Cmd Config.Movement.Root.Msg ) -> ( Model, Cmd Msg )
stepMovement ( mo, cmds ) =
    ( Movement mo, Cmd.map MovementMsg cmds )


stepOperationsOnDrag : ( Config.OperationsOnDrag.Root.Model, Cmd Config.OperationsOnDrag.Root.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrag ( mo, cmds ) =
    ( OperationsOnDrag mo, Cmd.map OperationsOnDragMsg cmds )


stepOperationsOnDrop : ( Config.OperationsOnDrop.Root.Model, Cmd Config.OperationsOnDrop.Root.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrop ( mo, cmds ) =
    ( OperationsOnDrop mo, Cmd.map OperationsOnDropMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        Movement mo ->
            Sub.map MovementMsg (Config.Movement.Root.subscriptions mo)

        OperationsOnDrag mo ->
            Sub.map OperationsOnDragMsg (Config.OperationsOnDrag.Root.subscriptions mo)

        OperationsOnDrop mo ->
            Sub.map OperationsOnDropMsg (Config.OperationsOnDrop.Root.subscriptions mo)



-- VIEW


navigationView : String -> Html.Html Msg
navigationView currentPath =
    Html.div
        [ Html.Attributes.class "navigation" ]
        [ Html.h4 [] [ Html.text "DnDList" ]
        , [ Movement Config.Movement.Root.initialModel
          , OperationsOnDrag Config.OperationsOnDrag.Root.initialModel
          , OperationsOnDrop Config.OperationsOnDrop.Root.initialModel
          ]
            |> List.map (linkView currentPath)
            |> Html.ul []
        ]


linkView : String -> Example -> Html.Html Msg
linkView currentPath example =
    let
        path : String
        path =
            Url.Builder.absolute [ Path.rootPath, "config", (info >> .slug) example ] []
    in
    Html.li []
        [ Html.a
            [ Html.Attributes.classList [ ( "is-active", path == currentPath ) ]
            , Html.Attributes.href path
            ]
            [ Html.text ((info >> .title) example) ]
        ]


headerView : Model -> Html.Html Msg
headerView model =
    let
        title : String
        title =
            (info >> .title) model

        description : String
        description =
            (info >> .description) model
    in
    Html.header []
        [ Html.h2 [] [ Html.text title ]
        , Html.p [] [ Html.text description ]
        ]


demoView : Model -> Html.Html Msg
demoView model =
    case model of
        Movement mo ->
            Html.map MovementMsg (Config.Movement.Root.view mo)

        OperationsOnDrag mo ->
            Html.map OperationsOnDragMsg (Config.OperationsOnDrag.Root.view mo)

        OperationsOnDrop mo ->
            Html.map OperationsOnDropMsg (Config.OperationsOnDrop.Root.view mo)


codeView : Model -> Html.Html Msg
codeView model =
    case model of
        Movement mo ->
            toCode (Config.Movement.Root.url mo.id)

        OperationsOnDrag mo ->
            toCode (Config.OperationsOnDrag.Root.url mo.id)

        OperationsOnDrop mo ->
            toCode (Config.OperationsOnDrop.Root.url mo.id)


toCode : String -> Html.Html msg
toCode url =
    CustomElement.elmCode [ CustomElement.href url ] []



-- EXAMPLE INFO


toExample : String -> Example
toExample slug =
    case slug of
        "movement" ->
            Movement Config.Movement.Root.initialModel

        "operations-drag" ->
            OperationsOnDrag Config.OperationsOnDrag.Root.initialModel

        "operations-drop" ->
            OperationsOnDrop Config.OperationsOnDrop.Root.initialModel

        _ ->
            Movement Config.Movement.Root.initialModel


type alias Info =
    { slug : String
    , title : String
    , description : String
    }


info : Example -> Info
info example =
    case example of
        Movement _ ->
            { slug = "movement"
            , title = "Movement"
            , description = "The behavior of the Free, Horizontal only and Vertical only drag movements with Swap list operation."
            }

        OperationsOnDrag _ ->
            { slug = "operations-drag"
            , title = "Operations on drag"
            , description = "Compare the list operations sorting on drag."
            }

        OperationsOnDrop _ ->
            { slug = "operations-drop"
            , title = "Operations on drop"
            , description = "Compare the list operations sorting on drop."
            }
