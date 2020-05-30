module DnDList.Groups.Parent exposing
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
import DnDList.Groups.HookCommands.Parent
import DnDList.Groups.OperationsOnDrag.Parent
import DnDList.Groups.OperationsOnDrop.Parent
import Html
import Views



-- MODEL


type alias Model =
    Example


type Example
    = OperationsOnDrag DnDList.Groups.OperationsOnDrag.Parent.Model
    | OperationsOnDrop DnDList.Groups.OperationsOnDrop.Parent.Model
    | HookCommands DnDList.Groups.HookCommands.Parent.Model


init : String -> ( Model, Cmd Msg )
init slug =
    ( toExample slug, Cmd.none )



-- UPDATE


type Msg
    = OperationsOnDragMsg DnDList.Groups.OperationsOnDrag.Parent.Msg
    | OperationsOnDropMsg DnDList.Groups.OperationsOnDrop.Parent.Msg
    | HookCommandsMsg DnDList.Groups.HookCommands.Parent.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model ) of
        ( OperationsOnDragMsg msg, OperationsOnDrag mo ) ->
            stepOperationsOnDrag (DnDList.Groups.OperationsOnDrag.Parent.update msg mo)

        ( OperationsOnDropMsg msg, OperationsOnDrop mo ) ->
            stepOperationsOnDrop (DnDList.Groups.OperationsOnDrop.Parent.update msg mo)

        ( HookCommandsMsg msg, HookCommands mo ) ->
            stepHookCommands (DnDList.Groups.HookCommands.Parent.update msg mo)

        _ ->
            ( model, Cmd.none )


stepOperationsOnDrag : ( DnDList.Groups.OperationsOnDrag.Parent.Model, Cmd DnDList.Groups.OperationsOnDrag.Parent.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrag ( mo, cmds ) =
    ( OperationsOnDrag mo, Cmd.map OperationsOnDragMsg cmds )


stepOperationsOnDrop : ( DnDList.Groups.OperationsOnDrop.Parent.Model, Cmd DnDList.Groups.OperationsOnDrop.Parent.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrop ( mo, cmds ) =
    ( OperationsOnDrop mo, Cmd.map OperationsOnDropMsg cmds )


stepHookCommands : ( DnDList.Groups.HookCommands.Parent.Model, Cmd DnDList.Groups.HookCommands.Parent.Msg ) -> ( Model, Cmd Msg )
stepHookCommands ( mo, cmds ) =
    ( HookCommands mo, Cmd.map HookCommandsMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        OperationsOnDrag mo ->
            Sub.map OperationsOnDragMsg (DnDList.Groups.OperationsOnDrag.Parent.subscriptions mo)

        OperationsOnDrop mo ->
            Sub.map OperationsOnDropMsg (DnDList.Groups.OperationsOnDrop.Parent.subscriptions mo)

        HookCommands mo ->
            Sub.map HookCommandsMsg (DnDList.Groups.HookCommands.Parent.subscriptions mo)



-- VIEW


navigationView : Html.Html msg
navigationView =
    Views.navigationView
        "DnDList.Groups"
        "groups"
        info
        [ OperationsOnDrag DnDList.Groups.OperationsOnDrag.Parent.initialModel
        , OperationsOnDrop DnDList.Groups.OperationsOnDrop.Parent.initialModel
        , HookCommands DnDList.Groups.HookCommands.Parent.initialModel
        ]


headerView : Model -> Html.Html Msg
headerView model =
    Views.demoHeaderView info model


demoView : Model -> Html.Html Msg
demoView model =
    case model of
        OperationsOnDrag mo ->
            Html.map OperationsOnDragMsg (DnDList.Groups.OperationsOnDrag.Parent.view mo)

        OperationsOnDrop mo ->
            Html.map OperationsOnDropMsg (DnDList.Groups.OperationsOnDrop.Parent.view mo)

        HookCommands mo ->
            Html.map HookCommandsMsg (DnDList.Groups.HookCommands.Parent.view mo)


codeView : Model -> Html.Html Msg
codeView model =
    case model of
        OperationsOnDrag mo ->
            toCode (DnDList.Groups.OperationsOnDrag.Parent.url mo.id)

        OperationsOnDrop mo ->
            toCode (DnDList.Groups.OperationsOnDrop.Parent.url mo.id)

        HookCommands mo ->
            toCode (DnDList.Groups.HookCommands.Parent.url mo.id)


toCode : String -> Html.Html msg
toCode url =
    CustomElement.elmCode [ CustomElement.href url ] []



-- EXAMPLE INFO


toExample : String -> Example
toExample slug =
    case slug of
        "operations-drag" ->
            OperationsOnDrag DnDList.Groups.OperationsOnDrag.Parent.initialModel

        "operations-drop" ->
            OperationsOnDrop DnDList.Groups.OperationsOnDrop.Parent.initialModel

        "hook-commands" ->
            HookCommands DnDList.Groups.HookCommands.Parent.initialModel

        _ ->
            OperationsOnDrag DnDList.Groups.OperationsOnDrag.Parent.initialModel


type alias Info =
    { slug : String
    , title : String
    , description : String
    }


info : Example -> Info
info example =
    case example of
        OperationsOnDrag _ ->
            { slug = "operations-drag"
            , title = "Operations on drag"
            , description = "Compare the list operations with groups sorting on drag."
            }

        OperationsOnDrop _ ->
            { slug = "operations-drop"
            , title = "Operations on drop"
            , description = "Compare the list operations with groups sorting on drop."
            }

        HookCommands _ ->
            { slug = "hook-commands"
            , title = "Hook commands"
            , description = "Compare detectDrop and detectReorder hooks."
            }
