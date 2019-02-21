module DnDList exposing
    ( System, create, Config
    , Msg
    , Movement(..)
    , Draggable
    )

{-| While dragging a list item, the mouse events and the list reordering are handled internally by this module.

First you need to create a `System` object which holds the information and functions related to the drag operation.

Using this object you can wire up the internal model, subscriptions, commands, and update into your model, subscriptions, commands, and update respectively.
Also you can get access to the drag and drop events as well as the dragged position styles in your `view` functions.


# System

@docs System, create, Config


# Message

@docs Msg


# Movement

@docs Movement


# System Fields


## draggable

@docs Draggable


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

`update` is a function which returns an updated `Draggable` and the reordered list for your model.

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


## draggedIndex

`draggedIndex` is a helper which returns the index of the dragged element.

    maybeDraggedIndex : Maybe Int
    maybeDraggedIndex =
        system.draggedIndex model.draggable


## draggedStyles

`draggedStyles` is a helper to set the current position of the dragged element.

    Html.div
        (system.draggedStyles model.draggable)
        [ Html.text item ]

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
    , startPosition : Position
    , currentPosition : Position
    , element : Maybe Browser.Dom.Element
    , elementId : String
    }


{-| A `System` encapsulates a `Draggable` which represents the information about the drag operation and the drag related functions.

For the details, see [System Fields](#system-fields)

-}
type alias System m a =
    { draggable : Draggable
    , subscriptions : Draggable -> Sub m
    , commands : Draggable -> Cmd m
    , update : Msg -> Draggable -> List a -> ( Draggable, List a )
    , dragEvents : Int -> String -> List (Html.Attribute m)
    , dropEvents : Int -> List (Html.Attribute m)
    , draggedIndex : Draggable -> Maybe Int
    , draggedStyles : Draggable -> List (Html.Attribute m)
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
create : Config m -> System m a
create { message, movement } =
    { draggable = Draggable Nothing
    , subscriptions = subscriptions message
    , commands = commands message
    , update = update
    , dragEvents = dragEvents message
    , dropEvents = dropEvents message
    , draggedIndex = draggedIndex
    , draggedStyles = draggedStyles movement
    }


{-| Represents the `System` configuration.

  - `message`: your message wrapper

  - `movement`: the kind of the `Movement`. It can be Free, Horizontal, or Vertical.

Example configuration:

    config : DnDList.Config Msg
    config =
        { message = MyMsg
        , movement = DnDList.Free
        }

-}
type alias Config m =
    { message : Msg -> m
    , movement : Movement
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


{-| Internal message type. You should wrap it within your message constructor.

    type Msg
        = MyMsg DnDList.Msg

-}
type Msg
    = DragStart Int String Position
    | Drag Position
    | DragOver Int
    | DragEnd
    | GotDragged (Result Browser.Dom.Error Browser.Dom.Element)


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


pageX : Json.Decode.Decoder Int
pageX =
    Json.Decode.field "pageX" Json.Decode.int


pageY : Json.Decode.Decoder Int
pageY =
    Json.Decode.field "pageY" Json.Decode.int


draggedIndex : Draggable -> Maybe Int
draggedIndex (Draggable model) =
    model
        |> Maybe.andThen
            (\m ->
                m.element
                    |> Maybe.map (\_ -> m.dragIndex)
            )


draggedStyles : Movement -> Draggable -> List (Html.Attribute m)
draggedStyles movement (Draggable model) =
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
