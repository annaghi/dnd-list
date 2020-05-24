module DnDList.Parent exposing
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

import CustomElement
import DnDList.HookCommands.Parent
import DnDList.Movement.Parent
import DnDList.OperationsOnDrag.Parent
import DnDList.OperationsOnDrop.Parent
import Html
import Html.Attributes
import Path
import Url.Builder



-- MODEL


type alias Model =
    Example


type Example
    = Movement DnDList.Movement.Parent.Model
    | OperationsOnDrag DnDList.OperationsOnDrag.Parent.Model
    | OperationsOnDrop DnDList.OperationsOnDrop.Parent.Model
    | HookCommands DnDList.HookCommands.Parent.Model


init : String -> ( Model, Cmd Msg )
init slug =
    ( toExample slug, Cmd.none )



-- UPDATE


type Msg
    = MovementMsg DnDList.Movement.Parent.Msg
    | OperationsOnDragMsg DnDList.OperationsOnDrag.Parent.Msg
    | OperationsOnDropMsg DnDList.OperationsOnDrop.Parent.Msg
    | HookCommandsMsg DnDList.HookCommands.Parent.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model ) of
        ( MovementMsg msg, Movement mo ) ->
            stepMovement (DnDList.Movement.Parent.update msg mo)

        ( OperationsOnDragMsg msg, OperationsOnDrag mo ) ->
            stepOperationsOnDrag (DnDList.OperationsOnDrag.Parent.update msg mo)

        ( OperationsOnDropMsg msg, OperationsOnDrop mo ) ->
            stepOperationsOnDrop (DnDList.OperationsOnDrop.Parent.update msg mo)

        ( HookCommandsMsg msg, HookCommands mo ) ->
            stepHookCommands (DnDList.HookCommands.Parent.update msg mo)

        _ ->
            ( model, Cmd.none )


stepMovement : ( DnDList.Movement.Parent.Model, Cmd DnDList.Movement.Parent.Msg ) -> ( Model, Cmd Msg )
stepMovement ( mo, cmds ) =
    ( Movement mo, Cmd.map MovementMsg cmds )


stepOperationsOnDrag : ( DnDList.OperationsOnDrag.Parent.Model, Cmd DnDList.OperationsOnDrag.Parent.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrag ( mo, cmds ) =
    ( OperationsOnDrag mo, Cmd.map OperationsOnDragMsg cmds )


stepOperationsOnDrop : ( DnDList.OperationsOnDrop.Parent.Model, Cmd DnDList.OperationsOnDrop.Parent.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrop ( mo, cmds ) =
    ( OperationsOnDrop mo, Cmd.map OperationsOnDropMsg cmds )


stepHookCommands : ( DnDList.HookCommands.Parent.Model, Cmd DnDList.HookCommands.Parent.Msg ) -> ( Model, Cmd Msg )
stepHookCommands ( mo, cmds ) =
    ( HookCommands mo, Cmd.map HookCommandsMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        Movement mo ->
            Sub.map MovementMsg (DnDList.Movement.Parent.subscriptions mo)

        OperationsOnDrag mo ->
            Sub.map OperationsOnDragMsg (DnDList.OperationsOnDrag.Parent.subscriptions mo)

        OperationsOnDrop mo ->
            Sub.map OperationsOnDropMsg (DnDList.OperationsOnDrop.Parent.subscriptions mo)

        HookCommands mo ->
            Sub.map HookCommandsMsg (DnDList.HookCommands.Parent.subscriptions mo)



-- VIEW


navigationView : String -> Html.Html Msg
navigationView currentPath =
    Html.div
        [ Html.Attributes.class "navigation" ]
        [ Html.h4 [] [ Html.text "DnDList" ]
        , [ Movement DnDList.Movement.Parent.initialModel
          , OperationsOnDrag DnDList.OperationsOnDrag.Parent.initialModel
          , OperationsOnDrop DnDList.OperationsOnDrop.Parent.initialModel
          , HookCommands DnDList.HookCommands.Parent.initialModel
          ]
            |> List.map (linkView currentPath)
            |> Html.ul []
        ]


linkView : String -> Example -> Html.Html Msg
linkView currentPath example =
    let
        path : String
        path =
            Url.Builder.absolute [ Path.rootPath, "DnDList", (info >> .slug) example ] []
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
            Html.map MovementMsg (DnDList.Movement.Parent.view mo)

        OperationsOnDrag mo ->
            Html.map OperationsOnDragMsg (DnDList.OperationsOnDrag.Parent.view mo)

        OperationsOnDrop mo ->
            Html.map OperationsOnDropMsg (DnDList.OperationsOnDrop.Parent.view mo)

        HookCommands mo ->
            Html.map HookCommandsMsg (DnDList.HookCommands.Parent.view mo)


codeView : Model -> Html.Html Msg
codeView model =
    case model of
        Movement mo ->
            toCode (DnDList.Movement.Parent.url mo.id)

        OperationsOnDrag mo ->
            toCode (DnDList.OperationsOnDrag.Parent.url mo.id)

        OperationsOnDrop mo ->
            toCode (DnDList.OperationsOnDrop.Parent.url mo.id)

        HookCommands mo ->
            toCode (DnDList.HookCommands.Parent.url mo.id)


toCode : String -> Html.Html msg
toCode url =
    CustomElement.elmCode [ CustomElement.href url ] []



-- EXAMPLE INFO


toExample : String -> Example
toExample slug =
    case slug of
        "movement" ->
            Movement DnDList.Movement.Parent.initialModel

        "operations-drag" ->
            OperationsOnDrag DnDList.OperationsOnDrag.Parent.initialModel

        "operations-drop" ->
            OperationsOnDrop DnDList.OperationsOnDrop.Parent.initialModel

        "hook-commands" ->
            HookCommands DnDList.HookCommands.Parent.initialModel

        _ ->
            Movement DnDList.Movement.Parent.initialModel


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

        HookCommands _ ->
            { slug = "hook-commands"
            , title = "Hook commands"
            , description = "Compare detectDrop and detectReorder hooks."
            }
