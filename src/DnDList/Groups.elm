module DnDList.Groups exposing
    ( System, create, Msg
    , Config
    , Listen(..), Operation(..)
    , Info
    , Model
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


# System

@docs System, create, Msg


# Config

@docs Config
@docs Listen, Operation


# Info

@docs Info


# System fields


## model

@docs Model


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
                , system.commands model.dnd
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
                , system.commands model.dnd
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
        position: absolute;
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
import Json.Decode
import Operations
import Task
import Utils


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
    { dragIndex : Int
    , dropIndex : Int
    , dragCounter : Int
    , startPosition : Utils.Position
    , currentPosition : Utils.Position
    , dragElementId : String
    , dropElementId : String
    , dragElement : Maybe Browser.Dom.Element
    , dropElement : Maybe Browser.Dom.Element
    }


{-| A `System` encapsulates:

  - the internal model, subscriptions, commands, and update,

  - the bindable events and styles, and

  - the `Info` object.

Later we will learn more about the [Info object](#info) and the [System fields](#system-fields).

-}
type alias System a msg =
    { model : Model
    , subscriptions : Model -> Sub msg
    , commands : Model -> Cmd msg
    , update : Msg -> Model -> List a -> ( Model, List a )
    , dragEvents : Int -> String -> List (Html.Attribute msg)
    , dropEvents : Int -> String -> List (Html.Attribute msg)
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
create : Config a -> (Msg -> msg) -> System a msg
create config stepMsg =
    { model = Model Nothing
    , subscriptions = subscriptions stepMsg
    , commands = commands stepMsg
    , update = update config
    , dragEvents = dragEvents stepMsg
    , dropEvents = dropEvents stepMsg
    , ghostStyles = ghostStyles
    , info = info
    }


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
type alias Config a =
    { beforeUpdate : Int -> Int -> List a -> List a
    , listen : Listen
    , operation : Operation
    , groups :
        { listen : Listen
        , operation : Operation
        , comparator : a -> a -> Bool
        , setter : a -> a -> a
        }
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


{-| Represents the information about the drag source and the drop target items.
It is accessible through the `System`'s `info` field.

  - `dragIndex`: The index of the drag source.

  - `dropIndex`: The index of the drop target.

  - `dragElementId`: HTML id of the drag source.

  - `dropElementId`: HTML id of the drop target.

  - `dragElement`: Information about the drag source as an HTML element, see `Browser.Dom.Element`.

  - `dropElement`: Information about the drop target as an HTML element, see `Browser.Dom.Element`.

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

-}
type alias Info =
    { dragIndex : Int
    , dropIndex : Int
    , dragElementId : String
    , dropElementId : String
    , dragElement : Browser.Dom.Element
    , dropElement : Browser.Dom.Element
    }


subscriptions : (Msg -> msg) -> Model -> Sub msg
subscriptions stepMsg (Model model) =
    case model of
        Nothing ->
            Sub.none

        Just _ ->
            Sub.batch
                [ Browser.Events.onMouseMove
                    (Json.Decode.map2 Utils.Position Utils.pageX Utils.pageY
                        |> Json.Decode.map (stepMsg << Drag)
                    )
                , Browser.Events.onMouseUp
                    (Json.Decode.succeed (stepMsg DragEnd))
                ]


commands : (Msg -> msg) -> Model -> Cmd msg
commands stepMsg (Model model) =
    case model of
        Nothing ->
            Cmd.none

        Just state ->
            Cmd.batch
                [ dragElementCommands stepMsg state
                , dropElementCommands stepMsg state
                ]


dragElementCommands : (Msg -> msg) -> State -> Cmd msg
dragElementCommands stepMsg state =
    case state.dragElement of
        Nothing ->
            Task.attempt (stepMsg << GotDragElement) (Browser.Dom.getElement state.dragElementId)

        _ ->
            Cmd.none


dropElementCommands : (Msg -> msg) -> State -> Cmd msg
dropElementCommands stepMsg state =
    if state.dragCounter == 0 then
        Task.attempt (stepMsg << GotDropElement) (Browser.Dom.getElement state.dropElementId)

    else
        Cmd.none


{-| Internal message type.
It should be wrapped within our message constructor:

    type Msg
        = MyMsg DnDList.Groups.Msg

-}
type Msg
    = DragStart Int String Utils.Position
    | Drag Utils.Position
    | DragOver Int String
    | DragEnter Int
    | DragLeave
    | DragEnd
    | GotDragElement (Result Browser.Dom.Error Browser.Dom.Element)
    | GotDropElement (Result Browser.Dom.Error Browser.Dom.Element)


update : Config a -> Msg -> Model -> List a -> ( Model, List a )
update { beforeUpdate, listen, operation, groups } msg (Model model) list =
    case msg of
        DragStart dragIndex dragElementId xy ->
            ( Model <|
                Just
                    { dragIndex = dragIndex
                    , dropIndex = dragIndex
                    , dragCounter = 0
                    , startPosition = xy
                    , currentPosition = xy
                    , dragElementId = dragElementId
                    , dropElementId = dragElementId
                    , dragElement = Nothing
                    , dropElement = Nothing
                    }
            , list
            )

        Drag xy ->
            ( model
                |> Maybe.map (\state -> { state | currentPosition = xy, dragCounter = state.dragCounter + 1 })
                |> Model
            , list
            )

        DragOver dropIndex dropElementId ->
            ( model
                |> Maybe.map (\state -> { state | dropIndex = dropIndex, dropElementId = dropElementId })
                |> Model
            , list
            )

        DragEnter dropIndex ->
            case model of
                Just state ->
                    if state.dragCounter > 1 && state.dragIndex /= dropIndex then
                        if listen == OnDrag && equalGroups groups.comparator state.dragIndex dropIndex list then
                            ( Model (Just (stateUpdate operation dropIndex state))
                            , list
                                |> beforeUpdate state.dragIndex dropIndex
                                |> sublistUpdate operation state.dragIndex dropIndex
                            )

                        else if groups.listen == OnDrag && not (equalGroups groups.comparator state.dragIndex dropIndex list) then
                            ( Model (Just (stateUpdate groups.operation dropIndex state))
                            , list
                                |> beforeUpdate state.dragIndex dropIndex
                                |> listUpdate groups.operation groups.comparator groups.setter state.dragIndex dropIndex
                            )

                        else
                            ( Model (Just { state | dragCounter = 0 }), list )

                    else
                        ( Model model, list )

                _ ->
                    ( Model model, list )

        DragLeave ->
            ( model
                |> Maybe.map (\state -> { state | dropIndex = state.dragIndex })
                |> Model
            , list
            )

        DragEnd ->
            case model of
                Just state ->
                    if state.dragIndex /= state.dropIndex then
                        if listen == OnDrop && equalGroups groups.comparator state.dragIndex state.dropIndex list then
                            ( Model Nothing
                            , list
                                |> beforeUpdate state.dragIndex state.dropIndex
                                |> sublistUpdate operation state.dragIndex state.dropIndex
                            )

                        else if groups.listen == OnDrop && not (equalGroups groups.comparator state.dragIndex state.dropIndex list) then
                            ( Model Nothing
                            , list
                                |> beforeUpdate state.dragIndex state.dropIndex
                                |> listUpdate groups.operation groups.comparator groups.setter state.dragIndex state.dropIndex
                            )

                        else
                            ( Model Nothing, list )

                    else
                        ( Model Nothing, list )

                _ ->
                    ( Model Nothing, list )

        GotDragElement (Err _) ->
            ( Model model, list )

        GotDragElement (Ok dragElement) ->
            ( model
                |> Maybe.map (\state -> { state | dragElement = Just dragElement, dropElement = Just dragElement })
                |> Model
            , list
            )

        GotDropElement (Err _) ->
            ( Model model, list )

        GotDropElement (Ok dropElement) ->
            ( model
                |> Maybe.map (\state -> { state | dropElement = Just dropElement })
                |> Model
            , list
            )


stateUpdate : Operation -> Int -> State -> State
stateUpdate operation dropIndex state =
    case operation of
        InsertAfter ->
            { state
                | dragIndex =
                    if dropIndex < state.dragIndex then
                        dropIndex + 1

                    else
                        dropIndex
                , dragCounter = 0
            }

        InsertBefore ->
            { state
                | dragIndex =
                    if state.dragIndex < dropIndex then
                        dropIndex - 1

                    else
                        dropIndex
                , dragCounter = 0
            }

        Rotate ->
            { state | dragIndex = dropIndex, dragCounter = 0 }

        Swap ->
            { state | dragIndex = dropIndex, dragCounter = 0 }

        Unaltered ->
            { state | dragCounter = 0 }


sublistUpdate : Operation -> Int -> Int -> List a -> List a
sublistUpdate operation dragIndex dropIndex list =
    case operation of
        InsertAfter ->
            Operations.insertAfter dragIndex dropIndex list

        InsertBefore ->
            Operations.insertBefore dragIndex dropIndex list

        Rotate ->
            Operations.rotate dragIndex dropIndex list

        Swap ->
            Operations.swap dragIndex dropIndex list

        Unaltered ->
            list


listUpdate : Operation -> (a -> a -> Bool) -> (a -> a -> a) -> Int -> Int -> List a -> List a
listUpdate operation comparator setter dragIndex dropIndex list =
    let
        dragGroupUpdate : List a -> List a
        dragGroupUpdate l =
            l
                |> List.indexedMap
                    (\index item ->
                        if index == dragIndex then
                            List.map2 setter (drops dropIndex list) [ item ]

                        else
                            [ item ]
                    )
                |> List.concat

        dragAndDropGroupUpdate : List a -> List a
        dragAndDropGroupUpdate l =
            l
                |> List.indexedMap
                    (\index item ->
                        if index == dragIndex then
                            List.map2 setter (drops dropIndex list) [ item ]

                        else if index == dropIndex then
                            List.map2 setter (drags dragIndex list) [ item ]

                        else
                            [ item ]
                    )
                |> List.concat

        sublist : List a -> List a
        sublist l =
            l
                |> List.indexedMap Tuple.pair
                |> List.foldl
                    (\( index, item ) acc ->
                        if equalGroups comparator index 0 l then
                            item :: acc

                        else
                            acc
                    )
                    []

        bubbleGroupRecursive : List a -> List a
        bubbleGroupRecursive l =
            case l of
                [] ->
                    []

                [ x ] ->
                    [ x ]

                x :: xs ->
                    let
                        sl : List a
                        sl =
                            sublist l
                    in
                    if sl /= [] then
                        (sl |> List.drop 1 |> List.reverse)
                            ++ List.map2 (\prev next -> setter next prev)
                                (List.take 1 sl)
                                (xs |> List.drop (List.length sl - 1) |> List.take 1)
                            ++ bubbleGroupRecursive
                                (List.map2 (\prev next -> setter prev next)
                                    (List.take 1 sl)
                                    (xs |> List.drop (List.length sl - 1) |> List.take 1)
                                    ++ List.drop (List.length sl) xs
                                )

                    else
                        x :: xs

        groupUpdate : (List a -> List a) -> Int -> Int -> List a -> List a
        groupUpdate fn i j l =
            let
                beginning : List a
                beginning =
                    List.take i l

                middle : List a
                middle =
                    l
                        |> List.drop i
                        |> List.take (j - i + 1)

                end : List a
                end =
                    List.drop (j + 1) l
            in
            beginning ++ fn middle ++ end
    in
    case operation of
        InsertAfter ->
            list
                |> dragGroupUpdate
                |> Operations.insertAfter dragIndex dropIndex

        InsertBefore ->
            list
                |> dragGroupUpdate
                |> Operations.insertBefore dragIndex dropIndex

        Rotate ->
            if dragIndex < dropIndex then
                list
                    |> groupUpdate (List.reverse >> bubbleGroupRecursive >> List.reverse) dragIndex dropIndex
                    |> Operations.rotate dragIndex dropIndex

            else if dropIndex < dragIndex then
                list
                    |> groupUpdate bubbleGroupRecursive dropIndex dragIndex
                    |> Operations.rotate dragIndex dropIndex

            else
                list

        Swap ->
            list
                |> dragAndDropGroupUpdate
                |> Operations.swap dragIndex dropIndex

        Unaltered ->
            list


dragEvents : (Msg -> msg) -> Int -> String -> List (Html.Attribute msg)
dragEvents stepMsg dragIndex dragElementId =
    [ Html.Events.preventDefaultOn "mousedown"
        (Json.Decode.map2 Utils.Position Utils.pageX Utils.pageY
            |> Json.Decode.map (stepMsg << DragStart dragIndex dragElementId)
            |> Json.Decode.map (\msg -> ( msg, True ))
        )
    ]


dropEvents : (Msg -> msg) -> Int -> String -> List (Html.Attribute msg)
dropEvents stepMsg dropIndex dropElementId =
    [ Html.Events.onMouseOver (stepMsg (DragOver dropIndex dropElementId))
    , Html.Events.onMouseEnter (stepMsg (DragEnter dropIndex))
    , Html.Events.onMouseLeave (stepMsg DragLeave)
    ]


info : Model -> Maybe Info
info (Model model) =
    Maybe.andThen
        (\s ->
            Maybe.map2
                (\dragElement dropElement ->
                    { dragIndex = s.dragIndex
                    , dropIndex = s.dropIndex
                    , dragElementId = s.dragElementId
                    , dropElementId = s.dropElementId
                    , dragElement = dragElement
                    , dropElement = dropElement
                    }
                )
                s.dragElement
                s.dropElement
        )
        model


ghostStyles : Model -> List (Html.Attribute msg)
ghostStyles (Model model) =
    case model of
        Nothing ->
            []

        Just state ->
            case state.dragElement of
                Just { element } ->
                    [ Html.Attributes.style "position" "fixed"
                    , Html.Attributes.style "left" "0"
                    , Html.Attributes.style "top" "0"
                    , Html.Attributes.style "transform" <|
                        Utils.translate
                            (round (state.currentPosition.x - state.startPosition.x + element.x))
                            (round (state.currentPosition.y - state.startPosition.y + element.y))
                    , Html.Attributes.style "height" (Utils.px (round element.height))
                    , Html.Attributes.style "width" (Utils.px (round element.width))
                    , Html.Attributes.style "pointer-events" "none"
                    ]

                _ ->
                    []


equalGroups : (a -> a -> Bool) -> Int -> Int -> List a -> Bool
equalGroups comparator dragIndex dropIndex list =
    List.map2
        (\dragItem dropItem ->
            comparator dragItem dropItem
        )
        (drags dragIndex list)
        (drops dropIndex list)
        |> List.foldl (||) False


drags : Int -> List a -> List a
drags dragIndex list =
    list |> List.drop dragIndex |> List.take 1


drops : Int -> List a -> List a
drops dropIndex list =
    list |> List.drop dropIndex |> List.take 1
