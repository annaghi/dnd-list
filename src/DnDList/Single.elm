module DnDList.Single exposing
    ( Config, config
    , movement, listen, operation, ghost
    , setItemsBeforeReorder
    , detectDrop, detectReorder
    , withAutoScroll
    , scroll, scrollWithOffset, scrollWithOffsetAndWall
    , System, create, Msg
    , Model
    , Info
    )

{-| While dragging and dropping a list item, the mouse events, the ghost element's positioning
and the list sorting are handled internally by this module.
Here is a [basic demo](https://annaghi.github.io/dnd-list/introduction/basic),
we will use it as an illustration throughout this page.

The first step is to create a `System` object which holds all the information related to the drag and drop features.
Using this object you can wire up the module's internal model, subscriptions, commands, and update
into your model, subscriptions, commands, and update respectively.

Next, when you write your `view` functions, you will need to bind the drag and drop events to the list items,
and also style them according to their current state.
The `System` object gives you access to events and to detailed information about the drag source and drop target items.

Finally, you will need to render a ghost element to be used for dragging display.
You can add position styling attributes to this element using the`System` object.

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
@docs movement, listen, operation, ghost
@docs setItemsBeforeReorder
@docs detectDrop, detectReorder
@docs withAutoScroll
@docs scroll, scrollWithOffset, scrollWithOffsetAndWall


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
  itemView : Single.Model -> Int -> Fruit -> Html.Html Msg
  itemView dnd index item =
      let
          itemId : String
          itemId =
              "id-" ++ item
      in
      case system.info dnd of
          Just _ ->
              -- Render when there is an ongoing dragging.

          Nothing ->
              Html.p
                  (Html.Attributes.id itemId
                      :: system.dragEvents index itemId
                  )
                  [ Html.text item ]
```


## dropEvents

`dropEvents` is a function which wraps all the events up for the drop target items.

    itemView : Single.Model -> Int -> Fruit -> Html.Html Msg
    itemView dnd index item =
        let
            itemId : String
            itemId =
                "id-" ++ item
        in
        case system.info dnd of
            Just { dragIndex } ->
                if dragIndex /= index then
                    Html.p
                        (Html.Attributes.id itemId
                            :: system.dropEvents index itemId
                        )
                        [ Html.text item ]

                else
                    Html.p
                        [ Html.Attributes.id itemId ]
                        [ Html.text "[---------]" ]

            Nothing ->
                -- Render when there is no dragging.


## ghostStyles

`ghostStyles` is a function which wraps up the positioning styles of the ghost element.
The ghost element has absolute position relative to the viewport.

    ghostView : Single.Model -> List Fruit -> Html.Html Msg
    ghostView dnd items =
        let
            maybeDragItem : Maybe Fruit
            maybeDragItem =
                system.info dnd
                    |> Maybe.andThen
                        (\{ dragIndex } ->
                            items
                                |> List.drop dragIndex
                                |> List.head
                        )
        in
        case maybeDragItem of
            Just item ->
                Html.div
                    (system.ghostStyles dnd)
                    [ Html.text item ]

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
import DnDList exposing (..)
import Html
import Html.Attributes
import Html.Events
import Internal.Decoders
import Internal.Ghost
import Internal.Operations
import Internal.Scroll
import Internal.Types exposing (..)
import Json.Decode
import Task


{-| Represents the `System`'s configuration.

  - `setItemsBeforeReorder`: This is a hook and gives you access to your list before it will be sorted.
    The first number is the drag index, the second number is the drop index.
    The [Towers of Hanoi](https://annaghi.github.io/dnd-list/gallery/hanoi) uses this hook to update the disks' `tower` attribute.

  - `movement`: The dragging can be constrained to horizontal or vertical axis only, or it can be set to free.
    This [demo config](https://annaghi.github.io/dnd-list/config/movement) shows the different movements in action.

  - `listen`: The items can listen for drag events or for drop events.
    In the first case the list will be sorted again and again while the mouse moves over the different drop target items.
    In the second case the list will be sorted only once on that drop target where the mouse was finally released.

  - `operation`: Different kinds of sort operations can be performed on the list.
    You can start to analyze them with
    [sorting on drag](https://annaghi.github.io/dnd-list/config/operations-drag)
    and [sorting on drop](https://annaghi.github.io/dnd-list/config/operations-drop).

This is our configuration with a void `setItemsBeforeReorder`:

    config : Single.Config Fruit
    config =
        { setItemsBeforeReorder = \_ _ list -> list
        , movement = Single.Free
        , listen = Single.OnDrag
        , operation = Single.Rotate
        }

-}
type Config item msg
    = Config (Options item msg)


type alias Options item msg =
    { movement : Movement
    , listen : Listen
    , operation : Operation
    , ghost : List String
    , setItemsBeforeReorder : DragIndex -> DropIndex -> List item -> List item
    , detectDrop : Maybe (DragIndex -> DropIndex -> List item -> msg)
    , detectReorder : Maybe (DragIndex -> DropIndex -> List item -> msg)
    , autoScroll : Bool
    , scroll : Maybe ScrollOptions
    }


config : Config item msg
config =
    Config defaultOptions


defaultOptions : Options item msg
defaultOptions =
    { movement = Free
    , listen = OnDrag
    , operation = Rotate
    , ghost = [ "width", "height", "positionTopLeft" ]
    , setItemsBeforeReorder = \_ _ list -> list
    , detectDrop = Nothing
    , detectReorder = Nothing
    , autoScroll = False
    , scroll = Nothing
    }



-- Options


movement : Movement -> Config item msg -> Config item msg
movement movement_ (Config options) =
    Config { options | movement = movement_ }


listen : Listen -> Config item msg -> Config item msg
listen listen_ (Config options) =
    Config { options | listen = listen_ }


operation : Operation -> Config item msg -> Config item msg
operation operation_ (Config options) =
    Config { options | operation = operation_ }


ghost : List String -> Config item msg -> Config item msg
ghost properties (Config options) =
    Config { options | ghost = properties }


setItemsBeforeReorder : (DragIndex -> DropIndex -> List item -> List item) -> Config item msg -> Config item msg
setItemsBeforeReorder hook (Config options) =
    Config { options | setItemsBeforeReorder = hook }


detectDrop : (DragIndex -> DropIndex -> List item -> msg) -> Config item msg -> Config item msg
detectDrop toMessage (Config options) =
    Config { options | detectDrop = Just toMessage }


detectReorder : (DragIndex -> DropIndex -> List item -> msg) -> Config item msg -> Config item msg
detectReorder toMessage (Config options) =
    Config { options | detectReorder = Just toMessage }


withAutoScroll : Config item msg -> Config item msg
withAutoScroll (Config options) =
    Config { options | autoScroll = True }


scroll : Orientation -> ContainerElementId -> Config item msg -> Config item msg
scroll orientation containerElementId (Config options) =
    Config
        { options
            | scroll =
                Just
                    { containerElementId = containerElementId
                    , orientation = orientation
                    , offset = Internal.Scroll.noOffset
                    , hasWall = False
                    }
        }


scrollWithOffset : Offset -> Orientation -> ContainerElementId -> Config item msg -> Config item msg
scrollWithOffset offset orientation containerElementId (Config options) =
    Config
        { options
            | scroll =
                Just
                    { containerElementId = containerElementId
                    , orientation = orientation
                    , offset = offset
                    , hasWall = False
                    }
        }


scrollWithOffsetAndWall : Offset -> Orientation -> ContainerElementId -> Config item msg -> Config item msg
scrollWithOffsetAndWall offset orientation containerElementId (Config options) =
    Config
        { options
            | scroll =
                Just
                    { containerElementId = containerElementId
                    , orientation = orientation
                    , offset = offset
                    , hasWall = True
                    }
        }


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

Suppose we have a list of fruits:

    type alias Fruit =
        String

    data : List Fruit
    data =
        [ "Apples", "Bananas", "Cherries", "Dates" ]

Now the `System` is a wrapper type around the list item and our message types:

    system : Single.System Fruit Msg
    system =
        Single.create config MyMsg

-}
create : (Msg -> msg) -> Config item msg -> System item msg
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
        { dnd : Single.Model
        , items : List Fruit
        }

    initialModel : Model
    initialModel =
        { dnd = system.model
        , items = data
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
    , containerElement : Maybe Browser.Dom.Element
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

    itemView : Single.Model -> Int -> Fruit -> Html.Html Msg
    itemView dnd index item =
        ...
        case system.info dnd of
            Just _ ->
                -- Render when there is an ongoing dragging.

            Nothing ->
                -- Render when there is no dragging.

Or you can determine the current drag source item using the `Info` object:

    maybeDragItem : Single.Model -> List Fruit -> Maybe Fruit
    maybeDragItem dnd items =
        system.info dnd
            |> Maybe.andThen
                (\{ dragIndex } ->
                    items
                        |> List.drop dragIndex
                        |> List.head
                )

-}
type alias Info =
    { dragIndex : DragIndex
    , dropIndex : DropIndex
    , dragElementId : DragElementId
    , dropElementId : DropElementId
    , dragElement : Browser.Dom.Element
    , dropElement : Browser.Dom.Element
    }


info : Model -> Maybe Info
info (Model model) =
    case model of
        Just state ->
            case ( state.dragElement, state.dropElement ) of
                ( Just dragElement, Just dropElement ) ->
                    Just
                        { dragIndex = state.dragIndex
                        , dropIndex = state.dropIndex
                        , dragElementId = state.dragElementId
                        , dropElementId = state.dropElementId
                        , dragElement = dragElement
                        , dropElement = dropElement
                        }

                _ ->
                    Nothing

        Nothing ->
            Nothing


{-| Internal message type.
It should be wrapped within our message constructor:

    type Msg
        = MyMsg Single.Msg

-}
type Msg
    = DownInsideDragItem DragIndex DragElementId Coordinates
    | InBetweenMsg InBetweenMsg
    | ReleaseMouse


type InBetweenMsg
    = MoveMouse Coordinates
    | OverDropItem DropIndex DropElementId
    | EnterDropItem
    | LeaveDropItem
    | GetDragItem (Result Browser.Dom.Error Browser.Dom.Element)
    | GetDropItem (Result Browser.Dom.Error Browser.Dom.Element)
    | GetContainer (Result Browser.Dom.Error Browser.Dom.Element)
    | TickMsg TickMsg


type TickMsg
    = Tick Float
    | ScrollOnContainer (Result Browser.Dom.Error Internal.Scroll.ScrollMeta)
    | AutoScrollOnContainer (Result Browser.Dom.Error Internal.Scroll.ScrollMeta)
    | NoOp


subscriptions : (Msg -> msg) -> Model -> Sub msg
subscriptions toMsg (Model model) =
    if model /= Nothing then
        Sub.batch
            [ Browser.Events.onMouseMove
                (Internal.Decoders.decodeCoordinates |> Json.Decode.map (MoveMouse >> InBetweenMsg >> toMsg))
            , Browser.Events.onMouseUp
                (Json.Decode.succeed (ReleaseMouse |> toMsg))
            , Browser.Events.onAnimationFrameDelta (Tick >> TickMsg >> InBetweenMsg >> toMsg)
            ]

    else
        Sub.none


update : Config item msg -> (Msg -> msg) -> List item -> Msg -> Model -> ( List item, Model, Cmd msg )
update (Config options) toMsg list msg (Model model) =
    case msg of
        DownInsideDragItem dragIndex dragElementId coordinates ->
            ( list
            , Model <|
                Just
                    { dragIndex = dragIndex
                    , dropIndex = dragIndex
                    , moveCounter = 0
                    , startPosition = coordinates
                    , currentPosition = coordinates
                    , translateVector = Coordinates 0 0
                    , dragElementId = dragElementId
                    , dropElementId = dragElementId
                    , dragElement = Nothing
                    , dropElement = Nothing
                    , containerElement = Nothing
                    }
            , Cmd.batch
                [ Cmd.map (InBetweenMsg >> toMsg) (Task.attempt GetDragItem (Browser.Dom.getElement dragElementId))
                , case options.scroll of
                    Just scrollOptions ->
                        Cmd.map (InBetweenMsg >> toMsg) (Task.attempt GetContainer (Browser.Dom.getElement scrollOptions.containerElementId))

                    Nothing ->
                        Cmd.none
                ]
            )

        InBetweenMsg inBetweenMsg ->
            case model of
                Just state ->
                    let
                        ( newList, newState, newCmd ) =
                            inBetweenUpdate options toMsg list inBetweenMsg state
                    in
                    ( newList, Model (Just newState), newCmd )

                Nothing ->
                    ( list, Model Nothing, Cmd.none )

        ReleaseMouse ->
            -- TODO This branch might be DRY
            case model of
                Just state ->
                    if state.dragIndex /= state.dropIndex then
                        if options.listen == OnDrop then
                            let
                                -- TODO Is there a way to get rid of this newList variable?
                                newList : List item
                                newList =
                                    list
                                        |> options.setItemsBeforeReorder state.dragIndex state.dropIndex
                                        |> listUpdate options.operation state.dragIndex state.dropIndex
                            in
                            ( newList
                            , Model Nothing
                            , options.detectDrop
                                |> Maybe.map (\toMessage -> Task.perform (toMessage state.dragIndex state.dropIndex) (Task.succeed newList))
                                |> Maybe.withDefault Cmd.none
                            )

                        else
                            ( list
                            , Model Nothing
                            , options.detectDrop
                                |> Maybe.map (\toMessage -> Task.perform (toMessage state.dragIndex state.dropIndex) (Task.succeed list))
                                |> Maybe.withDefault Cmd.none
                            )

                    else
                        ( list
                        , Model Nothing
                        , options.detectDrop
                            |> Maybe.map (\toMessage -> Task.perform (toMessage state.dragIndex state.dropIndex) (Task.succeed list))
                            |> Maybe.withDefault Cmd.none
                        )

                _ ->
                    ( list, Model Nothing, Cmd.none )


inBetweenUpdate : Options item msg -> (Msg -> msg) -> List item -> InBetweenMsg -> State -> ( List item, State, Cmd msg )
inBetweenUpdate options toMsg list msg state =
    case msg of
        MoveMouse coordinates ->
            ( list
            , { state | currentPosition = coordinates, moveCounter = state.moveCounter + 1 }
            , Cmd.none
            )

        OverDropItem dropIndex dropElementId ->
            ( list
            , { state | dropIndex = dropIndex, dropElementId = dropElementId }
            , Cmd.map (InBetweenMsg >> toMsg) (Task.attempt GetDropItem (Browser.Dom.getElement dropElementId))
            )

        EnterDropItem ->
            if state.moveCounter > 1 && state.dragIndex /= state.dropIndex then
                case options.listen of
                    OnDrag ->
                        let
                            newList : List item
                            newList =
                                list
                                    |> options.setItemsBeforeReorder state.dragIndex state.dropIndex
                                    |> listUpdate options.operation state.dragIndex state.dropIndex
                        in
                        ( newList
                        , stateUpdate options.operation state.dropIndex state
                        , options.detectReorder
                            |> Maybe.map (\toMessage -> Task.perform (toMessage state.dragIndex state.dropIndex) (Task.succeed newList))
                            |> Maybe.withDefault Cmd.none
                        )

                    OnDrop ->
                        ( list, { state | moveCounter = 0 }, Cmd.none )

            else
                ( list, state, Cmd.none )

        LeaveDropItem ->
            ( list
            , { state | dropIndex = state.dragIndex }
            , Cmd.none
            )

        GetDragItem result ->
            ( list
            , { state | dragElement = Result.toMaybe result, dropElement = Result.toMaybe result }
            , Cmd.none
            )

        GetDropItem result ->
            ( list
            , { state | dropElement = Result.toMaybe result }
            , Cmd.none
            )

        GetContainer result ->
            ( list
            , { state | containerElement = Result.toMaybe result }
            , Cmd.none
            )

        TickMsg tickMsg ->
            let
                ( newState, newCmd ) =
                    tickUpdate options tickMsg state
            in
            ( list, newState, Cmd.map (TickMsg >> InBetweenMsg >> toMsg) newCmd )


tickUpdate : Options item msg -> TickMsg -> State -> ( State, Cmd TickMsg )
tickUpdate options msg state =
    case msg of
        Tick _ ->
            case ( options.autoScroll, options.scroll ) of
                ( True, Just scrollOptions ) ->
                    case state.containerElement of
                        Just containerElement ->
                            ( state
                            , Task.map2 (Internal.Scroll.ScrollMeta scrollOptions containerElement)
                                (Browser.Dom.getViewportOf scrollOptions.containerElementId)
                                Browser.Dom.getViewport
                                |> Task.attempt AutoScrollOnContainer
                            )

                        Nothing ->
                            ( { state | translateVector = Internal.Scroll.baseCoordinates state.startPosition state.currentPosition }
                            , Browser.Dom.getViewport
                                |> Task.andThen (\documentViewport -> Internal.Scroll.scrollOnDocumentByStep 35 state.currentPosition documentViewport)
                                |> Task.attempt (\_ -> NoOp)
                            )

                ( True, Nothing ) ->
                    ( { state | translateVector = Internal.Scroll.baseCoordinates state.startPosition state.currentPosition }
                    , Browser.Dom.getViewport
                        |> Task.andThen (\documentViewport -> Internal.Scroll.scrollOnDocumentByStep 35 state.currentPosition documentViewport)
                        |> Task.attempt (\_ -> NoOp)
                    )

                ( False, Just scrollOptions ) ->
                    case state.containerElement of
                        Just containerElement ->
                            ( state
                            , Task.map2 (Internal.Scroll.ScrollMeta scrollOptions containerElement)
                                (Browser.Dom.getViewportOf scrollOptions.containerElementId)
                                Browser.Dom.getViewport
                                |> Task.attempt ScrollOnContainer
                            )

                        Nothing ->
                            ( { state | translateVector = Internal.Scroll.baseCoordinates state.startPosition state.currentPosition }
                            , Cmd.none
                            )

                ( False, Nothing ) ->
                    ( { state | translateVector = Internal.Scroll.baseCoordinates state.startPosition state.currentPosition }
                    , Cmd.none
                    )

        AutoScrollOnContainer (Ok scrollMeta) ->
            ( { state | translateVector = Internal.Scroll.coordinates state.startPosition state.currentPosition scrollMeta }
            , [ Internal.Scroll.scrollOnDocumentByStep 35 state.currentPosition scrollMeta.documentViewport
              , Internal.Scroll.scrollOnContainerByStep 35 state.currentPosition scrollMeta
              ]
                |> Task.sequence
                |> Task.attempt (\_ -> NoOp)
            )

        ScrollOnContainer (Ok scrollMeta) ->
            ( { state | translateVector = Internal.Scroll.coordinates state.startPosition state.currentPosition scrollMeta }
            , Internal.Scroll.scrollOnContainerByStep 35 state.currentPosition scrollMeta
                |> Task.attempt (\_ -> NoOp)
            )

        AutoScrollOnContainer (Err _) ->
            ( state, Cmd.none )

        ScrollOnContainer (Err _) ->
            ( state, Cmd.none )

        NoOp ->
            ( state, Cmd.none )


stateUpdate : Operation -> DropIndex -> State -> State
stateUpdate operation_ dropIndex state =
    case operation_ of
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


listUpdate : Operation -> DragIndex -> DropIndex -> List item -> List item
listUpdate operation_ dragIndex dropIndex list =
    case operation_ of
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



-- EVENTS


dragEvents : (Msg -> msg) -> DragIndex -> DragElementId -> List (Html.Attribute msg)
dragEvents toMsg dragIndex dragElementId =
    [ Html.Events.preventDefaultOn "mousedown"
        (Internal.Decoders.decodeCoordinatesWithButtonCheck
            |> Json.Decode.map (DownInsideDragItem dragIndex dragElementId >> toMsg)
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


ghostStyles : Config item msg -> Model -> List (Html.Attribute msg)
ghostStyles (Config options) (Model model) =
    case model of
        Just state ->
            case state.dragElement of
                Just dragElement ->
                    transformDeclaration options.movement state.translateVector dragElement
                        :: Internal.Ghost.baseDeclarations options.ghost dragElement

                _ ->
                    []

        Nothing ->
            []


transformDeclaration : Movement -> Coordinates -> Browser.Dom.Element -> Html.Attribute msg
transformDeclaration movement_ { x, y } { element, viewport } =
    case movement_ of
        Horizontal ->
            Html.Attributes.style "transform" <|
                Internal.Ghost.translate
                    (round (x + element.x - viewport.x))
                    (round (element.y - viewport.y))

        Vertical ->
            Html.Attributes.style "transform" <|
                Internal.Ghost.translate
                    (round (element.x - viewport.x))
                    (round (y + element.y - viewport.y))

        Free ->
            Html.Attributes.style "transform" <|
                Internal.Ghost.translate
                    (round (x + element.x - viewport.x))
                    (round (y + element.y - viewport.y))
