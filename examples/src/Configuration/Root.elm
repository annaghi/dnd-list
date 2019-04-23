module Configuration.Root exposing
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
import Configuration.Groups.Root
import Configuration.Movement.Root
import Configuration.OperationOnDrag.Root
import Configuration.OperationOnDrop.Root
import CustomElement
import Html
import Html.Attributes
import Url.Builder



-- MODEL


type alias Model =
    { slug : String
    , example : Example
    }


type Example
    = OperationOnDrag Configuration.OperationOnDrag.Root.Model
    | OperationOnDrop Configuration.OperationOnDrop.Root.Model
    | Movement Configuration.Movement.Root.Model
    | Groups Configuration.Groups.Root.Model


init : String -> ( Model, Cmd Msg )
init slug =
    ( { slug = slug, example = selectExample slug }, Cmd.none )


selectExample : String -> Example
selectExample slug =
    case slug of
        "operations-drag" ->
            OperationOnDrag Configuration.OperationOnDrag.Root.initialModel

        "operations-drop" ->
            OperationOnDrop Configuration.OperationOnDrop.Root.initialModel

        "movement" ->
            Movement Configuration.Movement.Root.initialModel

        "groups" ->
            Groups Configuration.Groups.Root.initialModel

        _ ->
            OperationOnDrag Configuration.OperationOnDrag.Root.initialModel



-- UPDATE


type Msg
    = OperationOnDragMsg Configuration.OperationOnDrag.Root.Msg
    | OperationOnDropMsg Configuration.OperationOnDrop.Root.Msg
    | MovementMsg Configuration.Movement.Root.Msg
    | GroupsMsg Configuration.Groups.Root.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model.example ) of
        ( OperationOnDragMsg msg, OperationOnDrag mo ) ->
            stepOperationOnDrag model (Configuration.OperationOnDrag.Root.update msg mo)

        ( OperationOnDropMsg msg, OperationOnDrop mo ) ->
            stepOperationOnDrop model (Configuration.OperationOnDrop.Root.update msg mo)

        ( MovementMsg msg, Movement mo ) ->
            stepMovement model (Configuration.Movement.Root.update msg mo)

        ( GroupsMsg msg, Groups mo ) ->
            stepGroups model (Configuration.Groups.Root.update msg mo)

        _ ->
            ( model, Cmd.none )


stepOperationOnDrag : Model -> ( Configuration.OperationOnDrag.Root.Model, Cmd Configuration.OperationOnDrag.Root.Msg ) -> ( Model, Cmd Msg )
stepOperationOnDrag model ( mo, cmds ) =
    ( { model | example = OperationOnDrag mo }, Cmd.map OperationOnDragMsg cmds )


stepOperationOnDrop : Model -> ( Configuration.OperationOnDrop.Root.Model, Cmd Configuration.OperationOnDrop.Root.Msg ) -> ( Model, Cmd Msg )
stepOperationOnDrop model ( mo, cmds ) =
    ( { model | example = OperationOnDrop mo }, Cmd.map OperationOnDropMsg cmds )


stepMovement : Model -> ( Configuration.Movement.Root.Model, Cmd Configuration.Movement.Root.Msg ) -> ( Model, Cmd Msg )
stepMovement model ( mo, cmds ) =
    ( { model | example = Movement mo }, Cmd.map MovementMsg cmds )


stepGroups : Model -> ( Configuration.Groups.Root.Model, Cmd Configuration.Groups.Root.Msg ) -> ( Model, Cmd Msg )
stepGroups model ( mo, cmds ) =
    ( { model | example = Groups mo }, Cmd.map GroupsMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.example of
        OperationOnDrag mo ->
            Sub.map OperationOnDragMsg (Configuration.OperationOnDrag.Root.subscriptions mo)

        OperationOnDrop mo ->
            Sub.map OperationOnDropMsg (Configuration.OperationOnDrop.Root.subscriptions mo)

        Movement mo ->
            Sub.map MovementMsg (Configuration.Movement.Root.subscriptions mo)

        Groups mo ->
            Sub.map GroupsMsg (Configuration.Groups.Root.subscriptions mo)



-- VIEW


navigationView : Html.Html Msg
navigationView =
    Html.div
        [ Html.Attributes.class "navigation" ]
        [ Html.h4 [] [ Html.text "Configuration" ]
        , [ OperationOnDrag Configuration.OperationOnDrag.Root.initialModel
          , OperationOnDrop Configuration.OperationOnDrop.Root.initialModel
          , Movement Configuration.Movement.Root.initialModel
          , Groups Configuration.Groups.Root.initialModel
          ]
            |> List.map linkView
            |> Html.ul []
        ]


linkView : Example -> Html.Html Msg
linkView example =
    let
        path : String
        path =
            Url.Builder.absolute [ Base.base, "configuration", (info >> .slug) example ] []
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
        OperationOnDrag mo ->
            Html.map OperationOnDragMsg (Configuration.OperationOnDrag.Root.view mo)

        OperationOnDrop mo ->
            Html.map OperationOnDropMsg (Configuration.OperationOnDrop.Root.view mo)

        Movement mo ->
            Html.map MovementMsg (Configuration.Movement.Root.view mo)

        Groups mo ->
            Html.map GroupsMsg (Configuration.Groups.Root.view mo)


codeView : Model -> Html.Html Msg
codeView model =
    case model.example of
        OperationOnDrag mo ->
            toCode (Configuration.OperationOnDrag.Root.url mo.id)

        OperationOnDrop mo ->
            toCode (Configuration.OperationOnDrop.Root.url mo.id)

        Movement mo ->
            toCode (Configuration.Movement.Root.url mo.id)

        Groups mo ->
            toCode (Configuration.Groups.Root.url mo.id)


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
        OperationOnDrag _ ->
            { slug = "operations-drag"
            , title = "Operations on Drag"
            , description = "The behavior of the different operations applied on lists while dragging."
            }

        OperationOnDrop _ ->
            { slug = "operations-drop"
            , title = "Operations on Drop"
            , description = "The behavior of the different operations applied on lists on drop."
            }

        Movement _ ->
            { slug = "movement"
            , title = "Movement with Swap"
            , description = "The behavior of the Free, Horizontal and Vertical only drag movement with Swap list operation."
            }

        Groups _ ->
            { slug = "groups"
            , title = "Groups"
            , description = "The list state invariant is that the list has to be gathered by the grouping property, and the auxiliary items have to preserve their places."
            }
