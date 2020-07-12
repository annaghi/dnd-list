module DnDList.Single.Parent exposing
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
import DnDList.Single.HookCommands.Parent
import DnDList.Single.Movement.Parent
import DnDList.Single.OperationsOnDrag.Parent
import DnDList.Single.OperationsOnDrop.Parent
import DnDList.Single.Scroll.Parent
import Html
import Views



-- WORKAROUND ENUM TYPE


defaultMeta : Views.Metadata Example
defaultMeta =
    { segment = "operations-drag"
    , title = "Operations on drag"
    , description = "Compare the list operations sorting on drag"
    , link = ""
    , initialModel = OperationsOnDrag DnDList.Single.OperationsOnDrag.Parent.initialModel
    }


meta : List (Views.Metadata Example)
meta =
    [ defaultMeta
    , { segment = "operations-drop"
      , title = "Operations on drop"
      , description = "Compare the list operations sorting on drop"
      , link = ""
      , initialModel = OperationsOnDrop DnDList.Single.OperationsOnDrop.Parent.initialModel
      }
    , { segment = "hook-commands"
      , title = "Hook commands"
      , description = "Compare detectDrop and detectReorder hooks"
      , link = ""
      , initialModel = HookCommands DnDList.Single.HookCommands.Parent.initialModel
      }
    , { segment = "movement"
      , title = "Movement"
      , description = "The behavior of the Free, Horizontal only and Vertical only drag movements with Swap list operation"
      , link = ""
      , initialModel = Movement DnDList.Single.Movement.Parent.initialModel
      }
    , { segment = "scroll"
      , title = "Scroll"
      , description = "Customize scrollable containers and areas"
      , link = ""
      , initialModel = Scroll DnDList.Single.Scroll.Parent.initialModel
      }
    ]


type Tag
    = OperationsOnDragTag
    | OperationsOnDropTag
    | HookCommandsTag
    | MovementTag
    | ScrollTag


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

                MovementTag ->
                    ()

                ScrollTag ->
                    ()
    in
    [ OperationsOnDragTag
    , OperationsOnDropTag
    , HookCommandsTag
    , MovementTag
    , ScrollTag
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

        Movement _ ->
            MovementTag

        Scroll _ ->
            ScrollTag


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

            MovementTag ->
                AssocList.get MovementTag tagSegmentDict

            ScrollTag ->
                AssocList.get ScrollTag tagSegmentDict



-- MODEL


type Example
    = OperationsOnDrag DnDList.Single.OperationsOnDrag.Parent.Model
    | OperationsOnDrop DnDList.Single.OperationsOnDrop.Parent.Model
    | HookCommands DnDList.Single.HookCommands.Parent.Model
    | Movement DnDList.Single.Movement.Parent.Model
    | Scroll DnDList.Single.Scroll.Parent.Model


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
    = OperationsOnDragMsg DnDList.Single.OperationsOnDrag.Parent.Msg
    | OperationsOnDropMsg DnDList.Single.OperationsOnDrop.Parent.Msg
    | HookCommandsMsg DnDList.Single.HookCommands.Parent.Msg
    | MovementMsg DnDList.Single.Movement.Parent.Msg
    | ScrollMsg DnDList.Single.Scroll.Parent.Msg


subscriptions : Example -> Sub Msg
subscriptions model =
    case model of
        OperationsOnDrag subModel ->
            Sub.map OperationsOnDragMsg (DnDList.Single.OperationsOnDrag.Parent.subscriptions subModel)

        OperationsOnDrop subModel ->
            Sub.map OperationsOnDropMsg (DnDList.Single.OperationsOnDrop.Parent.subscriptions subModel)

        HookCommands subModel ->
            Sub.map HookCommandsMsg (DnDList.Single.HookCommands.Parent.subscriptions subModel)

        Movement subModel ->
            Sub.map MovementMsg (DnDList.Single.Movement.Parent.subscriptions subModel)

        Scroll subModel ->
            Sub.map ScrollMsg (DnDList.Single.Scroll.Parent.subscriptions subModel)


update : Msg -> Example -> ( Example, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( OperationsOnDragMsg subMsg, OperationsOnDrag subModel ) ->
            stepOperationsOnDrag (DnDList.Single.OperationsOnDrag.Parent.update subMsg subModel)

        ( OperationsOnDropMsg subMsg, OperationsOnDrop subModel ) ->
            stepOperationsOnDrop (DnDList.Single.OperationsOnDrop.Parent.update subMsg subModel)

        ( HookCommandsMsg subMsg, HookCommands subModel ) ->
            stepHookCommands (DnDList.Single.HookCommands.Parent.update subMsg subModel)

        ( MovementMsg subMsg, Movement subModel ) ->
            stepMovement (DnDList.Single.Movement.Parent.update subMsg subModel)

        ( ScrollMsg subMsg, Scroll subModel ) ->
            stepScroll (DnDList.Single.Scroll.Parent.update subMsg subModel)

        _ ->
            ( model, Cmd.none )


stepOperationsOnDrag : ( DnDList.Single.OperationsOnDrag.Parent.Model, Cmd DnDList.Single.OperationsOnDrag.Parent.Msg ) -> ( Example, Cmd Msg )
stepOperationsOnDrag ( subModel, subCmd ) =
    ( OperationsOnDrag subModel, Cmd.map OperationsOnDragMsg subCmd )


stepOperationsOnDrop : ( DnDList.Single.OperationsOnDrop.Parent.Model, Cmd DnDList.Single.OperationsOnDrop.Parent.Msg ) -> ( Example, Cmd Msg )
stepOperationsOnDrop ( subModel, subCmd ) =
    ( OperationsOnDrop subModel, Cmd.map OperationsOnDropMsg subCmd )


stepHookCommands : ( DnDList.Single.HookCommands.Parent.Model, Cmd DnDList.Single.HookCommands.Parent.Msg ) -> ( Example, Cmd Msg )
stepHookCommands ( subModel, subCmd ) =
    ( HookCommands subModel, Cmd.map HookCommandsMsg subCmd )


stepMovement : ( DnDList.Single.Movement.Parent.Model, Cmd DnDList.Single.Movement.Parent.Msg ) -> ( Example, Cmd Msg )
stepMovement ( subModel, subCmd ) =
    ( Movement subModel, Cmd.map MovementMsg subCmd )


stepScroll : ( DnDList.Single.Scroll.Parent.Model, Cmd DnDList.Single.Scroll.Parent.Msg ) -> ( Example, Cmd Msg )
stepScroll ( subModel, subCmd ) =
    ( Scroll subModel, Cmd.map ScrollMsg subCmd )



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
            Html.map OperationsOnDragMsg (DnDList.Single.OperationsOnDrag.Parent.view subModel)

        OperationsOnDrop subModel ->
            Html.map OperationsOnDropMsg (DnDList.Single.OperationsOnDrop.Parent.view subModel)

        HookCommands subModel ->
            Html.map HookCommandsMsg (DnDList.Single.HookCommands.Parent.view subModel)

        Movement subModel ->
            Html.map MovementMsg (DnDList.Single.Movement.Parent.view subModel)

        Scroll subModel ->
            Html.map ScrollMsg (DnDList.Single.Scroll.Parent.view subModel)
    , CustomElement.elmCode
        [ CustomElement.href (example |> exampleToTag |> tagToMetadata |> (\m -> m.link)) ]
        []
    ]


chapterView : String -> Html.Html msg
chapterView class =
    Views.chapterView
        class
        { title = "DnDList.Single"
        , slug = "single"
        , allTags = allTags |> List.map (tagToMetadata >> (\m -> { segment = m.segment, title = m.title }))
        }
