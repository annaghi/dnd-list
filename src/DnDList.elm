module DnDList exposing
    ( System, create
    , Draggable
    , Movement(..)
    , Msg, update
    , getDragIndex
    )

{-| While dragging a list item, the mouse events and the list reordering are handled internally by this module.

First you need to create a `System` object which holds the information and functions related to the drag operation.
Using this object you can wire up the internal model, subscriptions, and commands into your model, subscriptions and commands respectively.
Also you can get access to the drag and drop events as well as the dragged position styles in your `view` functions.

Finally you need to wrap up the internal messages into your message, and pass them along with your sortable list to the internal `DnDList.update` function within your `update` funcion.
The update will return back with the reordered list.


## System

A `System` represents the information about the drag operation and the drag related functions.

@docs System, create


## System Fields


### draggable

@docs Draggable


### subscriptions

`subscriptions` is a function to access browser events during the drag.

    subscriptions : Model -> Sub Msg
    subscriptions model =
        system.subscriptions model.draggable


### commands

`commands` is a function to access the DOM for the dragged element `x`, `y`, `width` and `height` information.

For a more detailed `update` function see [Update](#update)

    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            DnDMsg message ->
                let
                    updatedModel = ...
                in
                ( updatedModel, system.commands model.draggable )


### dragEvents

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


### dropEvents

`dropEvents` is a function which wraps all the events for droppable elements.

    model.items
        |> List.indexedMap
            (\index item ->
                Html.div
                    (system.dropEvents index)
                    [ Html.text item ]
            )
        |> Html.div []


### draggedStyles

`draggedStyles` is a helper to set the current position of the dragged element.
It accepts a `Movement` argument.

    Html.div
        (system.draggedStyles model.draggable DnDList.Free)
        [ Html.text item ]

@docs Movement


## Update

While dragging an item, the mouse events and the list updates are handled internally by this module.

@docs Msg, update


## Helper

@docs getDragIndex

-}

import Browser.Dom
import Browser.Events
import Html
import Html.Attributes
import Html.Events
import Json.Decode
import Task


{-| A `Draggable` represents the information about the current drag operation.
It should be set in your model and can be initialized through the `System`'s `draggable` field.

    type alias Model =
        { draggable : DnDList.Draggable
        , items : List a
        }

    initialModel : Model
    initialModel =
        { draggable = system.draggable
        , items = [...]
        }

-}
type Draggable
    = Draggable (Maybe Model)


type alias Model =
    { dragIndex : Int
    , dropIndex : Int
    , startPosition : Position
    , currentPosition : Position
    , element : Maybe Browser.Dom.Element
    , elementId : String
    }


{-| A `System` encapsulates a `Draggable` which represents the information about the drag operation,
as well as the drag related subscriptions, commands, events and styles.

For the details, see [System Fields](#system-fields)

-}
type alias System m =
    { draggable : Draggable
    , subscriptions : Draggable -> Sub m
    , commands : Draggable -> Cmd m
    , dragEvents : Int -> String -> List (Html.Attribute m)
    , dropEvents : Int -> List (Html.Attribute m)
    , draggedStyles : Draggable -> Movement -> List (Html.Attribute m)
    }


{-| Creates a `System` parametrized with your message wrapper.

    system : DnDList.System Msg
    system =
        DnDList.create DnDMsg

    ...

    type Msg
        = DnDMsg DnDList.Msg

-}
create : (Msg -> m) -> System m
create wrap =
    { draggable = Draggable Nothing
    , subscriptions = subscriptions wrap
    , commands = commands wrap
    , dragEvents = dragEvents wrap
    , dropEvents = dropEvents wrap
    , draggedStyles = draggedStyles
    }


{-| Represents the mouse dragging movement.
Dragging can be restricted to vertical or horizontal axis only, or it can be free.
-}
type Movement
    = Free
    | Horizontal
    | Vertical


type alias Position =
    { x : Int
    , y : Int
    }


{-| Returns the index of the dragged item.

    maybeDragIndex : Maybe Int
    maybeDragIndex =
        DnDList.getDragIndex model.draggable

-}
getDragIndex : Draggable -> Maybe Int
getDragIndex (Draggable model) =
    model
        |> Maybe.andThen
            (\m ->
                m.element
                    |> Maybe.map (\_ -> m.dragIndex)
            )


subscriptions : (Msg -> m) -> Draggable -> Sub m
subscriptions wrap (Draggable model) =
    case model of
        Nothing ->
            Sub.none

        Just _ ->
            Sub.batch
                [ Browser.Events.onMouseMove
                    (Json.Decode.map2 Position pageX pageY
                        |> Json.Decode.map (wrap << Drag)
                    )
                , Browser.Events.onMouseUp
                    (Json.Decode.succeed (wrap DragEnd))
                ]


pageX : Json.Decode.Decoder Int
pageX =
    Json.Decode.field "pageX" Json.Decode.int


pageY : Json.Decode.Decoder Int
pageY =
    Json.Decode.field "pageY" Json.Decode.int


commands : (Msg -> m) -> Draggable -> Cmd m
commands wrap (Draggable model) =
    case model of
        Nothing ->
            Cmd.none

        Just m ->
            case m.element of
                Nothing ->
                    Task.attempt (wrap << GotDragged) (Browser.Dom.getElement m.elementId)

                _ ->
                    Cmd.none


{-| Internal message type.

    type Msg
        = DnDMsg DnDList.Msg

-}
type Msg
    = DragStart Int String Position
    | Drag Position
    | DragOver Int
    | DragEnd
    | GotDragged (Result Browser.Dom.Error Browser.Dom.Element)


{-| Internal update function which returns an updated `Draggable` and the reordered list for your model.

    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            DnDMsg message ->
                let
                    ( draggable, items ) =
                        DnDList.update message model.draggable model.items
                in
                ( { model | draggable = draggable, items = items }
                , system.commands model.draggable
                )

-}
update : Msg -> Draggable -> List a -> ( Draggable, List a )
update msg (Draggable model) list =
    case msg of
        DragStart dragIndex elementId xy ->
            ( Draggable <|
                Just
                    { dragIndex = dragIndex
                    , dropIndex = dragIndex
                    , startPosition = xy
                    , currentPosition = xy
                    , element = Nothing
                    , elementId = elementId
                    }
            , list
            )

        Drag xy ->
            ( model
                |> Maybe.map (\m -> { m | currentPosition = xy })
                |> Draggable
            , list
            )

        DragOver dropIndex ->
            ( model
                |> Maybe.map (\m -> { m | dragIndex = dropIndex, dropIndex = dropIndex })
                |> Draggable
            , reorder model dropIndex list
            )

        DragEnd ->
            ( Draggable Nothing, list )

        GotDragged (Err _) ->
            ( Draggable model, list )

        GotDragged (Ok element) ->
            ( model
                |> Maybe.map (\m -> { m | element = Just element })
                |> Draggable
            , list
            )


reorder : Maybe Model -> Int -> List a -> List a
reorder model dropIndex list =
    case model of
        Just m ->
            if m.dragIndex < dropIndex then
                rotate m.dragIndex dropIndex list

            else if m.dragIndex > dropIndex then
                let
                    n : Int
                    n =
                        List.length list - 1
                in
                List.reverse (rotate (n - m.dragIndex) (n - dropIndex) (List.reverse list))

            else
                list

        Nothing ->
            list


rotate : Int -> Int -> List a -> List a
rotate i j list =
    let
        n : Int
        n =
            List.length list

        beginning : List a
        beginning =
            List.take i list

        middle : List a
        middle =
            list |> List.drop i |> List.take (j - i + 1)

        end : List a
        end =
            list |> List.reverse |> List.take (n - j - 1) |> List.reverse
    in
    beginning ++ rotateRecursive middle ++ end


rotateRecursive : List a -> List a
rotateRecursive list =
    case list of
        [] ->
            []

        [ x ] ->
            [ x ]

        x :: [ y ] ->
            y :: [ x ]

        x :: y :: rest ->
            y :: rotateRecursive (x :: rest)


dragEvents : (Msg -> m) -> Int -> String -> List (Html.Attribute m)
dragEvents wrap dragIndex elementId =
    [ Html.Events.preventDefaultOn "mousedown"
        (Json.Decode.map2 Position pageX pageY
            |> Json.Decode.map (wrap << DragStart dragIndex elementId)
            |> Json.Decode.map (\msg -> ( msg, True ))
        )
    ]


dropEvents : (Msg -> m) -> Int -> List (Html.Attribute m)
dropEvents wrap dropIndex =
    [ Html.Events.preventDefaultOn "mouseover"
        (Json.Decode.succeed (wrap (DragOver dropIndex))
            |> Json.Decode.map (\msg -> ( msg, True ))
        )
    ]


draggedStyles : Draggable -> Movement -> List (Html.Attribute m)
draggedStyles (Draggable model) movement =
    case model of
        Nothing ->
            []

        Just m ->
            case m.element of
                Just { element } ->
                    case movement of
                        Horizontal ->
                            [ Html.Attributes.style "position" "absolute"
                            , Html.Attributes.style "top" "0"
                            , Html.Attributes.style "left" "0"
                            , Html.Attributes.style "transform" <|
                                translate
                                    (m.currentPosition.x - m.startPosition.x + round element.x)
                                    (round element.y)
                            , Html.Attributes.style "height" (px (round element.height))
                            , Html.Attributes.style "width" (px (round element.width))
                            , Html.Attributes.style "pointer-events" "none"
                            ]

                        Vertical ->
                            [ Html.Attributes.style "position" "absolute"
                            , Html.Attributes.style "left" "0"
                            , Html.Attributes.style "top" "0"
                            , Html.Attributes.style "transform" <|
                                translate
                                    (round element.x)
                                    (m.currentPosition.y - m.startPosition.y + round element.y)
                            , Html.Attributes.style "height" (px (round element.height))
                            , Html.Attributes.style "width" (px (round element.width))
                            , Html.Attributes.style "pointer-events" "none"
                            ]

                        Free ->
                            [ Html.Attributes.style "position" "absolute"
                            , Html.Attributes.style "left" "0"
                            , Html.Attributes.style "top" "0"
                            , Html.Attributes.style "transform" <|
                                translate
                                    (m.currentPosition.x - m.startPosition.x + round element.x)
                                    (m.currentPosition.y - m.startPosition.y + round element.y)
                            , Html.Attributes.style "height" (px (round element.height))
                            , Html.Attributes.style "width" (px (round element.width))
                            , Html.Attributes.style "pointer-events" "none"
                            ]

                _ ->
                    []


px : Int -> String
px n =
    String.fromInt n ++ "px"


translate : Int -> Int -> String
translate x y =
    "translate3d(" ++ px x ++ ", " ++ px y ++ ", 0)"
