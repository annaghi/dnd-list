module ConfigGroups.Root exposing
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
import ConfigGroups.OperationsOnDrag.Root
import ConfigGroups.OperationsOnDrop.Root
import CustomElement
import Html
import Html.Attributes
import Url.Builder



-- MODEL


type alias Model =
    Example


type Example
    = OperationsOnDrag ConfigGroups.OperationsOnDrag.Root.Model
    | OperationsOnDrop ConfigGroups.OperationsOnDrop.Root.Model


init : String -> ( Model, Cmd Msg )
init slug =
    ( toExample slug, Cmd.none )



-- UPDATE


type Msg
    = OperationsOnDragMsg ConfigGroups.OperationsOnDrag.Root.Msg
    | OperationsOnDropMsg ConfigGroups.OperationsOnDrop.Root.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model ) of
        ( OperationsOnDragMsg msg, OperationsOnDrag mo ) ->
            stepOperationsOnDrag model (ConfigGroups.OperationsOnDrag.Root.update msg mo)

        ( OperationsOnDropMsg msg, OperationsOnDrop mo ) ->
            stepOperationsOnDrop model (ConfigGroups.OperationsOnDrop.Root.update msg mo)

        _ ->
            ( model, Cmd.none )


stepOperationsOnDrag : Model -> ( ConfigGroups.OperationsOnDrag.Root.Model, Cmd ConfigGroups.OperationsOnDrag.Root.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrag model ( mo, cmds ) =
    ( OperationsOnDrag mo, Cmd.map OperationsOnDragMsg cmds )


stepOperationsOnDrop : Model -> ( ConfigGroups.OperationsOnDrop.Root.Model, Cmd ConfigGroups.OperationsOnDrop.Root.Msg ) -> ( Model, Cmd Msg )
stepOperationsOnDrop model ( mo, cmds ) =
    ( OperationsOnDrop mo, Cmd.map OperationsOnDropMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        OperationsOnDrag mo ->
            Sub.map OperationsOnDragMsg (ConfigGroups.OperationsOnDrag.Root.subscriptions mo)

        OperationsOnDrop mo ->
            Sub.map OperationsOnDropMsg (ConfigGroups.OperationsOnDrop.Root.subscriptions mo)



-- VIEW


navigationView : String -> Html.Html Msg
navigationView currentPath =
    Html.div
        [ Html.Attributes.class "navigation" ]
        [ Html.h4 [] [ Html.text "DnDList.Groups" ]
        , [ OperationsOnDrag ConfigGroups.OperationsOnDrag.Root.initialModel
          , OperationsOnDrop ConfigGroups.OperationsOnDrop.Root.initialModel
          ]
            |> List.map (linkView currentPath)
            |> Html.ul []
        ]


linkView : String -> Example -> Html.Html Msg
linkView currentPath example =
    let
        path : String
        path =
            Url.Builder.absolute [ Base.base, "config-groups", (info >> .slug) example ] []
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
            Html.map OperationsOnDragMsg (ConfigGroups.OperationsOnDrag.Root.view mo)

        OperationsOnDrop mo ->
            Html.map OperationsOnDropMsg (ConfigGroups.OperationsOnDrop.Root.view mo)


codeView : Model -> Html.Html Msg
codeView model =
    case model of
        OperationsOnDrag mo ->
            toCode (ConfigGroups.OperationsOnDrag.Root.url mo.id)

        OperationsOnDrop mo ->
            toCode (ConfigGroups.OperationsOnDrop.Root.url mo.id)


toCode : String -> Html.Html msg
toCode url =
    CustomElement.elmCode [ CustomElement.href url ] []



-- EXAMPLE INFO


toExample : String -> Example
toExample slug =
    case slug of
        "operations-drag" ->
            OperationsOnDrag ConfigGroups.OperationsOnDrag.Root.initialModel

        "operations-drop" ->
            OperationsOnDrop ConfigGroups.OperationsOnDrop.Root.initialModel

        _ ->
            OperationsOnDrag ConfigGroups.OperationsOnDrag.Root.initialModel


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
            , description = "Compare the list operations without wings triggered on drag."
            }

        OperationsOnDrop _ ->
            { slug = "operations-drop"
            , title = "Operations on drop"
            , description = "Compare the list operations without wings triggered on drop."
            }
