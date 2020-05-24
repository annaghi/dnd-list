module DnDListGroups.Parent exposing
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
import DnDListGroups.HookCommands.Parent
import DnDListGroups.OperationsOnDrag.Parent
import DnDListGroups.OperationsOnDrop.Parent
import Html
import Html.Attributes
import Path
import Url.Builder



-- MODEL


type alias Model =
    Example


type Example
    = OperationsOnDrag DnDListGroups.OperationsOnDrag.Parent.Model
    | OperationsOnDrop DnDListGroups.OperationsOnDrop.Parent.Model
    | HookCommands DnDListGroups.HookCommands.Parent.Model


init : String -> ( Model, Cmd Msg )
init slug =
    ( toExample slug, Cmd.none )



-- UPDATE


type Msg
    = OperationsOnDragMsg DnDListGroups.OperationsOnDrag.Parent.Msg
    | OperationsOnDropMsg DnDListGroups.OperationsOnDrop.Parent.Msg
    | HookCommandsMsg DnDListGroups.HookCommands.Parent.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model ) of
        ( OperationsOnDragMsg msg, OperationsOnDrag mo ) ->
            stepOperationsOnDrag (DnDListGroups.OperationsOnDrag.Parent.update msg mo)

        ( OperationsOnDropMsg msg, OperationsOnDrop mo ) ->
            stepOperationsOnDrop (DnDListGroups.OperationsOnDrop.Parent.update msg mo)

        ( HookCommandsMsg msg, HookCommands mo ) ->
            stepHookCommands (DnDListGroups.HookCommands.Parent.update msg mo)

        _ ->
            ( model, Cmd.none )


stepOperationsOnDrag : ( DnDListGroups.OperationsOnDrag.Parent.Model, Cmd DnDListGroups.OperationsOnDrag.Parent.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrag ( mo, cmds ) =
    ( OperationsOnDrag mo, Cmd.map OperationsOnDragMsg cmds )


stepOperationsOnDrop : ( DnDListGroups.OperationsOnDrop.Parent.Model, Cmd DnDListGroups.OperationsOnDrop.Parent.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrop ( mo, cmds ) =
    ( OperationsOnDrop mo, Cmd.map OperationsOnDropMsg cmds )


stepHookCommands : ( DnDListGroups.HookCommands.Parent.Model, Cmd DnDListGroups.HookCommands.Parent.Msg ) -> ( Model, Cmd Msg )
stepHookCommands ( mo, cmds ) =
    ( HookCommands mo, Cmd.map HookCommandsMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        OperationsOnDrag mo ->
            Sub.map OperationsOnDragMsg (DnDListGroups.OperationsOnDrag.Parent.subscriptions mo)

        OperationsOnDrop mo ->
            Sub.map OperationsOnDropMsg (DnDListGroups.OperationsOnDrop.Parent.subscriptions mo)

        HookCommands mo ->
            Sub.map HookCommandsMsg (DnDListGroups.HookCommands.Parent.subscriptions mo)



-- VIEW


navigationView : String -> Html.Html Msg
navigationView currentPath =
    Html.div
        [ Html.Attributes.class "navigation" ]
        [ Html.h4 [] [ Html.text "DnDList.Groups" ]
        , [ OperationsOnDrag DnDListGroups.OperationsOnDrag.Parent.initialModel
          , OperationsOnDrop DnDListGroups.OperationsOnDrop.Parent.initialModel
          , HookCommands DnDListGroups.HookCommands.Parent.initialModel
          ]
            |> List.map (linkView currentPath)
            |> Html.ul []
        ]


linkView : String -> Example -> Html.Html Msg
linkView currentPath example =
    let
        path : String
        path =
            Url.Builder.absolute [ Path.rootPath, "DnDListGroups", (info >> .slug) example ] []
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
        OperationsOnDrag mo ->
            Html.map OperationsOnDragMsg (DnDListGroups.OperationsOnDrag.Parent.view mo)

        OperationsOnDrop mo ->
            Html.map OperationsOnDropMsg (DnDListGroups.OperationsOnDrop.Parent.view mo)

        HookCommands mo ->
            Html.map HookCommandsMsg (DnDListGroups.HookCommands.Parent.view mo)


codeView : Model -> Html.Html Msg
codeView model =
    case model of
        OperationsOnDrag mo ->
            toCode (DnDListGroups.OperationsOnDrag.Parent.url mo.id)

        OperationsOnDrop mo ->
            toCode (DnDListGroups.OperationsOnDrop.Parent.url mo.id)

        HookCommands mo ->
            toCode (DnDListGroups.HookCommands.Parent.url mo.id)


toCode : String -> Html.Html msg
toCode url =
    CustomElement.elmCode [ CustomElement.href url ] []



-- EXAMPLE INFO


toExample : String -> Example
toExample slug =
    case slug of
        "operations-drag" ->
            OperationsOnDrag DnDListGroups.OperationsOnDrag.Parent.initialModel

        "operations-drop" ->
            OperationsOnDrop DnDListGroups.OperationsOnDrop.Parent.initialModel

        "hook-commands" ->
            HookCommands DnDListGroups.HookCommands.Parent.initialModel

        _ ->
            OperationsOnDrag DnDListGroups.OperationsOnDrag.Parent.initialModel


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
