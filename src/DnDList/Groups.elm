module DnDList.Groups exposing
    ( System, create, Config
    , Msg
    , Operation(..), Movement(..), Trigger(..)
    , Draggable, Info
    )

{-| While dragging a list item, the mouse events and the list sorting are handled internally by this module.

First you need to create a `System` object which holds the information and functions related to the drag operation.

Using this object you can wire up the internal model, subscriptions, commands, and update into your model, subscriptions, commands, and update respectively.

You have access to the drag and drop events as well as the position styles of the dragged element in your `view` functions.
Also you have access to the drag and drop index which allows you to style or track the affected elements.


# System

@docs System, create, Config


# Message

@docs Msg


# Config

@docs Operation, Movement, Trigger


# System Fields


## draggable

@docs Draggable, Info


## subscriptions

`subscriptions` is a function to access browser events during the drag.

    subscriptions : Model -> Sub Msg
    subscriptions model =
        system.subscriptions model.draggable


## commands

`commands` is a function to access the DOM for the dragged element `x`, `y`, `width` and `height` information.

    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            MyMsg message ->
                let
                    updatedModel = ...
                in
                ( updatedModel
                , system.commands model.draggable
                )


## update

`update` is a function which returns an updated `Draggable` and the sorted list for your model.

    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            MyMsg message ->
                let
                    ( draggable, items ) =
                        system.update message model.draggable model.items
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
                    (Html.Attributes.id itemId :: system.dragEvents index itemId)
                    [ Html.text item ]
            )
        |> Html.div []


## dropEvents

`dropEvents` is a function which wraps all the events for droppable elements.

    model.items
        |> List.indexedMap
            (\index item ->
                Html.div
                    (system.dropEvents index)
                    [ Html.text item ]
            )
        |> Html.div []


## dragIndex

`dragIndex` is a helper which returns the index of the dragged element.

    maybeDragIndex : Maybe Int
    maybeDragIndex =
        system.dragIndex model.draggable


## dropIndex

`dropIndex` is a helper which returns the index of the item that the dragged element was dropped on.

    maybeDropIndex : Maybe Int
    maybeDropIndex =
        system.dropIndex model.draggable


## sourceElement

`sourceElement` is a helper which returns `Browser.Dom.Element` information of the dragged element.

    TODO : example code


## draggedStyles

`draggedStyles` is a helper which returns the position related styles of the dragged element.
The position is absolute to the `body` tag.

    Html.div
        (system.draggedStyles model.draggable)
        [ Html.text item ]

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


{-| A `Draggable` represents the information about the current drag operation.
It should be set in your model and can be initialized through the `System`'s `draggable` field.

    type alias Model =
        { draggable : DnDList.Draggable
        , items : List Fruit
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


{-| A `System` encapsulates a `Draggable` which represents the information about the drag operation and the drag related functions.

For the details, see [System Fields](#system-fields)

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


type alias Info =
    { dragIndex : Int
    , dropIndex : Int
    , sourceElement : Browser.Dom.Element
    , sourceElementId : String
    , targetElement : Browser.Dom.Element
    , targetElementId : String
    }


{-| Creates a `System` object according to your configuration.

Having a list of fruits:

    type alias Fruit =
        String

    data : List Fruit
    data =
        [ "Apples", "Bananas", "Cherries", "Dates" ]

The `System` is a wrapper type around your message and list item types:

    system : DnDList.System Msg Fruit
    system =
        DnDList.create config

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

  - `message`: Your message wrapper.

  - `movement`: The kind of the `Movement`. It can be Free, Horizontal, or Vertical.

Example configuration:

    config : DnDList.Config Msg
    config =
        { message = MyMsg
        , movement = DnDList.Free DnDList.RotateOut DnDList.OnDrag
        }

-}
type alias Config a =
    { movement : Movement
    , trigger : Trigger
    , operation : Operation
    , beforeUpdate : Int -> Int -> List a -> List a
    , groups : Groups a
    }


type alias Groups a =
    { comparator : a -> a -> Bool
    , operation : Operation
    , beforeUpdate : Int -> Int -> List a -> List a
    }


{-| Represents the mouse dragging movement.
Dragging can be restricted to vertical or horizontal axis only, or it can be free.
-}
type Movement
    = Free
    | Horizontal
    | Vertical


{-| Represents the list sorting operation.

  - `InsertAfter`: The dragged element will be inserted after the drop target element.

  - `InsertBefore`: The dragged element will be inserted before the drop target element.

  - `RotateIn`: The items between the dragged and the drop target elements will be circularly shifted.

  - `RotateOut`: The items between the dragged and the drop target elements will be circularly shifted.

  - `Swap`: The dragged and the drop target elements will be swapped, and no other item will be moved.

-}
type Operation
    = InsertAfter
    | InsertBefore
    | RotateIn
    | RotateOut
    | Swap
    | Unmove


{-| Represents the event when the list will be sorted.

  - `OnDrag`: Triggers the list update when the dragged element is dragging over a drop target element.

  - `OnDrop`: Triggers the list update when the dragged element is dropped on a drop target element.

-}
type Trigger
    = OnDrag
    | OnDrop


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
            if m.dragIndex /= m.dropIndex then
                Task.attempt (wrap << GotTargetElement) (Browser.Dom.getElement m.targetElementId)

            else
                Cmd.none


{-| Internal message type. You should wrap it within your message constructor.

    type Msg
        = MyMsg DnDList.Msg

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
                    ( Draggable model, list )

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
