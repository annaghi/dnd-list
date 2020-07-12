module Introduction.Parent exposing
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
import Html
import Introduction.Basic
import Introduction.BasicElmUI
import Introduction.Groups
import Introduction.Handle
import Introduction.Independents
import Introduction.Keyed
import Introduction.Margins
import Introduction.Masonry
import Introduction.Resize
import Views



-- WORKAROUND ENUM TYPE


defaultMeta : Views.Metadata Example
defaultMeta =
    { segment = "basic"
    , title = "Basic"
    , description = "Plain sortable list without any styling"
    , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Basic.elm"
    , initialModel = Basic Introduction.Basic.initialModel
    }


meta : List (Views.Metadata Example)
meta =
    [ defaultMeta
    , { segment = "basic-elm-ui"
      , title = "Basic + Elm UI"
      , description = "Designed with mdgriffith/elm-ui"
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/BasicElmUI.elm"
      , initialModel = BasicElmUI Introduction.BasicElmUI.initialModel
      }
    , { segment = "handle"
      , title = "Drag handle"
      , description = "Use a subelement as a drag handle."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Handle.elm"
      , initialModel = Handle Introduction.Handle.initialModel
      }
    , { segment = "keyed"
      , title = "Keyed nodes"
      , description = "Use Html.Keyed for optimized DOM updates."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Keyed.elm"
      , initialModel = Keyed Introduction.Keyed.initialModel
      }
    , { segment = "margins"
      , title = "Margins"
      , description = "Wrap elements in case top or left margins are needed."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Margins.elm"
      , initialModel = Margins Introduction.Margins.initialModel
      }
    , { segment = "masonry"
      , title = "Masonry"
      , description = "Simple horizontal masonry."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Masonry.elm"
      , initialModel = Masonry Introduction.Masonry.initialModel
      }
    , { segment = "resize"
      , title = "Resize"
      , description = "Put a drag handle to the top-left corner with resizable ghost element."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Resize.elm"
      , initialModel = Resize Introduction.Resize.initialModel
      }
    , { segment = "independents"
      , title = "Independent lists"
      , description = "Without thinking: duplicate everything."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Independents.elm"
      , initialModel = Independents Introduction.Independents.initialModel
      }
    , { segment = "groups"
      , title = "Groupable items"
      , description = "The list state invariant is that the list is gathered by the grouping property, and the auxiliary items preserve their places."
      , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/Introduction/Groups.elm"
      , initialModel = Groups Introduction.Groups.initialModel
      }
    ]


type Tag
    = BasicTag
    | BasicElmUITag
    | HandleTag
    | KeyedTag
    | MarginsTag
    | MasonryTag
    | ResizeTag
    | IndependentsTag
    | GroupsTag


allTags : List Tag
allTags =
    let
        ignored : Tag -> ()
        ignored tag =
            case tag of
                BasicTag ->
                    ()

                BasicElmUITag ->
                    ()

                HandleTag ->
                    ()

                KeyedTag ->
                    ()

                MarginsTag ->
                    ()

                MasonryTag ->
                    ()

                ResizeTag ->
                    ()

                IndependentsTag ->
                    ()

                GroupsTag ->
                    ()
    in
    [ BasicTag
    , BasicElmUITag
    , HandleTag
    , KeyedTag
    , MarginsTag
    , MasonryTag
    , ResizeTag
    , IndependentsTag
    , GroupsTag
    ]


exampleToTag : Example -> Tag
exampleToTag example =
    case example of
        Basic _ ->
            BasicTag

        BasicElmUI _ ->
            BasicElmUITag

        Handle _ ->
            HandleTag

        Keyed _ ->
            KeyedTag

        Margins _ ->
            MarginsTag

        Masonry _ ->
            MasonryTag

        Resize _ ->
            ResizeTag

        Independents _ ->
            IndependentsTag

        Groups _ ->
            GroupsTag


tagSegmentDict : AssocList.Dict Tag (Views.Metadata Example)
tagSegmentDict =
    List.map2 Tuple.pair allTags meta |> AssocList.fromList


tagToMetadata : Tag -> Views.Metadata Example
tagToMetadata tag =
    Maybe.withDefault defaultMeta <|
        case tag of
            BasicTag ->
                AssocList.get BasicTag tagSegmentDict

            BasicElmUITag ->
                AssocList.get BasicElmUITag tagSegmentDict

            HandleTag ->
                AssocList.get HandleTag tagSegmentDict

            KeyedTag ->
                AssocList.get KeyedTag tagSegmentDict

            MarginsTag ->
                AssocList.get MarginsTag tagSegmentDict

            MasonryTag ->
                AssocList.get MasonryTag tagSegmentDict

            ResizeTag ->
                AssocList.get ResizeTag tagSegmentDict

            IndependentsTag ->
                AssocList.get IndependentsTag tagSegmentDict

            GroupsTag ->
                AssocList.get GroupsTag tagSegmentDict



-- MODEL


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


init : String -> ( Example, Cmd Msg )
init segment =
    ( meta
        |> List.map (\m -> ( m.segment, m.initialModel ))
        |> Dict.fromList
        |> Dict.get segment
        |> Maybe.withDefault defaultMeta.initialModel
    , commands
    )



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


commands : Cmd Msg
commands =
    Cmd.map MasonryMsg Introduction.Masonry.commands


