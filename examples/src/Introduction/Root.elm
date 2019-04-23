module Introduction.Root exposing
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

import Base
import CustomElement
import Html
import Html.Attributes
import Introduction.Basic
import Introduction.BasicElmUI
import Introduction.Groups
import Introduction.Handle
import Introduction.Independents
import Introduction.Keyed
import Introduction.Margins
import Introduction.Masonry
import Introduction.Resize
import Url.Builder



-- MODEL


type alias Model =
    { slug : String
    , example : Example
    }


type Example
    = Basic Introduction.Basic.Model
    | BasicElmUI Introduction.BasicElmUI.Model
    | Handle Introduction.Handle.Model
    | Keyed Introduction.Keyed.Model
    | Margins Introduction.Margins.Model
    | Masonry Introduction.Masonry.Model
    | Resize Introduction.Resize.Model
    | Independents Introduction.Independents.Model
    | Groups Introduction.Groups.Model


init : String -> ( Model, Cmd Msg )
init slug =
    ( { slug = slug, example = selectExample slug }, commands )


selectExample : String -> Example
selectExample slug =
    case slug of
        "basic" ->
            Basic Introduction.Basic.initialModel

        "basic-elm-ui" ->
            BasicElmUI Introduction.BasicElmUI.initialModel

        "handle" ->
            Handle Introduction.Handle.initialModel

        "keyed" ->
            Keyed Introduction.Keyed.initialModel

        "margins" ->
            Margins Introduction.Margins.initialModel

        "masonry" ->
            Masonry Introduction.Masonry.initialModel

        "resize" ->
            Resize Introduction.Resize.initialModel

        "independents" ->
            Independents Introduction.Independents.initialModel

        "groups" ->
            Groups Introduction.Groups.initialModel

        _ ->
            Basic Introduction.Basic.initialModel



-- UPDATE


type Msg
    = BasicMsg Introduction.Basic.Msg
    | BasicElmUIMsg Introduction.BasicElmUI.Msg
    | HandleMsg Introduction.Handle.Msg
    | KeyedMsg Introduction.Keyed.Msg
    | MarginsMsg Introduction.Margins.Msg
    | MasonryMsg Introduction.Masonry.Msg
    | ResizeMsg Introduction.Resize.Msg
    | IndependentsMsg Introduction.Independents.Msg
    | GroupsMsg Introduction.Groups.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model.example ) of
        ( BasicMsg msg, Basic mo ) ->
            stepBasic model (Introduction.Basic.update msg mo)

        ( BasicElmUIMsg msg, BasicElmUI mo ) ->
            stepBasicElmUI model (Introduction.BasicElmUI.update msg mo)

        ( HandleMsg msg, Handle mo ) ->
            stepHandle model (Introduction.Handle.update msg mo)

        ( KeyedMsg msg, Keyed mo ) ->
            stepKeyed model (Introduction.Keyed.update msg mo)

        ( MarginsMsg msg, Margins mo ) ->
            stepMargins model (Introduction.Margins.update msg mo)

        ( MasonryMsg msg, Masonry mo ) ->
            stepMasonry model (Introduction.Masonry.update msg mo)

        ( ResizeMsg msg, Resize mo ) ->
            stepResize model (Introduction.Resize.update msg mo)

        ( IndependentsMsg msg, Independents mo ) ->
            stepIndependents model (Introduction.Independents.update msg mo)

        ( GroupsMsg msg, Groups mo ) ->
            stepGroups model (Introduction.Groups.update msg mo)

        _ ->
            ( model, Cmd.none )


stepBasic : Model -> ( Introduction.Basic.Model, Cmd Introduction.Basic.Msg ) -> ( Model, Cmd Msg )
stepBasic model ( mo, cmds ) =
    ( { model | example = Basic mo }, Cmd.map BasicMsg cmds )


stepBasicElmUI : Model -> ( Introduction.BasicElmUI.Model, Cmd Introduction.BasicElmUI.Msg ) -> ( Model, Cmd Msg )
stepBasicElmUI model ( mo, cmds ) =
    ( { model | example = BasicElmUI mo }, Cmd.map BasicElmUIMsg cmds )


stepHandle : Model -> ( Introduction.Handle.Model, Cmd Introduction.Handle.Msg ) -> ( Model, Cmd Msg )
stepHandle model ( mo, cmds ) =
    ( { model | example = Handle mo }, Cmd.map HandleMsg cmds )


stepKeyed : Model -> ( Introduction.Keyed.Model, Cmd Introduction.Keyed.Msg ) -> ( Model, Cmd Msg )
stepKeyed model ( mo, cmds ) =
    ( { model | example = Keyed mo }, Cmd.map KeyedMsg cmds )


stepMargins : Model -> ( Introduction.Margins.Model, Cmd Introduction.Margins.Msg ) -> ( Model, Cmd Msg )
stepMargins model ( mo, cmds ) =
    ( { model | example = Margins mo }, Cmd.map MarginsMsg cmds )


stepMasonry : Model -> ( Introduction.Masonry.Model, Cmd Introduction.Masonry.Msg ) -> ( Model, Cmd Msg )
stepMasonry model ( mo, cmds ) =
    ( { model | example = Masonry mo }, Cmd.map MasonryMsg cmds )


stepResize : Model -> ( Introduction.Resize.Model, Cmd Introduction.Resize.Msg ) -> ( Model, Cmd Msg )
stepResize model ( mo, cmds ) =
    ( { model | example = Resize mo }, Cmd.map ResizeMsg cmds )


stepIndependents : Model -> ( Introduction.Independents.Model, Cmd Introduction.Independents.Msg ) -> ( Model, Cmd Msg )
stepIndependents model ( mo, cmds ) =
    ( { model | example = Independents mo }, Cmd.map IndependentsMsg cmds )


