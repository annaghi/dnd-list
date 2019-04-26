module DnDList.Groups exposing
    ( System, create, Msg
    , Config
    , Trigger(..), Operation(..)
    , Info
    , Model
    )

{-| If the list is groupable by a certain property, the items can be transferred between those groups.
Instead of using drop zones, this module requires the list to be prepared with auxiliary items.
Here is a [groups demo](https://annaghi.github.io/dnd-list/introduction/groups),
we will refer to it throughout this page.

This module is a modified version of the `DnDList` module.
The `Config` is extended with a new field called `groups`, and the `movement` field was diminished.
The internal sorting distinguishes between the operation performed on items from the _same group_,
and the operation performed on items from _different groups_.


# System

@docs System, create, Msg


# Config

@docs Config
@docs Trigger, Operation


# Info

@docs Info


# System Fields


## model

@docs Model


## subscriptions

`subscriptions` is a function to access the browser events during the drag.

    subscriptions : Model -> Sub Msg
    subscriptions model =
        system.subscriptions model.dnd


## commands

`commands` is a function to access the DOM for the drag source and the drop target `x`, `y`,
`width` and `height` information.

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

`update` is a function which returns an updated internal `Model` and the sorted list for our model.

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
                if value == "" then
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
                if value == "" && dragItem.group /= group then
                    Html.div
                        (Html.Attributes.id itemId
                            :: auxiliaryStyles
                            ++ system.dropEvents globalIndex itemId
                        )
                        []

                else if value == "" && dragItem.group == group then
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


## info

See [Info](#info)

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


{-| Represents the internal state of the current drag and drop features.
We can set it in our model and initialize through the `System`'s `model` field.

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
    , dragElement : Maybe Browser.Dom.Element
    , dropElement : Maybe Browser.Dom.Element
    , dragElementId : String
    , dropElementId : String
    }


{-| A `System` encapsulates

  - the internal model, subscriptions, commands, and update,

  - the bindable events and styles,

  - and the `Info` object.

For the details, see [Info](#info) and [System Fields](#system-fields).

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
        = Top
        | Bottom

and a list which is gathered by these groups and prepared with auxiliary items:

    type alias Item =
        { group : Group
        , value : String
        , color : String
        }

    preparedData : List Item
    preparedData =
        [ Item Top "C" blue
        , Item Top "2" red
        , Item Top "A" blue
        , Item Top "" transparent
        , Item Bottom "3" red
        , Item Bottom "B" blue
        , Item Bottom "1" red
        , Item Bottom "" transparent
        ]

The auxiliary items (the `transparent` ones) separate the groups
and they can be considered as header or footer of a particular group.
In this case they are footers.

The sort operations were designed with the following list state invariant in mind:

  - the items are gathered by the grouping property
  - the auxiliary items keep their places (headers or footers)

And now the `System` is a wrapper type around the list item and our message types:

    system : DnDList.Groups.System Item Msg
    system =
        DnDList.Groups.create config MyMsg

-}
create : Config a -> (Msg -> msg) -> System a msg
create config message =
    { model = Model Nothing
    , subscriptions = subscriptions message
    , commands = commands message
    , update = update config
    , dragEvents = dragEvents message
    , dropEvents = dropEvents message
    , ghostStyles = ghostStyles
    , info = info
    }


{-| Represents the `System` configuration.

  - `trigger`: This setting is for the items from the _same group_.
    Sorting can be triggered again and again while dragging over the drop target items,
    or it can be triggered only once on that drop target where the mouse was finally released.

  - `operation`: This setting is for the items from the _same group_.
    Different kinds of sort operations can be performed on the list.
    There are two comparisons - one for
    [triggered on drag](https://annaghi.github.io/dnd-list/configuration/operations-drag)
    and one for [triggered on drop](https://annaghi.github.io/dnd-list/configuration/operations-drop).

  - `beforeUpdate`: This is a hook and gives us access to the list
    before the sort is being performed on the items from the _same group_.

  - `groups`: This setting is for the items from _different groups_.
    To have a better understanding of how this works
    see [groups configurations](https://annaghi.github.io/dnd-list/configuration/groups).
      - `comparator`: Function which compares two items by the grouping property.
      - `trigger`: Same as the plain `trigger` but applied on items from _different groups_.
      - `operation`: Same as the plain `operation` but applied on the items from _different groups_.
      - `beforeUpdate`: Same as the plain `beforeUpdate` but applied on the items from _different groups_.

Here is an example configuration:

    config : DnDList.Groups.Config Item
    config =
        { trigger = DnDList.Groups.OnDrag
        , operation = DnDList.Groups.RotateOut
        , beforeUpdate = \_ _ list -> list
        , groups =
            { comparator = compareByGroup
            , trigger = DnDList.Groups.OnDrag
            , operation = DnDList.Groups.InsertBefore
            , beforeUpdate = updateOnGroupChange
            }
        }

    compareByGroup : Item -> Item -> Bool
    compareByGroup dragElement dropElement =
        -- Check whether the two groups are the same

    updateOnGroupChange : Int -> Int -> List Item -> List Item
    updateOnGroupChange dragIndex dropIndex list =
        -- Update the group field of the drag source item

-}
type alias Config a =
    { trigger : Trigger
    , operation : Operation
    , beforeUpdate : Int -> Int -> List a -> List a
    , groups :
        { comparator : a -> a -> Bool
        , trigger : Trigger
        , operation : Operation
        , beforeUpdate : Int -> Int -> List a -> List a
        }
    }


{-| Represents the event when the list will be sorted.

  - `OnDrag`: Sorting is triggered when the ghost element moves over a drop target item.

  - `OnDrop`: Sorting is triggered when the ghost element is dropped on a drop target item.

-}
type Trigger
    = OnDrag
    | OnDrop


{-| Represents the list sort operation.
Detailed comparisons can be found here:
[triggered on drag](https://annaghi.github.io/dnd-list/configuration/operations-drag)
and [triggered on drop](https://annaghi.github.io/dnd-list/configuration/operations-drop).

  - `InsertAfter`: The drag source item will be inserted after the drop target item.

  - `InsertBefore`: The drag source item will be inserted before the drop target item.

  - `RotateIn`: The items between the drag source and the drop target items will be circularly shifted,
    excluding the drop target.

  - `RotateOut`: The items between the drag source and the drop target items will be circularly shifted,
    including the drop target.

  - `Swap`: The drag source and the drop target items will be swapped.

  - `Unaltered`: The list items will keep their initial order.

-}
type Operation
    = InsertAfter
    | InsertBefore
    | RotateIn
    | RotateOut
    | Swap
    | Unaltered


{-| Represents the information about the drag source and the drop target items.
It is accessible through the `System`'s `info` field.

  - `dragIndex`: The index of the drag source item.

  - `dropIndex`: The index of the drop target item.

  - `dragElement`: Information about the drag source as an HTML element, see `Browser.Dom.Element`.

  - `dropElement`: Information about the drop target as an HTML element, see `Browser.Dom.Element`.

  - `dragElementId`: HTML id of the drag source.

  - `dropElementId`: HTML id of the drop target.

We can decide what to render when there is an ongoing dragging,
and what to render when there is no dragging related to this `System` object:

    itemView : Model -> ... -> Html.Html Msg
    itemView model ... =
        ...

        case system.info model.dnd of
            Just _ ->
                -- Render when there is an ongoing dragging.

            Nothing ->
                -- Render when there is no dragging.

Or we can get the drag source item:

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
    , dragElement : Browser.Dom.Element
    , dropElement : Browser.Dom.Element
    , dragElementId : String
    , dropElementId : String
    }


subscriptions : (Msg -> msg) -> Model -> Sub msg
subscriptions wrap (Model state) =
    case state of
        Nothing ->
            Sub.none

        Just _ ->
            Sub.batch
                [ Browser.Events.onMouseMove
                    (Json.Decode.map2 Utils.Position Utils.pageX Utils.pageY
                        |> Json.Decode.map (wrap << Drag)
                    )
                , Browser.Events.onMouseUp
                    (Json.Decode.succeed (wrap DragEnd))
                ]


commands : (Msg -> msg) -> Model -> Cmd msg
commands wrap model =
    Cmd.batch
        [ dragElementCommands wrap model
        , dropElementCommands wrap model
        ]


dragElementCommands : (Msg -> msg) -> Model -> Cmd msg
dragElementCommands wrap (Model state) =
    case state of
        Nothing ->
            Cmd.none

        Just s ->
            case s.dragElement of
                Nothing ->
                    Task.attempt (wrap << GotDragElement) (Browser.Dom.getElement s.dragElementId)

                _ ->
                    Cmd.none


dropElementCommands : (Msg -> msg) -> Model -> Cmd msg
dropElementCommands wrap (Model state) =
    case state of
        Nothing ->
            Cmd.none

        Just s ->
            if s.dragCounter == 0 then
                Task.attempt (wrap << GotDropElement) (Browser.Dom.getElement s.dropElementId)

            else
                Cmd.none


{-| Internal message type. It should be wrapped within our message constructor.

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
update { operation, trigger, beforeUpdate, groups } msg (Model state) list =
    case msg of
        DragStart dragIndex dragElementId xy ->
            ( Model <|
                Just
                    { dragIndex = dragIndex
                    , dropIndex = dragIndex
                    , dragCounter = 0
                    , startPosition = xy
                    , currentPosition = xy
                    , dragElement = Nothing
                    , dropElement = Nothing
                    , dragElementId = dragElementId
                    , dropElementId = dragElementId
                    }
            , list
            )

        Drag xy ->
            ( state
                |> Maybe.map (\s -> { s | currentPosition = xy, dragCounter = s.dragCounter + 1 })
                |> Model
            , list
            )

        DragOver dropIndex dropElementId ->
            ( state
                |> Maybe.map (\s -> { s | dropIndex = dropIndex, dropElementId = dropElementId })
                |> Model
            , list
            )

        DragEnter dropIndex ->
            case state of
                Just s ->
                    if s.dragCounter > 1 && s.dragIndex /= dropIndex then
                        if trigger == OnDrag && equalGroups groups.comparator s.dragIndex dropIndex list then
                            onDragUpdate dropIndex s operation beforeUpdate list

                        else if groups.trigger == OnDrag && not (equalGroups groups.comparator s.dragIndex dropIndex list) then
                            onDragUpdate dropIndex s groups.operation groups.beforeUpdate list

                        else
                            ( Model (Just { s | dragCounter = 0 }), list )

                    else
                        ( Model state, list )

                _ ->
                    ( Model state, list )

        DragLeave ->
            ( state
                |> Maybe.map (\s -> { s | dropIndex = s.dragIndex })
                |> Model
            , list
            )

        DragEnd ->
            case state of
                Just s ->
                    if s.dragIndex /= s.dropIndex then
                        if trigger == OnDrop && equalGroups groups.comparator s.dragIndex s.dropIndex list then
                            onDropUpdate s operation beforeUpdate list

                        else if groups.trigger == OnDrop && not (equalGroups groups.comparator s.dragIndex s.dropIndex list) then
                            onDropUpdate s groups.operation groups.beforeUpdate list

                        else
                            ( Model Nothing, list )

                    else
                        ( Model Nothing, list )

                _ ->
                    ( Model Nothing, list )

        GotDragElement (Err _) ->
            ( Model state, list )

        GotDragElement (Ok dragElement) ->
            ( state
                |> Maybe.map (\s -> { s | dragElement = Just dragElement, dropElement = Just dragElement })
                |> Model
            , list
            )

        GotDropElement (Err _) ->
            ( Model state, list )

        GotDropElement (Ok dropElement) ->
            ( state
                |> Maybe.map (\s -> { s | dropElement = Just dropElement })
                |> Model
            , list
            )


onDragUpdate : Int -> State -> Operation -> (Int -> Int -> List a -> List a) -> List a -> ( Model, List a )
onDragUpdate dropIndex s operation beforeUpdate list =
    case operation of
        InsertAfter ->
            ( Model
                (Just
                    { s
                        | dragIndex =
                            if s.dragIndex > dropIndex then
                                dropIndex + 1

                            else
                                dropIndex
                        , dragCounter = 0
                    }
                )
            , Operations.insertAfter beforeUpdate s.dragIndex dropIndex list
            )

        InsertBefore ->
            ( Model <|
                Just
                    { s
                        | dragIndex =
                            if s.dragIndex < dropIndex then
                                dropIndex - 1

                            else
                                dropIndex
                        , dragCounter = 0
                    }
            , Operations.insertBefore beforeUpdate s.dragIndex dropIndex list
            )

        RotateIn ->
            ( Model
                (Just
                    { s
                        | dragIndex =
                            if s.dragIndex < dropIndex then
                                dropIndex - 1

                            else if s.dragIndex > dropIndex then
                                dropIndex + 1

                            else
                                dropIndex
                        , dragCounter = 0
                    }
                )
            , Operations.rotateIn beforeUpdate s.dragIndex dropIndex list
            )

        RotateOut ->
            ( Model (Just { s | dragIndex = dropIndex, dragCounter = 0 })
            , Operations.rotateOut beforeUpdate s.dragIndex dropIndex list
            )

        Swap ->
            ( Model (Just { s | dragIndex = dropIndex, dragCounter = 0 })
            , Operations.swap beforeUpdate s.dragIndex dropIndex list
            )

        Unaltered ->
            ( Model (Just { s | dragCounter = 0 })
            , Operations.unaltered beforeUpdate s.dragIndex dropIndex list
            )


onDropUpdate : State -> Operation -> (Int -> Int -> List a -> List a) -> List a -> ( Model, List a )
onDropUpdate s operation beforeUpdate list =
    case operation of
        InsertAfter ->
            ( Model Nothing, Operations.insertAfter beforeUpdate s.dragIndex s.dropIndex list )

        InsertBefore ->
            ( Model Nothing, Operations.insertBefore beforeUpdate s.dragIndex s.dropIndex list )

        RotateIn ->
            ( Model Nothing, Operations.rotateIn beforeUpdate s.dragIndex s.dropIndex list )

        RotateOut ->
            ( Model Nothing, Operations.rotateOut beforeUpdate s.dragIndex s.dropIndex list )

        Swap ->
            ( Model Nothing, Operations.swap beforeUpdate s.dragIndex s.dropIndex list )

        Unaltered ->
            ( Model Nothing, Operations.unaltered beforeUpdate s.dragIndex s.dropIndex list )


dragEvents : (Msg -> msg) -> Int -> String -> List (Html.Attribute msg)
dragEvents wrap dragIndex dragElementId =
    [ Html.Events.preventDefaultOn "mousedown"
        (Json.Decode.map2 Utils.Position Utils.pageX Utils.pageY
            |> Json.Decode.map (wrap << DragStart dragIndex dragElementId)
            |> Json.Decode.map (\msg -> ( msg, True ))
        )
    ]


dropEvents : (Msg -> msg) -> Int -> String -> List (Html.Attribute msg)
dropEvents wrap dropIndex dropElementId =
    [ Html.Events.onMouseOver (wrap (DragOver dropIndex dropElementId))
    , Html.Events.onMouseEnter (wrap (DragEnter dropIndex))
    , Html.Events.onMouseLeave (wrap DragLeave)
    ]


info : Model -> Maybe Info
info (Model state) =
    Maybe.andThen
        (\s ->
            Maybe.map2
                (\dragElement dropElement ->
                    { dragIndex = s.dragIndex
                    , dropIndex = s.dropIndex
                    , dragElement = dragElement
                    , dropElement = dropElement
                    , dragElementId = s.dragElementId
                    , dropElementId = s.dropElementId
                    }
                )
                s.dragElement
                s.dropElement
        )
        state


ghostStyles : Model -> List (Html.Attribute msg)
ghostStyles (Model state) =
    case state of
        Nothing ->
            []

        Just s ->
            case s.dragElement of
                Just { element } ->
                    [ Html.Attributes.style "position" "absolute"
                    , Html.Attributes.style "left" "0"
                    , Html.Attributes.style "top" "0"
                    , Html.Attributes.style "transform" <|
                        Utils.translate
                            (round (s.currentPosition.x - s.startPosition.x + element.x))
                            (round (s.currentPosition.y - s.startPosition.y + element.y))
                    , Html.Attributes.style "height" (Utils.px (round element.height))
                    , Html.Attributes.style "width" (Utils.px (round element.width))
                    , Html.Attributes.style "pointer-events" "none"
                    ]

                _ ->
                    []


equalGroups : (a -> a -> Bool) -> Int -> Int -> List a -> Bool
equalGroups comparator dragIndex dropIndex list =
    let
        drag : List a
        drag =
            list |> List.drop dragIndex |> List.take 1

        drop : List a
        drop =
            list |> List.drop dropIndex |> List.take 1

        result : List Bool
        result =
            List.map2
                (\dragItem dropItem ->
                    comparator dragItem dropItem
                )
                drag
                drop
    in
    List.foldl (||) False result