subscriptions : Example -> Sub Msg
subscriptions example =
    case example of
        Basic subModel ->
            Sub.map BasicMsg (Introduction.Basic.subscriptions subModel)

        BasicElmUI subModel ->
            Sub.map BasicElmUIMsg (Introduction.BasicElmUI.subscriptions subModel)

        Handle subModel ->
            Sub.map HandleMsg (Introduction.Handle.subscriptions subModel)

        Keyed subModel ->
            Sub.map KeyedMsg (Introduction.Keyed.subscriptions subModel)

        Margins subModel ->
            Sub.map MarginsMsg (Introduction.Margins.subscriptions subModel)

        Masonry subModel ->
            Sub.map MasonryMsg (Introduction.Masonry.subscriptions subModel)

        Resize subModel ->
            Sub.map ResizeMsg (Introduction.Resize.subscriptions subModel)

        Independents subModel ->
            Sub.map IndependentsMsg (Introduction.Independents.subscriptions subModel)

        Groups subModel ->
            Sub.map GroupsMsg (Introduction.Groups.subscriptions subModel)


update : Msg -> Example -> ( Example, Cmd Msg )
update msg example =
    case ( msg, example ) of
        ( BasicMsg subMsg, Basic subModel ) ->
            stepBasic (Introduction.Basic.update subMsg subModel)

        ( BasicElmUIMsg subMsg, BasicElmUI subModel ) ->
            stepBasicElmUI (Introduction.BasicElmUI.update subMsg subModel)

        ( HandleMsg subMsg, Handle subModel ) ->
            stepHandle (Introduction.Handle.update subMsg subModel)

        ( KeyedMsg subMsg, Keyed subModel ) ->
            stepKeyed (Introduction.Keyed.update subMsg subModel)

        ( MarginsMsg subMsg, Margins subModel ) ->
            stepMargins (Introduction.Margins.update subMsg subModel)

        ( MasonryMsg subMsg, Masonry subModel ) ->
            stepMasonry (Introduction.Masonry.update subMsg subModel)

        ( ResizeMsg subMsg, Resize subModel ) ->
            stepResize (Introduction.Resize.update subMsg subModel)

        ( IndependentsMsg subMsg, Independents subModel ) ->
            stepIndependents (Introduction.Independents.update subMsg subModel)

        ( GroupsMsg subMsg, Groups subModel ) ->
            stepGroups (Introduction.Groups.update subMsg subModel)

        _ ->
            ( example, Cmd.none )


stepBasic : ( Introduction.Basic.Model, Cmd Introduction.Basic.Msg ) -> ( Example, Cmd Msg )
stepBasic ( subModel, subCmd ) =
    ( Basic subModel, Cmd.map BasicMsg subCmd )


stepBasicElmUI : ( Introduction.BasicElmUI.Model, Cmd Introduction.BasicElmUI.Msg ) -> ( Example, Cmd Msg )
stepBasicElmUI ( subModel, subCmd ) =
    ( BasicElmUI subModel, Cmd.map BasicElmUIMsg subCmd )


stepHandle : ( Introduction.Handle.Model, Cmd Introduction.Handle.Msg ) -> ( Example, Cmd Msg )
stepHandle ( subModel, subCmd ) =
    ( Handle subModel, Cmd.map HandleMsg subCmd )


stepKeyed : ( Introduction.Keyed.Model, Cmd Introduction.Keyed.Msg ) -> ( Example, Cmd Msg )
stepKeyed ( subModel, subCmd ) =
    ( Keyed subModel, Cmd.map KeyedMsg subCmd )


stepMargins : ( Introduction.Margins.Model, Cmd Introduction.Margins.Msg ) -> ( Example, Cmd Msg )
stepMargins ( subModel, subCmd ) =
    ( Margins subModel, Cmd.map MarginsMsg subCmd )


stepMasonry : ( Introduction.Masonry.Model, Cmd Introduction.Masonry.Msg ) -> ( Example, Cmd Msg )
stepMasonry ( subModel, subCmd ) =
    ( Masonry subModel, Cmd.map MasonryMsg subCmd )


stepResize : ( Introduction.Resize.Model, Cmd Introduction.Resize.Msg ) -> ( Example, Cmd Msg )
stepResize ( subModel, subCmd ) =
    ( Resize subModel, Cmd.map ResizeMsg subCmd )


stepIndependents : ( Introduction.Independents.Model, Cmd Introduction.Independents.Msg ) -> ( Example, Cmd Msg )
stepIndependents ( subModel, subCmd ) =
    ( Independents subModel, Cmd.map IndependentsMsg subCmd )


stepGroups : ( Introduction.Groups.Model, Cmd Introduction.Groups.Msg ) -> ( Example, Cmd Msg )
stepGroups ( subModel, subCmd ) =
    ( Groups subModel, Cmd.map GroupsMsg subCmd )



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
        Basic subModel ->
            Html.map BasicMsg (Introduction.Basic.view subModel)

        BasicElmUI subModel ->
            Html.map BasicElmUIMsg (Introduction.BasicElmUI.view subModel)

        Handle subModel ->
            Html.map HandleMsg (Introduction.Handle.view subModel)

        Keyed subModel ->
            Html.map KeyedMsg (Introduction.Keyed.view subModel)

        Margins subModel ->
            Html.map MarginsMsg (Introduction.Margins.view subModel)

        Masonry subModel ->
            Html.map MasonryMsg (Introduction.Masonry.view subModel)

        Resize subModel ->
            Html.map ResizeMsg (Introduction.Resize.view subModel)

        Independents subModel ->
            Html.map IndependentsMsg (Introduction.Independents.view subModel)

        Groups subModel ->
            Html.map GroupsMsg (Introduction.Groups.view subModel)
    , CustomElement.elmCode
        [ CustomElement.href (example |> exampleToTag |> tagToMetadata |> (\m -> m.link)) ]
        []
    ]


chapterView : String -> Html.Html msg
chapterView class =
    Views.chapterView
        class
        { title = "Introduction"
        , slug = "introduction"
        , allTags = allTags |> List.map (tagToMetadata >> (\m -> { segment = m.segment, title = m.title }))
        }
