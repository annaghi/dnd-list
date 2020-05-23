module DnDList.Groups exposing
    ( Config, config
    , Listen(..), Operation(..)
    , hookItemsBeforeListUpdate, ghostProperties
    , System, create, Msg
    , Model
    , Info
    )

{-| If the list is groupable by a certain property, the items can be transferred between those groups.
Instead of using drop zones, this module requires the list to be gathered by the grouping property
and possibly prepared with auxiliary items.
Here is a [demo with groups](https://annaghi.github.io/dnd-list/introduction/groups),
we will use it as an illustration throughout this page.

This module is a modified version of the `DnDList` module.
The `Config` was extended with a new field called `groups`, and the `movement` field was withdrawn.

With groupable items the drag source and the drop target items can belong to the _same group_ or to _different groups_.
So now the internal sorting distinguishes between these two cases and we need to configure:

  - what operation to run when moving items within the same group, and
  - what operation to run when transferring items between different groups.

&nbsp;


## Meaningful type aliases

    type alias DragIndex =
        Int

    type alias DropIndex =
        Int

    type alias DragElementId =
        String

    type alias DropElementId =
        String

    type alias Position =
        { x : Float
        , y : Float
        }


# Config

@docs Config, config
@docs Listen, Operation
@docs hookItemsBeforeListUpdate, ghostProperties


# System

@docs System, create, Msg


## Model

@docs Model


# Info

@docs Info


# System fields


## subscriptions

`subscriptions` is a function to access the browser events during the dragging.

    subscriptions : Model -> Sub Msg
    subscriptions model =
        system.subscriptions model.dnd


## commands

`commands` is a function to access the DOM for the drag source and the drop target as HTML elements.

    update : Msg -> Model -> ( Model, Cmd Msg )
    update message model =
        case message of
            MyMsg msg ->
                let
                    updatedModel = ...
                in
                ( updatedModel
                , system.commands updatedModel
                )


## update

`update` is a function which returns an updated internal `Model` and the sorted list for your model.

    update : Msg -> Model -> ( Model, Cmd Msg )
    update message model =
        case message of
            MyMsg msg ->
                let
                    ( dnd, items ) =
                        system.update msg model.dnd model.items
                in
                ( { model | dnd = dnd, items = items }
                , system.commands dnd
                )


## dragEvents

`dragEvents` is a function which wraps all the events up for the drag source items.

This and the following example will show us how to use auxiliary items and think about them in two different ways:

  - as ordinary list items from the list operation point of view, and
  - as specially styled elements from the HTML design point of view.

```
itemView : Model -> Int -> Int -> Item -> Html.Html Msg
itemView model offset localIndex { group, value, color } =
    let
        globalIndex : Int
        globalIndex =
            offset + localIndex

        itemId : String
        itemId =
            "id-" ++ String.fromInt globalIndex
    in
    case ( system.info model.dnd, maybeDragItem model.dnd model.items ) of
        ( Just _, Just _ ) ->
            -- Render when there is an ongoing dragging.

        _ ->
            if color == transparent && value == "footer" then
                Html.div
                    (Html.Attributes.id itemId
                        :: auxiliaryStyles
                    )
                    []

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles color
                        ++ system.dragEvents globalIndex itemId
                    )
                    [ Html.text value ]
```


## dropEvents

`dropEvents` is a function which wraps all the events up for the drop target items.

    itemView : Model -> Int -> Int -> Item -> Html.Html Msg
    itemView model offset localIndex { group, value, color } =
        let
            globalIndex : Int
            globalIndex =
                offset + localIndex

            itemId : String
            itemId =
                "id-" ++ String.fromInt globalIndex
        in
        case ( system.info model.dnd, maybeDragItem model.dnd model.items ) of
            ( Just { dragIndex }, Just dragItem ) ->
                if color == transparent && value == "footer" && dragItem.group /= group then
                    Html.div
                        (Html.Attributes.id itemId
                            :: auxiliaryStyles
                            ++ system.dropEvents globalIndex itemId
                        )
                        []

                else if color == transparent && value == "footer" && dragItem.group == group then
                    Html.div
                        (Html.Attributes.id itemId
                            :: auxiliaryStyles
                        )
                        []

                else if dragIndex /= globalIndex then
                    Html.div
                        (Html.Attributes.id itemId
                            :: itemStyles color
                            ++ system.dropEvents globalIndex itemId
                        )
                        [ Html.text value ]

                else
                    Html.div
                        (Html.Attributes.id itemId
                            :: itemStyles gray
                        )
                        []

            _ ->
                -- Render when there is no dragging.


## ghostStyles

`ghostStyles` is a function which wraps up the positioning styles of the ghost element.
The ghost element has absolute position relative to the viewport.

    ghostView : DnDList.Groups.Model -> List Item -> Html.Html Msg
    ghostView dnd items =
        case maybeDragItem dnd items of
            Just { value, color } ->
                Html.div
                    (itemStyles color ++ system.ghostStyles dnd)
                    [ Html.text value ]

            Nothing ->
                Html.text ""

The following CSS will be added:

    {
        position: fixed;
        left: 0;
        top: 0;
        transform: translate3d(the vector is calculated from the dragElement and the mouse position in pixels);
        height: the dragElement's height in pixels;
        width: the dragElement's width in pixels;
        pointer-events: none;
    }


## info

See [Info](#info).

-}

import Browser.Dom
import Browser.Events
import Html
import Html.Attributes
import Html.Events
import Internal.Decoders
import Internal.Ghost
import Internal.Groups
import Internal.Operations
import Internal.Types exposing (..)
import Json.Decode
import Task


{-| Represents the `System`'s configuration.

  - `beforeUpdate`: This is a hook and gives you access to your list before it will be sorted.
    The first number is the drag index, the second number is the drop index.
    The [Towers of Hanoi](https://annaghi.github.io/dnd-list/gallery/hanoi) uses this hook to update the disks' `tower` property.

  - `listen`: This setting is for the operation performing on the _same group_.
    The items can listen for drag events or for drop events.
    In the first case the list will be sorted again and again while the mouse moves over the different drop target items.
    In the second case the list will be sorted only once on that drop target where the mouse was finally released.

  - `operation`: This setting is for the operation performing on the _same group_.
    Different kinds of sort operations can be performed on the list.
    You can start to analyze them with
    [sorting on drag](https://annaghi.github.io/dnd-list/config/operations-drag)
    and [sorting on drop](https://annaghi.github.io/dnd-list/config/operations-drop).

  - `groups`: This setting is for the operation performing on _different groups_,
    when the drag source and the drop target belong to different groups.
    To have a better understanding of how this works
    see [sorting between groups on drag](https://annaghi.github.io/dnd-list/config-groups/operations-drag)
    and [sorting between groups on drop](https://annaghi.github.io/dnd-list/config-groups/operations-drop).
      - `listen`: Same as the plain `listen` but applied when transferring items between groups.
      - `operation`: Same as the plain `operation` but applied when transferring items between groups.
      - `comparator`: You should provide this function, which determines if two items are from different groups.
      - `setter`: You should provide this function, which updates the second item's group by the first item's group.

This is our configuration with a void `beforeUpdate`:

    config : DnDList.Groups.Config Item
    config =
        { beforeUpdate = \_ _ list -> list
        , listen = DnDList.Groups.OnDrag
        , operation = DnDList.Groups.Rotate
        , groups =
            { listen = DnDList.Groups.OnDrag
            , operation = DnDList.Groups.InsertBefore
            , comparator = comparator
            , setter = setter
            }
        }

    comparator : Item -> Item -> Bool
    comparator item1 item2 =
        item1.group == item2.group

    setter : Item -> Item -> Item
    setter item1 item2 =
        { item2 | group = item1.group }

-}
type Config item
    = Config (Settings item) (Options item)


type alias Settings item =
    { listen : Listen
    , operation : Operation
    , groups :
        { listen : Listen
        , operation : Operation
        , comparator : item -> item -> Bool
        , setter : item -> item -> item
        }
    }


type alias Options item =
    { customGhostProperties : List String
    , hookItemsBeforeListUpdate : DragIndex -> DropIndex -> List item -> List item
    }


config : Settings item -> Config item
config settings =
    Config settings defaultOptions


defaultOptions : Options item
defaultOptions =
    { customGhostProperties = [ "width", "height", "position" ]
    , hookItemsBeforeListUpdate = \_ _ list -> list
    }


{-| Represents the event for which the list sorting is available.

  - `OnDrag`: The list will be sorted when the ghost element is being dragged over a drop target item.

  - `OnDrop`: The list will be sorted when the ghost element is dropped on a drop target item.

-}
type Listen
    = OnDrag
    | OnDrop


{-| Represents the list sort operation.
Detailed comparisons can be found here:
[sorting on drag](https://annaghi.github.io/dnd-list/config/operations-drag)
and [sorting on drop](https://annaghi.github.io/dnd-list/config/operations-drop).

  - `InsertAfter`: The drag source item will be inserted after the drop target item.

  - `InsertBefore`: The drag source item will be inserted before the drop target item.

  - `Rotate`: The items between the drag source and the drop target items will be circularly shifted.

  - `Swap`: The drag source and the drop target items will be swapped.

  - `Unaltered`: The list items will keep their initial order.

-}
type Operation
    = InsertAfter
    | InsertBefore
    | Rotate
    | Swap
    | Unaltered



-- Options


ghostProperties : List String -> Config item -> Config item
ghostProperties properties (Config settings options) =
    Config settings { options | customGhostProperties = properties }


hookItemsBeforeListUpdate : (DragIndex -> DropIndex -> List item -> List item) -> Config item -> Config item
hookItemsBeforeListUpdate hook (Config settings options) =
    Config settings { options | hookItemsBeforeListUpdate = hook }


{-| A `System` encapsulates:

  - the internal model, subscriptions, commands, and update,

  - the bindable events and styles, and

  - the `Info` object.

Later we will learn more about the [Info object](#info) and the [System fields](#system-fields).

-}
type alias System item msg =
    { model : Model
    , subscriptions : Model -> Sub msg
    , update : List item -> Msg -> Model -> ( List item, Model, Cmd msg )
    , dragEvents : DragIndex -> DragElementId -> List (Html.Attribute msg)
    , dropEvents : DropIndex -> DropElementId -> List (Html.Attribute msg)
    , ghostStyles : Model -> List (Html.Attribute msg)
    , info : Model -> Maybe Info
    }


{-| Creates a `System` object according to the configuration.

Suppose we have two groups:

    type Group
        = Left
        | Right

and a list which is gathered by these groups and prepared with auxiliary items:

    type alias Item =
        { group : Group
        , value : String
        , color : String
        }

    preparedData : List Item
    preparedData =
        [ Item Left "C" blue
        , Item Left "2" red
        , Item Left "A" blue
        , Item Left "footer" transparent
        , Item Right "3" red
        , Item Right "1" red
        , Item Right "B" blue
        , Item Right "footer" transparent
        ]

The auxiliary items separate the groups and they can be considered as header or footer of a particular group.
In this case they are footers.

The sort operations were designed with the following list state invariant in mind:

  - the items are gathered by the grouping property, and
  - the auxiliary items keep their places (headers, footers).

And now the `System` is a wrapper type around the list item and our message types:

    system : DnDList.Groups.System Item Msg
    system =
        DnDList.Groups.create config MyMsg

-}
create : (Msg -> msg) -> Config item -> System item msg
create toMsg configuration =
    { model = Model Nothing
    , subscriptions = subscriptions toMsg
    , update = update configuration toMsg
    , dragEvents = dragEvents toMsg
    , dropEvents = dropEvents toMsg
    , ghostStyles = ghostStyles configuration
    , info = info
    }


{-| Represents the internal model of the current drag and drop features.
It will be `Nothing` if there is no ongoing dragging.
You should set it in your model and initialize through the `System`'s `model` field.

    type alias Model =
        { dnd : DnDList.Groups.Model
        , items : List Item
        }

    initialModel : Model
    initialModel =
        { dnd = system.model
        , items = preparedData
        }

-}
type Model
    = Model (Maybe State)


type alias State =
    { dragIndex : DragIndex
    , dropIndex : DropIndex
    , moveCounter : Int
    , startPosition : Coordinates
    , currentPosition : Coordinates
    , translateVector : Coordinates
    , dragElementId : DragElementId
    , dropElementId : DropElementId
    , dragElement : Maybe Browser.Dom.Element
    , dropElement : Maybe Browser.Dom.Element
    }


{-| Represents the information about the drag source and the drop target items.
It is accessible through the `System`'s `info` field.

  - `dragIndex`: The index of the drag source.

  - `dropIndex`: The index of the drop target.

  - `dragElementId`: HTML id of the drag source.

  - `dropElementId`: HTML id of the drop target.

  - `dragElement`: Information about the drag source as an HTML element, see `Browser.Dom.Element`.

  - `dropElement`: Information about the drop target as an HTML element, see `Browser.Dom.Element`.

  - `startPosition`: The x, y position of the ghost element when dragging started.

  - `currentPosition`: The x, y position of the ghost element now.

You can check the `Info` object to decide what to render when there is an ongoing dragging,
and what to render when there is no dragging:

    itemView : Model -> ... -> Html.Html Msg
    itemView model ... =
        ...
        case system.info model.dnd of
            Just _ ->
                -- Render when there is an ongoing dragging.

            Nothing ->
                -- Render when there is no dragging.

Or you can determine the current drag source item using the `Info` object:

    maybeDragItem : DnDList.Groups.Model -> List Item -> Maybe Item
    maybeDragItem dnd items =
        system.info dnd
            |> Maybe.andThen
                (\{ dragIndex } ->
                    items
                        |> List.drop dragIndex
                        |> List.head
                )

Or you can control over generating styles for the dragged ghost element.
For example adding an offset to the position:

    type alias Offset =
        { x : Int
        , y : Int
        }

    customGhostStyle : DnDList.Model -> DnDList.Info -> Offset -> List (Html.Attribute msg)
    customGhostStyle dnd { element } offset =
        let
            px : Int -> String
            px x =
                String.fromInt x ++ "px"

            translate : Int -> Int -> String
            translate x y =
                "translate3d(" ++ px x ++ ", " ++ px y ++ ", 0)"
        in
        case system.info dnd of
            Just { currentPosition, startPosition } ->
                [ Html.Attribute.style "transform" <|
                    translate
                        (round element.x + offset.x)
                        (round (currentPosition.y - startPosition.y + element.y) + offset.y)
                ]

            Nothing ->
                []

-}
type alias Info =
    { dragIndex : DragIndex
    , dropIndex : DropIndex
    , dragElementId : DragElementId
    , dropElementId : DropElementId
    , dragElement : Browser.Dom.Element
    , dropElement : Browser.Dom.Element
    , startPosition : Coordinates
    , currentPosition : Coordinates
    }


info : Model -> Maybe Info
info (Model model) =
    Maybe.andThen
        (\state ->
            Maybe.map2
                (\dragElement dropElement ->
                    { dragIndex = state.dragIndex
                    , dropIndex = state.dropIndex
                    , dragElementId = state.dragElementId
                    , dropElementId = state.dropElementId
                    , dragElement = dragElement
                    , dropElement = dropElement
                    , startPosition = state.startPosition
                    , currentPosition = state.currentPosition
                    }
                )
                state.dragElement
                state.dropElement
        )
        model


{-| Internal message type.
It should be wrapped within our message constructor:

    type Msg
        = MyMsg DnDList.Groups.Msg

-}
type Msg
    = DownDragItem DragIndex DragElementId Coordinates
    | InBetweenMsg InBetweenMsg
    | UpDocument


type InBetweenMsg
    = MoveDocument Coordinates
    | OverDropItem DropIndex DropElementId
    | EnterDropItem
    | LeaveDropItem
    | GotDragItem (Result Browser.Dom.Error Browser.Dom.Element)
    | GotDropItem (Result Browser.Dom.Error Browser.Dom.Element)
    | Tick


subscriptions : (Msg -> msg) -> Model -> Sub msg
subscriptions toMsg (Model model) =
    if model /= Nothing then
        Sub.batch
            [ Browser.Events.onMouseMove
                (Internal.Decoders.decodeCoordinates |> Json.Decode.map (MoveDocument >> InBetweenMsg >> toMsg))
            , Browser.Events.onMouseUp
                (Json.Decode.succeed (UpDocument |> toMsg))
            , Browser.Events.onAnimationFrameDelta (always Tick >> InBetweenMsg >> toMsg)
            ]

    else
        Sub.none


update : Config item -> (Msg -> msg) -> List item -> Msg -> Model -> ( List item, Model, Cmd msg )
update (Config settings options) toMsg list msg (Model model) =
    case msg of
        DownDragItem dragIndex dragElementId xy ->
            ( list
            , Model <|
                Just
                    { dragIndex = dragIndex
                    , dropIndex = dragIndex
                    , moveCounter = 0
                    , startPosition = xy
                    , currentPosition = xy
                    , translateVector = Coordinates 0 0
                    , dragElementId = dragElementId
                    , dropElementId = dragElementId
                    , dragElement = Nothing
                    , dropElement = Nothing
                    }
            , Cmd.none
            )

        InBetweenMsg inBetweenMsg ->
            case model of
                Just state ->
                    let
                        ( newList, newState, newCmd ) =
                            inBetweenUpdate settings options list inBetweenMsg state
                    in
                    ( newList, Model (Just newState), Cmd.map (InBetweenMsg >> toMsg) newCmd )

                Nothing ->
                    ( list, Model Nothing, Cmd.none )

        UpDocument ->
            case model of
                Just state ->
                    if state.dragIndex /= state.dropIndex then
                        let
                            equalGroups : Bool
                            equalGroups =
                                Internal.Groups.equalGroups settings.groups.comparator state.dragIndex state.dropIndex list
                        in
                        if settings.listen == OnDrop && equalGroups then
                            ( list
                                |> options.hookItemsBeforeListUpdate state.dragIndex state.dropIndex
                                |> groupUpdate settings.operation state.dragIndex state.dropIndex
                            , Model Nothing
                            , Cmd.none
                            )

                        else if settings.groups.listen == OnDrop && not equalGroups then
                            ( list
                                |> options.hookItemsBeforeListUpdate state.dragIndex state.dropIndex
                                |> listUpdate settings.groups.operation settings.groups.comparator settings.groups.setter state.dragIndex state.dropIndex
                            , Model Nothing
                            , Cmd.none
                            )

                        else
                            ( list, Model Nothing, Cmd.none )

                    else
                        ( list, Model Nothing, Cmd.none )

                _ ->
                    ( list, Model Nothing, Cmd.none )


inBetweenUpdate : Settings item -> Options item -> List item -> InBetweenMsg -> State -> ( List item, State, Cmd InBetweenMsg )
inBetweenUpdate settings options list msg state =
    case msg of
        MoveDocument xy ->
            ( list
            , { state | currentPosition = xy, moveCounter = state.moveCounter + 1 }
            , if state.dragElement == Nothing then
                Task.attempt GotDragItem (Browser.Dom.getElement state.dragElementId)

              else
                Cmd.none
            )

        OverDropItem dropIndex dropElementId ->
            ( list
            , { state | dropIndex = dropIndex, dropElementId = dropElementId }
            , Task.attempt GotDropItem (Browser.Dom.getElement dropElementId)
            )

        EnterDropItem ->
            if state.moveCounter > 1 && state.dragIndex /= state.dropIndex then
                let
                    equalGroups : Bool
                    equalGroups =
                        Internal.Groups.equalGroups settings.groups.comparator state.dragIndex state.dropIndex list
                in
                if settings.listen == OnDrag && equalGroups then
                    ( list
                        |> options.hookItemsBeforeListUpdate state.dragIndex state.dropIndex
                        |> groupUpdate settings.operation state.dragIndex state.dropIndex
                    , stateUpdate settings.operation state.dropIndex state
                    , Cmd.none
                    )

                else if settings.groups.listen == OnDrag && not equalGroups then
                    ( list
                        |> options.hookItemsBeforeListUpdate state.dragIndex state.dropIndex
                        |> listUpdate settings.groups.operation settings.groups.comparator settings.groups.setter state.dragIndex state.dropIndex
                    , stateUpdate settings.groups.operation state.dropIndex state
                    , Cmd.none
                    )

                else
                    ( list, { state | moveCounter = 0 }, Cmd.none )

            else
                ( list, state, Cmd.none )

        LeaveDropItem ->
            ( list
            , { state | dropIndex = state.dragIndex }
            , Cmd.none
            )

        GotDragItem (Err _) ->
            ( list, state, Cmd.none )

        GotDragItem (Ok dragElement) ->
            ( list
            , { state | dragElement = Just dragElement, dropElement = Just dragElement }
            , Cmd.none
            )

        GotDropItem (Err _) ->
            ( list, state, Cmd.none )

        GotDropItem (Ok dropElement) ->
            ( list
            , { state | dropElement = Just dropElement }
            , Cmd.none
            )

        Tick ->
            ( list
            , { state
                | translateVector =
                    Coordinates
                        (state.currentPosition.x - state.startPosition.x)
                        (state.currentPosition.y - state.startPosition.y)
              }
            , Cmd.none
            )


stateUpdate : Operation -> DropIndex -> State -> State
stateUpdate operation dropIndex state =
    case operation of
        InsertAfter ->
            { state
                | dragIndex =
                    if dropIndex < state.dragIndex then
                        dropIndex + 1

                    else
                        dropIndex
                , moveCounter = 0
            }

        InsertBefore ->
            { state
                | dragIndex =
                    if state.dragIndex < dropIndex then
                        dropIndex - 1

                    else
                        dropIndex
                , moveCounter = 0
            }

        Rotate ->
            { state | dragIndex = dropIndex, moveCounter = 0 }

        Swap ->
            { state | dragIndex = dropIndex, moveCounter = 0 }

        Unaltered ->
            { state | moveCounter = 0 }


groupUpdate : Operation -> DragIndex -> DropIndex -> List item -> List item
groupUpdate operation dragIndex dropIndex list =
    case operation of
        InsertAfter ->
            Internal.Operations.insertAfter dragIndex dropIndex list

        InsertBefore ->
            Internal.Operations.insertBefore dragIndex dropIndex list

        Rotate ->
            Internal.Operations.rotate dragIndex dropIndex list

        Swap ->
            Internal.Operations.swap dragIndex dropIndex list

        Unaltered ->
            list


listUpdate : Operation -> (item -> item -> Bool) -> (item -> item -> item) -> DragIndex -> DropIndex -> List item -> List item
listUpdate operation comparator setter dragIndex dropIndex list =
    case operation of
        InsertAfter ->
            list
                |> Internal.Groups.dragGroupUpdate setter dragIndex dropIndex
                |> Internal.Operations.insertAfter dragIndex dropIndex

        InsertBefore ->
            list
                |> Internal.Groups.dragGroupUpdate setter dragIndex dropIndex
                |> Internal.Operations.insertBefore dragIndex dropIndex

        Rotate ->
            if dragIndex < dropIndex then
                list
                    |> Internal.Groups.allGroupUpdate (List.reverse >> Internal.Groups.bubbleGroupRecursive comparator setter >> List.reverse) dragIndex dropIndex
                    |> Internal.Operations.rotate dragIndex dropIndex

            else if dropIndex < dragIndex then
                list
                    |> Internal.Groups.allGroupUpdate (Internal.Groups.bubbleGroupRecursive comparator setter) dropIndex dragIndex
                    |> Internal.Operations.rotate dragIndex dropIndex

            else
                list

        Swap ->
            list
                |> Internal.Groups.dragAndDropGroupUpdate setter dragIndex dropIndex
                |> Internal.Operations.swap dragIndex dropIndex

        Unaltered ->
            list



-- EVENTS


dragEvents : (Msg -> msg) -> DragIndex -> DragElementId -> List (Html.Attribute msg)
dragEvents toMsg dragIndex dragElementId =
    [ Html.Events.preventDefaultOn "mousedown"
        (Internal.Decoders.decodeCoordinatesWithButtonCheck
            |> Json.Decode.map (DownDragItem dragIndex dragElementId >> toMsg)
            |> Json.Decode.map (\msg -> ( msg, True ))
        )
    ]


dropEvents : (Msg -> msg) -> DropIndex -> DropElementId -> List (Html.Attribute msg)
dropEvents toMsg dropIndex dropElementId =
    [ Html.Events.onMouseOver (OverDropItem dropIndex dropElementId |> InBetweenMsg |> toMsg)
    , Html.Events.onMouseEnter (EnterDropItem |> InBetweenMsg |> toMsg)
    , Html.Events.onMouseLeave (LeaveDropItem |> InBetweenMsg |> toMsg)
    ]



-- STYLES


ghostStyles : Config item -> Model -> List (Html.Attribute msg)
ghostStyles (Config _ { customGhostProperties }) (Model model) =
    case model of
        Just state ->
            case state.dragElement of
                Just dragElement ->
                    transformDeclaration state.translateVector dragElement :: Internal.Ghost.baseDeclarations customGhostProperties dragElement

                _ ->
                    []

        Nothing ->
            []


transformDeclaration : Coordinates -> Browser.Dom.Element -> Html.Attribute msg
transformDeclaration { x, y } { element } =
    Html.Attributes.style "transform" <|
        Internal.Ghost.translate
            (round (x + element.x))
            (round (y + element.y))
