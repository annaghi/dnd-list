module DnDList.Groups.Parent exposing
    ( Example
    , Msg
    , chapterView
    , init
    , subscriptions
    , update
    , view
    )

import AssocList
import CustomElement
import Dict
import DnDList.Groups.HookCommands.Parent
import DnDList.Groups.OperationsOnDrag.Parent
import DnDList.Groups.OperationsOnDrop.Parent
import Html
import Views



-- WORKAROUND ENUM TYPE


defaultMeta : Views.Metadata Example
defaultMeta =
    { segment = "operations-drag"
    , title = "Operations on drag"
    , description = "Compare the list operations sorting on drag"
    , link = ""
    , initialModel = OperationsOnDrag DnDList.Groups.OperationsOnDrag.Parent.initialModel
    }


meta : List (Views.Metadata Example)
meta =
    [ defaultMeta
    , { segment = "operations-drop"
      , title = "Operations on drop"
      , description = "Compare the list operations sorting on drop"
      , link = ""
      , initialModel = OperationsOnDrop DnDList.Groups.OperationsOnDrop.Parent.initialModel
      }
    , { segment = "hook-commands"
      , title = "Hook commands"
      , description = "Compare detectDrop and detectReorder hooks"
      , link = ""
      , initialModel = HookCommands DnDList.Groups.HookCommands.Parent.initialModel
      }
    ]


type Tag
    = OperationsOnDragTag
    | OperationsOnDropTag
    | HookCommandsTag


allTags : List Tag
allTags =
    let
        ignored : Tag -> ()
        ignored tag =
            case tag of
                OperationsOnDragTag ->
                    ()

                OperationsOnDropTag ->
                    ()

                HookCommandsTag ->
                    ()
    in
    [ OperationsOnDragTag
    , OperationsOnDropTag
    , HookCommandsTag
    ]


exampleToTag : Example -> Tag
exampleToTag example =
    case example of
        OperationsOnDrag _ ->
            OperationsOnDragTag

        OperationsOnDrop _ ->
            OperationsOnDropTag

        HookCommands _ ->
            HookCommandsTag


tagSegmentDict : AssocList.Dict Tag (Views.Metadata Example)
tagSegmentDict =
    List.map2 Tuple.pair allTags meta |> AssocList.fromList


tagToMetadata : Tag -> Views.Metadata Example
tagToMetadata tag =
    Maybe.withDefault defaultMeta <|
        case tag of
            OperationsOnDragTag ->
                AssocList.get OperationsOnDragTag tagSegmentDict

            OperationsOnDropTag ->
                AssocList.get OperationsOnDropTag tagSegmentDict

            HookCommandsTag ->
                AssocList.get HookCommandsTag tagSegmentDict



-- MODEL


type Example
    = OperationsOnDrag DnDList.Groups.OperationsOnDrag.Parent.Model
    | OperationsOnDrop DnDList.Groups.OperationsOnDrop.Parent.Model
    | HookCommands DnDList.Groups.HookCommands.Parent.Model


init : String -> ( Example, Cmd Msg )
init segment =
    ( meta
        |> List.map (\m -> ( m.segment, m.initialModel ))
        |> Dict.fromList
        |> Dict.get segment
        |> Maybe.withDefault defaultMeta.initialModel
    , Cmd.none
    )



-- UPDATE


type Msg
    = OperationsOnDragMsg DnDList.Groups.OperationsOnDrag.Parent.Msg
    | OperationsOnDropMsg DnDList.Groups.OperationsOnDrop.Parent.Msg
    | HookCommandsMsg DnDList.Groups.HookCommands.Parent.Msg


subscriptions : Example -> Sub Msg
subscriptions model =
    case model of
        OperationsOnDrag subModel ->
            Sub.map OperationsOnDragMsg (DnDList.Groups.OperationsOnDrag.Parent.subscriptions subModel)

        OperationsOnDrop subModel ->
            Sub.map OperationsOnDropMsg (DnDList.Groups.OperationsOnDrop.Parent.subscriptions subModel)

        HookCommands subModel ->
            Sub.map HookCommandsMsg (DnDList.Groups.HookCommands.Parent.subscriptions subModel)


update : Msg -> Example -> ( Example, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( OperationsOnDragMsg subMsg, OperationsOnDrag subModel ) ->
            stepOperationsOnDrag (DnDList.Groups.OperationsOnDrag.Parent.update subMsg subModel)

        ( OperationsOnDropMsg subMsg, OperationsOnDrop subModel ) ->
            stepOperationsOnDrop (DnDList.Groups.OperationsOnDrop.Parent.update subMsg subModel)

        ( HookCommandsMsg subMsg, HookCommands subModel ) ->
            stepHookCommands (DnDList.Groups.HookCommands.Parent.update subMsg subModel)

        _ ->
            ( model, Cmd.none )


stepOperationsOnDrag : ( DnDList.Groups.OperationsOnDrag.Parent.Model, Cmd DnDList.Groups.OperationsOnDrag.Parent.Msg ) -> ( Example, Cmd Msg )
stepOperationsOnDrag ( subModel, subCmd ) =
    ( OperationsOnDrag subModel, Cmd.map OperationsOnDragMsg subCmd )


stepOperationsOnDrop : ( DnDList.Groups.OperationsOnDrop.Parent.Model, Cmd DnDList.Groups.OperationsOnDrop.Parent.Msg ) -> ( Example, Cmd Msg )
stepOperationsOnDrop ( subModel, subCmd ) =
    ( OperationsOnDrop subModel, Cmd.map OperationsOnDropMsg subCmd )


stepHookCommands : ( DnDList.Groups.HookCommands.Parent.Model, Cmd DnDList.Groups.HookCommands.Parent.Msg ) -> ( Example, Cmd Msg )
stepHookCommands ( subModel, subCmd ) =
    ( HookCommands subModel, Cmd.map HookCommandsMsg subCmd )



-- VIEW


view : Example -> List (Html.Html Msg)
view example =
    [ Views.demoHeaderView
        (example
            |> exampleToTag
            |> tagToMetadata
            |> (\m -> { title = m.title, description = m.description, link = m.link })
        )
    , case example of
        OperationsOnDrag subModel ->
            Html.map OperationsOnDragMsg (DnDList.Groups.OperationsOnDrag.Parent.view subModel)

        OperationsOnDrop subModel ->
            Html.map OperationsOnDropMsg (DnDList.Groups.OperationsOnDrop.Parent.view subModel)

        HookCommands subModel ->
            Html.map HookCommandsMsg (DnDList.Groups.HookCommands.Parent.view subModel)
    , CustomElement.elmCode
        [ CustomElement.href (example |> exampleToTag |> tagToMetadata |> (\m -> m.link)) ]
        []
    ]


chapterView : String -> Html.Html msg
chapterView class =
    Views.chapterView
        class
        { title = "DnDList.Groups"
        , slug = "groups"
        , allTags = allTags |> List.map (tagToMetadata >> (\m -> { segment = m.segment, title = m.title }))
        }
