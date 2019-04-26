module DnDList exposing
    ( System, create, Msg
    , Config
    , Movement(..), Trigger(..), Operation(..)
    , Info
    , Model
    )

{-| While dragging and dropping a list item, the mouse events and the list sorting are handled internally by this module.
Here is a [basic demo](https://annaghi.github.io/dnd-list/introduction/basic),
we will refer to it throughout this page.

First, we need to create a `System` object which holds all the information related to the drag and drop features.
Using this object we can wire up the internal model, subscriptions, commands, and update
into our model, subscriptions, commands, and update respectively.

Second, when we write our `view` functions, we will need to bind the drag and drop events to the list items.
These events are provided by the very same `System` object
as well as the information about the drag source and the drop target items,
which will allow us to style or track the affected items.

Finally, we need to render a ghost element to be used for dragging display.
The `System` object gives us access to the ghost element's position styles too.


# System

@docs System, create, Msg


# Config

@docs Config
@docs Movement, Trigger, Operation


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

    itemView : DnDList.Model -> Int -> Fruit -> Html.Html Msg
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


## dropEvents

`dropEvents` is a function which wraps all the events up for the drop target items.

    itemView : DnDList.Model -> Int -> Fruit -> Html.Html Msg
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

    ghostView : DnDList.Model -> List Fruit -> Html.Html Msg
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


{-| Represents the internal model of the current drag and drop features.
We can set it in our model and initialize through the `System`'s `model` field.
It will be `Nothing` if there is no ongoing dragging.

    type alias Model =
        { dnd : DnDList.Model
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

Suppose we have a list of fruits:

    type alias Fruit =
        String

    data : List Fruit
    data =
        [ "Apples", "Bananas", "Cherries", "Dates" ]

Now the `System` is a wrapper type around the list item and our message types:

    system : DnDList.System Fruit Msg
    system =
        DnDList.create config MyMsg

-}
create : Config a -> (Msg -> msg) -> System a msg
create config message =
    { model = Model Nothing
    , subscriptions = subscriptions message
    , commands = commands message
    , update = update config
    , dragEvents = dragEvents message
    , dropEvents = dropEvents message
    , ghostStyles = ghostStyles config.movement
    , info = info
    }


{-| Represents the `System` configuration.

  - `movement`: Dragging can be constrained to horizontal or vertical axis only, or it can be set to free.
    This [demo config](https://annaghi.github.io/dnd-list/configuration/movement) shows the different movements in action.

  - `trigger`: Sorting can be triggered again and again while dragging over the drop target items,
    or it can be triggered only once on that drop target where the mouse was finally released.

  - `operation`: Different kinds of sort operations can be performed on the list.
    There are two comparisons - one for
    [triggered on drag](https://annaghi.github.io/dnd-list/configuration/operations-drag)
    and one for [triggered on drop](https://annaghi.github.io/dnd-list/configuration/operations-drop).

  - `beforeUpdate`: This is a hook and gives us access to the list before the sort will be performed.

Here is an example configuration with a void `beforeUpdate`:

    config : DnDList.Config Fruit
    config =
        { movement = DnDList.Free
        , trigger = DnDList.OnDrag
        , operation = DnDList.RotateOut
        , beforeUpdate = \_ _ list -> list
        }

-}
type alias Config a =
    { movement : Movement
    , trigger : Trigger
    , operation : Operation
    , beforeUpdate : Int -> Int -> List a -> List a
    }


{-| Represents the mouse dragging movement.
This [demo config](https://annaghi.github.io/dnd-list/configuration/movement) shows the different movements in action.

  - `Free` : The ghost element moves as the mouse moves.

  - `Horizontal` : The ghost element can only move horizontally.

  - `Vertical` : The ghost element can only move vertically.

-}
type Movement
    = Free
    | Horizontal
    | Vertical


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

Checking the `Info` object we can decide what to render when there is an ongoing dragging,
and what to render when there is no dragging:

    itemView : DnDList.Model -> Int -> Fruit -> Html.Html Msg
    itemView dnd index item =
        ...

        case system.info dnd of
            Just _ ->
                -- Render when there is an ongoing dragging.

            Nothing ->
                -- Render when there is no dragging.

Or we can get e.g. the drag source item:

    maybeDragItem : DnDList.Model -> List Fruit -> Maybe Fruit
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
        = MyMsg DnDList.Msg

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
update { operation, trigger, beforeUpdate } msg (Model state) list =
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
            case ( state, trigger ) of
                ( Just s, OnDrag ) ->
                    if s.dragCounter > 1 && s.dragIndex /= dropIndex then
                        onDragUpdate dropIndex s operation beforeUpdate list

                    else
                        ( Model state, list )

                _ ->
                    ( state
                        |> Maybe.map (\s -> { s | dragCounter = 0 })
                        |> Model
                    , list
                    )

        DragLeave ->
            ( state
                |> Maybe.map (\s -> { s | dropIndex = s.dragIndex })
                |> Model
            , list
            )

        DragEnd ->
            case ( state, trigger ) of
                ( Just s, OnDrop ) ->
                    if s.dragIndex /= s.dropIndex then
                        onDropUpdate s operation beforeUpdate list

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


ghostStyles : Movement -> Model -> List (Html.Attribute msg)
ghostStyles movement (Model state) =
    case state of
        Nothing ->
            []

        Just s ->
            case s.dragElement of
                Just { element } ->
                    case movement of
                        Horizontal ->
                            [ Html.Attributes.style "position" "absolute"
                            , Html.Attributes.style "top" "0"
                            , Html.Attributes.style "left" "0"
                            , Html.Attributes.style "transform" <|
                                Utils.translate
                                    (round (s.currentPosition.x - s.startPosition.x + element.x))
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
                                    (round (s.currentPosition.y - s.startPosition.y + element.y))
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
                                    (round (s.currentPosition.x - s.startPosition.x + element.x))
                                    (round (s.currentPosition.y - s.startPosition.y + element.y))
                            , Html.Attributes.style "height" (Utils.px (round element.height))
                            , Html.Attributes.style "width" (Utils.px (round element.width))
                            , Html.Attributes.style "pointer-events" "none"
                            ]

                _ ->
                    []
