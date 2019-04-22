module DnDList.Groups exposing
    ( System, create, Msg
    , Config
    , Movement(..), Trigger(..), Operation(..)
    , Info
    , Draggable
    )

{-| If the list is groupable by a certain property, the items can be transferred between those groups.
This module does not use drop zones, instead it uses a list prepared with auxiliary items.
Check the [demo](https://annaghi.github.io/dnd-list/introduction/groups) or the [configuration](https://annaghi.github.io/dnd-list/configuration/groups).

This module is an extended version of the DnDList module.
The `Config` is extended with the `groups` field,
and the internal sorting distinguishes between the sort operation performed on items from the same group, and the sort operation performed on items from different groups.


# System

@docs System, create, Msg


# Config

@docs Config
@docs Movement, Trigger, Operation


# Info

@docs Info


# System Fields


## draggable

@docs Draggable


## subscriptions

`subscriptions` is a function to access browser events during the drag.

    subscriptions : Model -> Sub Msg
    subscriptions model =
        system.subscriptions model.draggable


## commands

`commands` is a function to access the DOM for the drag source and the drop target `x`, `y`, `width` and `height` information.

    update : Msg -> Model -> ( Model, Cmd Msg )
    update message model =
        case message of
            MyMsg msg ->
                let
                    updatedModel = ...
                in
                ( updatedModel
                , system.commands model.draggable
                )


## update

`update` is a function which returns an updated `Draggable` and the sorted list for your model.

    update : Msg -> Model -> ( Model, Cmd Msg )
    update message model =
        case message of
            MyMsg msg ->
                let
                    ( draggable, items ) =
                        system.update msg model.draggable model.items
                in
                ( { model | draggable = draggable, items = items }
                , system.commands model.draggable
                )


## dragEvents

`dragEvents` is a function which wraps all the events for draggable elements.

    model.items
        |> List.indexedMap
            (\index item ->
                let
                    itemId : String
                    itemId =
                        "id-" ++ item
                in
                Html.div
                    (Html.Attributes.id itemId
                        :: system.dragEvents index itemId
                    )
                    [ Html.text item ]
            )
        |> Html.div []


## dropEvents

`dropEvents` is a function which wraps all the events for droppable elements.

    model.items
        |> List.indexedMap
            (\index item ->
                let
                    itemId : String
                    itemId =
                        "id-" ++ item
                in
                Html.div
                    (Html.Attributes.id itemId
                        :: system.dropEvents index itemId
                    )
                    [ Html.text item ]
            )
        |> Html.div []


## draggedStyles

`draggedStyles` is a helper which returns the positioning styles of the dragged element.
The position is absolute to the `body` HTML element.

    Html.div
        (system.draggedStyles model.draggable)
        [ Html.text item ]


## info

See [Info](#info)

-}

import Browser.Dom
import Browser.Events
import DnDList.Utils
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Operations
import Task
import Utils


{-| A `Draggable` represents the internal information about the current drag operation.
It should be set in your model and can be initialized through the `System`'s `draggable` field.

    type alias Model =
        { draggable : DnDList.Groups.Draggable
        , items : List Item
        }

    initialModel : Model
    initialModel =
        { draggable = system.draggable
        , items = data
        }

-}
type Draggable
    = Draggable (Maybe Model)


type alias Model =
    { dragIndex : Int
    , dropIndex : Int
    , dragCounter : Int
    , startPosition : Position
    , currentPosition : Position
    , sourceElement : Maybe Browser.Dom.Element
    , sourceElementId : String
    , targetElement : Maybe Browser.Dom.Element
    , targetElementId : String
    }


{-| A `System` encapsulates a `Draggable` which is the internal model of the drag operation, some drag related functions and an `Info` object.

For the details, see [System Fields](#system-fields) and [Info](#info)

-}
type alias System a msg =
    { draggable : Draggable
    , subscriptions : Draggable -> Sub msg
    , commands : Draggable -> Cmd msg
    , update : Msg -> Draggable -> List a -> ( Draggable, List a )
    , dragEvents : Int -> String -> List (Html.Attribute msg)
    , dropEvents : Int -> String -> List (Html.Attribute msg)
    , draggedStyles : Draggable -> List (Html.Attribute msg)
    , info : Draggable -> Maybe Info
    }


{-| Information about the drag source and the drop target elements.
It is accessible through the `System`'s `info` field.

  - `dragIndex`: The index of the drag source.

  - `dropIndex`: The index of the drop target.

  - `sourceElement`: Information about the drag source, see `Browser.Dom.Element`.

  - `sourceElementId`: HTML id of the drag source.

  - `targetElement`: Information about the drop target, see `Browser.Dom.Element`.

  - `targetElementId`: HTML id of the drop target.

```
itemView : Html.Html Msg
itemView =
    ...

    case system.info draggable of
        Just { dragIndex } ->
            -- Render when dragging is performed.

        Nothing ->
            -- Render when there is no dragging.
```

    maybeDraggedItem : Maybe Item
    maybeDraggedItem =
        system.info draggable
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
    , sourceElement : Browser.Dom.Element
    , sourceElementId : String
    , targetElement : Browser.Dom.Element
    , targetElementId : String
    }


{-| Creates a `System` object according to your configuration.

Let's have two groups:

    type Group
        = Top
        | Bottom

and a list which is gathered by these groups and prepared with auxiliary items:

    type alias Item =
        { group : Group
        , value : String
        , color : String
        }

    data : List Item
    data =
        [ Item Top "C" blue
        , Item Top "2" red
        , Item Top "1" red
        , Item Top "" transparent
        , Item Bottom "A" blue
        , Item Bottom "D" blue
        , Item Bottom "3" red
        , Item Bottom "B" blue
        , Item Bottom "4" red
        , Item Bottom "" transparent
        ]

The auxiliary items (the `transparent` ones) separate the groups and they can be considered as headers or footers of a particular group.
In this case they are footers.

This setup obeys the list state invariant - you should hold the following rules always true:

  - the items have to be gathered by the grouping property
  - the auxiliary items have to keep their places (header or footer)

The `System` is a wrapper type around the list item and your message types:

    system : DnDList.Groups.System Item Msg
    system =
        DnDList.Groups.create config MyMsg

-}
create : Config a -> (Msg -> msg) -> System a msg
create config message =
    { draggable = Draggable Nothing
    , subscriptions = subscriptions message
    , commands = commands message
    , update = update config
    , dragEvents = dragEvents message
    , dropEvents = dropEvents message
    , draggedStyles = draggedStyles config.movement
    , info = info
    }


{-| Represents the `System` configuration.

  - `movement`: Dragging can be constrained to horizontal or vertical only, or can be set to free.

  - `trigger`: Sorting can be triggered again and again while dragging over the drop targets, or it can be triggered only once on that drop target where the mouse was finally released.

  - `operation`: The sort operation performed on the items from the same group.

  - `beforeUpdate`: This is a hook and gives you access to the list before the sort is being performed on the items from the same group.

  - `groups`: The grouping related configuration:
      - `comparator`: Function which compares two items by the grouping property.
      - `operation`: The sort operation performed on the items from different groups.
      - `beforeUpdate`: This is a hook and gives you access to the list before the sort is being performed on the items from different groups.

Example configuration:

    config : DnDList.Groups.Config Item
    config =
        { movement = DnDList.Groups.Free
        , trigger = DnDList.Groups.OnDrag
        , operation = DnDList.Groups.RotateOut
        , beforeUpdate = \_ _ list -> list
        , groups =
            { comparator = compareByGroup
            , operation = DnDList.Groups.InsertBefore
            , beforeUpdate = updateOnGroupChange
            }
        }

    compareByGroup : Item -> Item -> Bool
    compareByGroup dragItem dropItem =
        -- check whether the two groups are the same

    updateOnGroupChange : Int -> Int -> List Item -> List Item
    updateOnGroupChange dragIndex dropIndex list =
        -- update the group field of the dragged item

-}
type alias Config a =
    { movement : Movement
    , trigger : Trigger
    , operation : Operation
    , beforeUpdate : Int -> Int -> List a -> List a
    , groups :
        { comparator : a -> a -> Bool
        , operation : Operation
        , beforeUpdate : Int -> Int -> List a -> List a
        }
    }


{-| Represents the mouse dragging movement.
Dragging can be restricted to vertical or horizontal axis only, or it can be free.
See them in action: [compare movement](https://annaghi.github.io/dnd-list/configuration/movement).
-}
type Movement
    = Free
    | Horizontal
    | Vertical


{-| Represents the event when the list will be sorted.

  - `OnDrag`: Triggers the list update when the dragged element is dragging over a drop target element.

  - `OnDrop`: Triggers the list update when the dragged element is dropped on a drop target element.

-}
type Trigger
    = OnDrag
    | OnDrop


{-| Represents the list sorting operation.
See them in action: [triggering on drag](https://annaghi.github.io/dnd-list/configuration/operations-drag) and [triggering on drop](https://annaghi.github.io/dnd-list/configuration/operations-drag).

  - `InsertAfter`: The dragged element will be inserted after the drop target element.

  - `InsertBefore`: The dragged element will be inserted before the drop target element.

  - `RotateIn`: The items between the drag source and the drop target will be circularly shifted, excluding the drop target.

  - `RotateOut`: The items between the drag source and the drop target will be circularly shifted, including the drop target.

  - `Swap`: The drag source and the drop target will be swapped.

  - `Unmove`: No item will be moved.

-}
type Operation
    = InsertAfter
    | InsertBefore
    | RotateIn
    | RotateOut
    | Swap
    | Unmove


type alias Position =
    { x : Float
    , y : Float
    }


subscriptions : (Msg -> msg) -> Draggable -> Sub msg
subscriptions wrap (Draggable model) =
    case model of
        Nothing ->
            Sub.none

        Just _ ->
            Sub.batch
                [ Browser.Events.onMouseMove
                    (Json.Decode.map2 Position Utils.pageX Utils.pageY
                        |> Json.Decode.map (wrap << Drag)
                    )
                , Browser.Events.onMouseUp
                    (Json.Decode.succeed (wrap DragEnd))
                ]


commands : (Msg -> msg) -> Draggable -> Cmd msg
commands wrap draggable =
    Cmd.batch
        [ sourceCommands wrap draggable
        , targetCommands wrap draggable
        ]


sourceCommands : (Msg -> msg) -> Draggable -> Cmd msg
sourceCommands wrap (Draggable model) =
    case model of
        Nothing ->
            Cmd.none

        Just m ->
            case m.sourceElement of
                Nothing ->
                    Task.attempt (wrap << GotSourceElement) (Browser.Dom.getElement m.sourceElementId)

                _ ->
                    Cmd.none


targetCommands : (Msg -> msg) -> Draggable -> Cmd msg
targetCommands wrap (Draggable model) =
    case model of
        Nothing ->
            Cmd.none

        Just m ->
            if m.dragCounter == 0 then
                Task.attempt (wrap << GotTargetElement) (Browser.Dom.getElement m.targetElementId)

            else
                Cmd.none


{-| Internal message type. You should wrap it within your message constructor.

    type Msg
        = MyMsg DnDList.Groups.Msg

-}
type Msg
    = DragStart Int String Position
    | Drag Position
    | DragOver Int String
    | DragEnter Int
    | DragLeave
    | DragEnd
    | GotSourceElement (Result Browser.Dom.Error Browser.Dom.Element)
    | GotTargetElement (Result Browser.Dom.Error Browser.Dom.Element)


update : Config a -> Msg -> Draggable -> List a -> ( Draggable, List a )
update { operation, trigger, beforeUpdate, groups } msg (Draggable model) list =
    case msg of
        DragStart dragIndex sourceElementId xy ->
            ( Draggable <|
                Just
                    { dragIndex = dragIndex
                    , dropIndex = dragIndex
                    , dragCounter = 0
                    , startPosition = xy
                    , currentPosition = xy
                    , sourceElement = Nothing
                    , sourceElementId = sourceElementId
                    , targetElement = Nothing
                    , targetElementId = sourceElementId
                    }
            , list
            )

        Drag xy ->
            ( model
                |> Maybe.map (\m -> { m | currentPosition = xy, dragCounter = m.dragCounter + 1 })
                |> Draggable
            , list
            )

        DragOver dropIndex targetElementId ->
            ( model
                |> Maybe.map (\m -> { m | dropIndex = dropIndex, targetElementId = targetElementId })
                |> Draggable
            , list
            )

        DragEnter dropIndex ->
            case ( model, trigger ) of
                ( Just m, OnDrag ) ->
                    if m.dragCounter > 1 && m.dragIndex /= dropIndex then
                        if DnDList.Utils.equalGroups groups.comparator m.dragIndex dropIndex list then
                            onDragUpdate dropIndex m operation beforeUpdate list

                        else
                            onDragUpdate dropIndex m groups.operation groups.beforeUpdate list

                    else
                        ( Draggable model, list )

                _ ->
                    ( model
                        |> Maybe.map (\m -> { m | dragCounter = 0 })
                        |> Draggable
                    , list
                    )

        DragLeave ->
            ( model
                |> Maybe.map (\m -> { m | dropIndex = m.dragIndex })
                |> Draggable
            , list
            )

        DragEnd ->
            case ( model, trigger ) of
                ( Just m, OnDrop ) ->
                    if m.dragIndex /= m.dropIndex then
                        if DnDList.Utils.equalGroups groups.comparator m.dragIndex m.dropIndex list then
                            onDropUpdate m operation beforeUpdate list

                        else
                            onDropUpdate m groups.operation groups.beforeUpdate list

                    else
                        ( Draggable Nothing, list )

                _ ->
                    ( Draggable Nothing, list )

        GotSourceElement (Err _) ->
            ( Draggable model, list )

        GotSourceElement (Ok sourceElement) ->
            ( model
                |> Maybe.map (\m -> { m | sourceElement = Just sourceElement, targetElement = Just sourceElement })
                |> Draggable
            , list
            )

        GotTargetElement (Err _) ->
            ( Draggable model, list )

        GotTargetElement (Ok targetElement) ->
            ( model
                |> Maybe.map (\m -> { m | targetElement = Just targetElement })
                |> Draggable
            , list
            )


onDragUpdate : Int -> Model -> Operation -> (Int -> Int -> List a -> List a) -> List a -> ( Draggable, List a )
onDragUpdate dropIndex m operation beforeUpdate list =
    case operation of
        InsertAfter ->
            ( Draggable
                (Just
                    { m
                        | dragIndex =
                            if m.dragIndex > dropIndex then
                                dropIndex + 1

                            else
                                dropIndex
                        , dragCounter = 0
                    }
                )
            , Operations.insertAfter beforeUpdate m.dragIndex dropIndex list
            )

        InsertBefore ->
            ( Draggable <|
                Just
                    { m
                        | dragIndex =
                            if m.dragIndex < dropIndex then
                                dropIndex - 1

                            else
                                dropIndex
                        , dragCounter = 0
                    }
            , Operations.insertBefore beforeUpdate m.dragIndex dropIndex list
            )

        RotateIn ->
            ( Draggable
                (Just
                    { m
                        | dragIndex =
                            if m.dragIndex < dropIndex then
                                dropIndex - 1

                            else if m.dragIndex > dropIndex then
                                dropIndex + 1

                            else
                                dropIndex
                        , dragCounter = 0
                    }
                )
            , Operations.rotateIn beforeUpdate m.dragIndex dropIndex list
            )

        RotateOut ->
            ( Draggable (Just { m | dragIndex = dropIndex, dragCounter = 0 })
            , Operations.rotateOut beforeUpdate m.dragIndex dropIndex list
            )

        Swap ->
            ( Draggable (Just { m | dragIndex = dropIndex, dragCounter = 0 })
            , Operations.swap beforeUpdate m.dragIndex dropIndex list
            )

        Unmove ->
            ( Draggable (Just { m | dragCounter = 0 })
            , Operations.unmove beforeUpdate m.dragIndex dropIndex list
            )


onDropUpdate : Model -> Operation -> (Int -> Int -> List a -> List a) -> List a -> ( Draggable, List a )
onDropUpdate m operation beforeUpdate list =
    case operation of
        InsertAfter ->
            ( Draggable Nothing, Operations.insertAfter beforeUpdate m.dragIndex m.dropIndex list )

        InsertBefore ->
            ( Draggable Nothing, Operations.insertBefore beforeUpdate m.dragIndex m.dropIndex list )

        RotateIn ->
            ( Draggable Nothing, Operations.rotateIn beforeUpdate m.dragIndex m.dropIndex list )

        RotateOut ->
            ( Draggable Nothing, Operations.rotateOut beforeUpdate m.dragIndex m.dropIndex list )

        Swap ->
            ( Draggable Nothing, Operations.swap beforeUpdate m.dragIndex m.dropIndex list )

        Unmove ->
            ( Draggable Nothing, Operations.unmove beforeUpdate m.dragIndex m.dropIndex list )


dragEvents : (Msg -> msg) -> Int -> String -> List (Html.Attribute msg)
dragEvents wrap dragIndex sourceElementId =
    [ Html.Events.preventDefaultOn "mousedown"
        (Json.Decode.map2 Position Utils.pageX Utils.pageY
            |> Json.Decode.map (wrap << DragStart dragIndex sourceElementId)
            |> Json.Decode.map (\msg -> ( msg, True ))
        )
    ]


dropEvents : (Msg -> msg) -> Int -> String -> List (Html.Attribute msg)
dropEvents wrap dropIndex targetElementId =
    [ Html.Events.onMouseOver (wrap (DragOver dropIndex targetElementId))
    , Html.Events.onMouseEnter (wrap (DragEnter dropIndex))
    , Html.Events.onMouseLeave (wrap DragLeave)
    ]


info : Draggable -> Maybe Info
info (Draggable model) =
    Maybe.andThen
        (\m ->
            Maybe.map2
                (\source target ->
                    { dragIndex = m.dragIndex
                    , dropIndex = m.dropIndex
                    , sourceElement = source
                    , sourceElementId = m.sourceElementId
                    , targetElement = target
                    , targetElementId = m.targetElementId
                    }
                )
                m.sourceElement
                m.targetElement
        )
        model


draggedStyles : Movement -> Draggable -> List (Html.Attribute msg)
draggedStyles movement (Draggable model) =
    case model of
        Nothing ->
            []

        Just m ->
            case m.sourceElement of
                Just { element } ->
                    case movement of
                        Horizontal ->
                            [ Html.Attributes.style "position" "absolute"
                            , Html.Attributes.style "top" "0"
                            , Html.Attributes.style "left" "0"
                            , Html.Attributes.style "transform" <|
                                Utils.translate
                                    (round (m.currentPosition.x - m.startPosition.x + element.x))
                                    (round element.y)
                            , Html.Attributes.style "height" (Utils.px (round element.height))
                            , Html.Attributes.style "width" (Utils.px (round element.width))
                            , Html.Attributes.style "pointer-events" "none"
                            ]

                        Vertical ->
                            [ Html.Attributes.style "position" "absolute"
                            , Html.Attributes.style "left" "0"
                            , Html.Attributes.style "top" "0"
                            , Html.Attributes.style "transform" <|
                                Utils.translate
                                    (round element.x)
                                    (round (m.currentPosition.y - m.startPosition.y + element.y))
                            , Html.Attributes.style "height" (Utils.px (round element.height))
                            , Html.Attributes.style "width" (Utils.px (round element.width))
                            , Html.Attributes.style "pointer-events" "none"
                            ]

                        Free ->
                            [ Html.Attributes.style "position" "absolute"
                            , Html.Attributes.style "left" "0"
                            , Html.Attributes.style "top" "0"
                            , Html.Attributes.style "transform" <|
                                Utils.translate
                                    (round (m.currentPosition.x - m.startPosition.x + element.x))
                                    (round (m.currentPosition.y - m.startPosition.y + element.y))
                            , Html.Attributes.style "height" (Utils.px (round element.height))
                            , Html.Attributes.style "width" (Utils.px (round element.width))
                            , Html.Attributes.style "pointer-events" "none"
                            ]

                _ ->
                    []
