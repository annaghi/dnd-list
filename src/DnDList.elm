module DnDList exposing
    ( System, create, Config
    , Msg
    , Movement(..), Operation(..), Trigger(..)
    , Draggable
    )

{-| While dragging a list item, the mouse events and the list reordering are handled internally by this module.

First you need to create a `System` object which holds the information and functions related to the drag operation.

Using this object you can wire up the internal model, subscriptions, commands, and update into your model, subscriptions, commands, and update respectively.

You have access to the drag and drop events as well as the position styles of the dragged element in your `view` functions.
Also you have access to the drag and drop index which allows you to style or track the affected elements.


# System

@docs System, create, Config


# Message

@docs Msg


# Movement

@docs Movement, Operation, Trigger


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


## draggedStyles

`draggedStyles` is a helper to set the current position of the dragged element.
The position is absolute to the `body` tag.

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
    { dragIdx : Int
    , dropIdx : Int
    , startPosition : Position
    , currentPosition : Position
    , element : Maybe Browser.Dom.Element
    , elementId : String
    }


{-| A `System` encapsulates a `Draggable` which represents the information about the drag operation and the drag related functions.

For the details, see [System Fields](#system-fields)

-}
type alias System msg a =
    { draggable : Draggable
    , subscriptions : Draggable -> Sub msg
    , commands : Draggable -> Cmd msg
    , update : Msg -> Draggable -> List a -> ( Draggable, List a )
    , dragEvents : Int -> String -> List (Html.Attribute msg)
    , dropEvents : Int -> List (Html.Attribute msg)
    , dragIndex : Draggable -> Maybe Int
    , dropIndex : Draggable -> Maybe Int
    , draggedStyles : Draggable -> List (Html.Attribute msg)
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
create : Config msg -> System msg a
create { message, movement } =
    { draggable = Draggable Nothing
    , subscriptions = subscriptions message
    , commands = commands message
    , update = update movement
    , dragEvents = dragEvents message
    , dropEvents = dropEvents message
    , dragIndex = dragIndex
    , dropIndex = dropIndex
    , draggedStyles = draggedStyles movement
    }


{-| Represents the `System` configuration.

  - `message`: Your message wrapper.

  - `movement`: The kind of the `Movement`. It can be Free, Horizontal, or Vertical.

Example configuration:

    config : DnDList.Config Msg
    config =
        { message = MyMsg
        , movement = DnDList.Free DnDList.Rotate DnDList.OnDrag
        }

-}
type alias Config msg =
    { message : Msg -> msg
    , movement : Movement
    }


{-| Represents the mouse dragging movement.
Dragging can be restricted to vertical or horizontal axis only, or it can be free.
-}
type Movement
    = Free Operation Trigger
    | Horizontal
    | Vertical


{-| Represents the list reordering operation.

  - `Rotate`: The items between the dragged and the drop target elements will be circularly shifted.

  - `Swap`: The dragged and the drop target elements will be swapped, and no other item will be moved.

-}
type Operation
    = Rotate
    | Swap


{-| Represents the event when the list will be reordered.

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
                    (Json.Decode.map2 Position pageX pageY
                        |> Json.Decode.map (wrap << Drag)
                    )
                , Browser.Events.onMouseUp
                    (Json.Decode.succeed (wrap DragEnd))
                ]


commands : (Msg -> msg) -> Draggable -> Cmd msg
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
    | DragEnter Int
    | DragLeave
    | DragEnd
    | GotDragged (Result Browser.Dom.Error Browser.Dom.Element)


update : Movement -> Msg -> Draggable -> List a -> ( Draggable, List a )
update movement msg (Draggable model) list =
    case msg of
        DragStart dragIdx elementId xy ->
            ( Draggable <|
                Just
                    { dragIdx = dragIdx
                    , dropIdx = dragIdx
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

        DragOver dropIdx ->
            ( model
                |> Maybe.map (\m -> { m | dropIdx = dropIdx })
                |> Draggable
            , list
            )

        DragEnter dropIdx ->
            case movement of
                Free Rotate OnDrag ->
                    ( model
                        |> Maybe.map (\m -> { m | dragIdx = dropIdx })
                        |> Draggable
                    , rotateReorder model dropIdx list
                    )

                Free Swap OnDrag ->
                    ( model
                        |> Maybe.map (\m -> { m | dragIdx = dropIdx })
                        |> Draggable
                    , swapReorder model dropIdx list
                    )

                Free _ OnDrop ->
                    ( Draggable model, list )

                _ ->
                    ( model
                        |> Maybe.map (\m -> { m | dragIdx = dropIdx })
                        |> Draggable
                    , swapReorder model dropIdx list
                    )

        DragLeave ->
            ( model
                |> Maybe.map (\m -> { m | dropIdx = m.dragIdx })
                |> Draggable
            , list
            )

        DragEnd ->
            let
                dropIdx : Maybe Int
                dropIdx =
                    Maybe.map (\m -> m.dropIdx) model
            in
            case ( movement, dropIdx ) of
                ( Free Rotate OnDrop, Just index ) ->
                    ( Draggable Nothing
                    , rotateReorder model index list
                    )

                ( Free Swap OnDrop, Just index ) ->
                    ( Draggable Nothing
                    , swapReorder model index list
                    )

                _ ->
                    ( Draggable Nothing, list )

        GotDragged (Err _) ->
            ( Draggable model, list )

        GotDragged (Ok element) ->
            ( model
                |> Maybe.map (\m -> { m | element = Just element })
                |> Draggable
            , list
            )


swapReorder : Maybe Model -> Int -> List a -> List a
swapReorder model dropIdx list =
    case model of
        Just m ->
            if m.dragIdx /= dropIdx then
                swap m.dragIdx dropIdx list

            else
                list

        Nothing ->
            list


swap : Int -> Int -> List a -> List a
swap i j list =
    let
        item_i : List a
        item_i =
            list |> List.drop i |> List.take 1

        item_j : List a
        item_j =
            list |> List.drop j |> List.take 1
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == i then
                    item_j

                else if index == j then
                    item_i

                else
                    [ item ]
            )
        |> List.concat


rotateReorder : Maybe Model -> Int -> List a -> List a
rotateReorder model dropIdx list =
    case model of
        Just m ->
            if m.dragIdx < dropIdx then
                rotate m.dragIdx dropIdx list

            else if m.dragIdx > dropIdx then
                let
                    n : Int
                    n =
                        List.length list - 1
                in
                List.reverse (rotate (n - m.dragIdx) (n - dropIdx) (List.reverse list))

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


dragEvents : (Msg -> msg) -> Int -> String -> List (Html.Attribute msg)
dragEvents wrap dragIdx elementId =
    [ Html.Events.preventDefaultOn "mousedown"
        (Json.Decode.map2 Position pageX pageY
            |> Json.Decode.map (wrap << DragStart dragIdx elementId)
            |> Json.Decode.map (\msg -> ( msg, True ))
        )
    ]


dropEvents : (Msg -> msg) -> Int -> List (Html.Attribute msg)
dropEvents wrap dropIdx =
    [ Html.Events.onMouseOver (wrap (DragOver dropIdx))
    , Html.Events.onMouseEnter (wrap (DragEnter dropIdx))
    , Html.Events.onMouseLeave (wrap DragLeave)
    ]


pageX : Json.Decode.Decoder Float
pageX =
    Json.Decode.field "pageX" Json.Decode.float


pageY : Json.Decode.Decoder Float
pageY =
    Json.Decode.field "pageY" Json.Decode.float


dragIndex : Draggable -> Maybe Int
dragIndex (Draggable model) =
    model
        |> Maybe.andThen
            (\m ->
                m.element
                    |> Maybe.map (\_ -> m.dragIdx)
            )


dropIndex : Draggable -> Maybe Int
dropIndex (Draggable model) =
    model
        |> Maybe.andThen
            (\m ->
                m.element
                    |> Maybe.map (\_ -> m.dropIdx)
            )


draggedStyles : Movement -> Draggable -> List (Html.Attribute msg)
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
                                    (round (m.currentPosition.x - m.startPosition.x + element.x))
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
                                    (round (m.currentPosition.y - m.startPosition.y + element.y))
                            , Html.Attributes.style "height" (px (round element.height))
                            , Html.Attributes.style "width" (px (round element.width))
                            , Html.Attributes.style "pointer-events" "none"
                            ]

                        Free _ _ ->
                            [ Html.Attributes.style "position" "absolute"
                            , Html.Attributes.style "left" "0"
                            , Html.Attributes.style "top" "0"
                            , Html.Attributes.style "transform" <|
                                translate
                                    (round (m.currentPosition.x - m.startPosition.x + element.x))
                                    (round (m.currentPosition.y - m.startPosition.y + element.y))
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