stepGroups : Model -> ( Introduction.Groups.Model, Cmd Introduction.Groups.Msg ) -> ( Model, Cmd Msg )
stepGroups model ( mo, cmds ) =
    ( { model | example = Groups mo }, Cmd.map GroupsMsg cmds )



-- COMMANDS


commands : Cmd Msg
commands =
    Cmd.batch
        [ Cmd.map MasonryMsg Introduction.Masonry.commands ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.example of
        Basic mo ->
            Sub.map BasicMsg (Introduction.Basic.subscriptions mo)

        BasicElmUI mo ->
            Sub.map BasicElmUIMsg (Introduction.BasicElmUI.subscriptions mo)

        Handle mo ->
            Sub.map HandleMsg (Introduction.Handle.subscriptions mo)

        Keyed mo ->
            Sub.map KeyedMsg (Introduction.Keyed.subscriptions mo)

        Margins mo ->
            Sub.map MarginsMsg (Introduction.Margins.subscriptions mo)

        Masonry mo ->
            Sub.map MasonryMsg (Introduction.Masonry.subscriptions mo)

        Resize mo ->
            Sub.map ResizeMsg (Introduction.Resize.subscriptions mo)

        Independents mo ->
            Sub.map IndependentsMsg (Introduction.Independents.subscriptions mo)

        Groups mo ->
            Sub.map GroupsMsg (Introduction.Groups.subscriptions mo)



-- VIEW


navigationView : Html.Html Msg
navigationView =
    Html.div
        [ Html.Attributes.class "navigation" ]
        [ Html.h4 [] [ Html.text "Introduction" ]
        , [ Basic Introduction.Basic.initialModel
          , BasicElmUI Introduction.BasicElmUI.initialModel
          , Handle Introduction.Handle.initialModel
          , Keyed Introduction.Keyed.initialModel
          , Margins Introduction.Margins.initialModel
          , Masonry Introduction.Masonry.initialModel
          , Resize Introduction.Resize.initialModel
          , Independents Introduction.Independents.initialModel
          , Groups Introduction.Groups.initialModel
          ]
            |> List.map linkView
            |> Html.ul []
        ]


linkView : Example -> Html.Html Msg
linkView example =
    let
        path : String
        path =
            Url.Builder.absolute [ Base.base, "introduction", (info >> .slug) example ] []
    in
    Html.li []
        [ Html.a
            [ Html.Attributes.href path ]
            [ Html.text ((info >> .title) example) ]
        ]


headerView : Model -> Html.Html Msg
headerView model =
    let
        title : String
        title =
            (info >> .title) model.example

        description : String
        description =
            (info >> .description) model.example
    in
    Html.header []
        [ Html.h2 [] [ Html.text title ]
        , Html.p [] [ Html.text description ]
        ]


demoView : Model -> Html.Html Msg
demoView model =
    case model.example of
        Basic mo ->
            Html.map BasicMsg (Introduction.Basic.view mo)

        BasicElmUI mo ->
            Html.map BasicElmUIMsg (Introduction.BasicElmUI.view mo)

        Handle mo ->
            Html.map HandleMsg (Introduction.Handle.view mo)

        Keyed mo ->
            Html.map KeyedMsg (Introduction.Keyed.view mo)

        Margins mo ->
            Html.map MarginsMsg (Introduction.Margins.view mo)

        Masonry mo ->
            Html.map MasonryMsg (Introduction.Masonry.view mo)

        Resize mo ->
            Html.map ResizeMsg (Introduction.Resize.view mo)

        Independents mo ->
            Html.map IndependentsMsg (Introduction.Independents.view mo)

        Groups mo ->
            Html.map GroupsMsg (Introduction.Groups.view mo)


codeView : Model -> Html.Html Msg
codeView model =
    case model.example of
        Basic _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Basic.elm"

        BasicElmUI _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/BasicElmUI.elm"

        Handle _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Handle.elm"

        Keyed _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Keyed.elm"

        Margins _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Margins.elm"

        Masonry _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Masonry.elm"

        Resize _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Resize.elm"

        Independents _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Independents.elm"

        Groups _ ->
            toCode "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Groups.elm"


toCode : String -> Html.Html msg
toCode url =
    CustomElement.elmCode [ CustomElement.href url ] []



-- EXAMPLE INFO


type alias Info =
    { slug : String
    , title : String
    , description : String
    }


info : Example -> Info
info example =
    case example of
        Basic _ ->
            { slug = "basic"
            , title = "Basic"
            , description = "Plain sortable list"
            }

        BasicElmUI _ ->
            { slug = "basic-elm-ui"
            , title = "Basic + Elm UI"
            , description = "Designed with mdgriffith/elm-ui"
            }

        Handle _ ->
            { slug = "handle"
            , title = "Drag handle"
            , description = "Use a subelement as a drag handle."
            }

        Keyed _ ->
            { slug = "keyed"
            , title = "Keyed nodes"
            , description = "Use Html.Keyed for optimized DOM updates."
            }

        Margins _ ->
            { slug = "margins"
            , title = "Margins"
            , description = "Wrap elements in case top or left margins are needed."
            }

        Masonry _ ->
            { slug = "masonry"
            , title = "Masonry"
            , description = "Simple horizontal masonry."
            }

        Resize _ ->
            { slug = "resize"
            , title = "Resize"
            , description = "Put a drag handle to the top-left corner with resizable dragged elements."
            }

        Independents _ ->
            { slug = "independents"
            , title = "Independent lists"
            , description = "Without thinking: duplicate everything."
            }

        Groups _ ->
            { slug = "groups"
            , title = "Groupable list"
            , description = "The list state invariant is that the list has to be gathered by the grouping property."
            }
