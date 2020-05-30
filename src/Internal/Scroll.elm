module Internal.Scroll exposing (coordinatesWithFence, scrollByStep)

import Browser.Dom
import Internal.Types exposing (..)
import Task


type Direction
    = Bottom
    | Right
    | Top
    | Left
    | BottomLeft
    | BottomRight
    | TopRight
    | TopLeft
    | None


type alias Dimensions =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    }


coordinatesWithFence : Offset -> Coordinates -> Coordinates -> Browser.Dom.Element -> Coordinates
coordinatesWithFence offset startPosition currentPosition element =
    case direction offset currentPosition element element.element of
        Bottom ->
            Coordinates
                (currentPosition.x - startPosition.x - element.viewport.x)
                (element.element.y + element.element.height - startPosition.y - element.viewport.y + offset.bottom)

        Right ->
            Coordinates
                -- TODO Why applying element.viewport.x|y makes the ghost coordinates wrong?
                (element.element.x + element.element.width - startPosition.x + offset.right)
                (currentPosition.y - startPosition.y)

        Top ->
            Coordinates
                (currentPosition.x - startPosition.x - element.viewport.x)
                (element.element.y - startPosition.y - element.viewport.y - offset.top)

        Left ->
            Coordinates
                (element.element.x - startPosition.x - offset.left)
                (currentPosition.y - startPosition.y)

        BottomLeft ->
            Coordinates
                (element.element.x - startPosition.x - element.viewport.x - offset.left)
                (element.element.y + element.element.height - startPosition.y - element.viewport.y + offset.bottom)

        BottomRight ->
            Coordinates
                (element.element.x + element.element.width - startPosition.x - element.viewport.x + offset.right)
                (element.element.y + element.element.height - startPosition.y - element.viewport.y + offset.bottom)

        TopRight ->
            Coordinates
                (element.element.x + element.element.width - startPosition.x - element.viewport.x + offset.right)
                (element.element.y - startPosition.y - element.viewport.y - offset.top)

        TopLeft ->
            Coordinates
                (element.element.x - startPosition.x - element.viewport.x - offset.left)
                (element.element.y - startPosition.y - element.viewport.y - offset.top)

        None ->
            Coordinates
                (currentPosition.x - startPosition.x)
                (currentPosition.y - startPosition.y)


scrollByStep : Float -> Maybe Offset -> Offset -> Coordinates -> ContainerElementId -> Browser.Dom.Element -> Browser.Dom.Viewport -> Task.Task Browser.Dom.Error ()
scrollByStep step area offset currentPosition containerElementId element { viewport } =
    case area of
        Just area_ ->
            scrollByArea area_ offset currentPosition containerElementId element.element viewport step

        Nothing ->
            scroll offset currentPosition containerElementId element viewport step


scroll : Offset -> Coordinates -> ContainerElementId -> Browser.Dom.Element -> Dimensions -> Float -> Task.Task Browser.Dom.Error ()
scroll offset currentPosition containerElementId element viewport step =
    case direction offset currentPosition element viewport of
        Bottom ->
            Browser.Dom.setViewportOf containerElementId viewport.x (viewport.y + step)

        Right ->
            Browser.Dom.setViewportOf containerElementId (viewport.x + step) viewport.y

        Top ->
            Browser.Dom.setViewportOf containerElementId viewport.x (viewport.y - step)

        Left ->
            Browser.Dom.setViewportOf containerElementId (viewport.x - step) viewport.y

        _ ->
            Task.succeed ()


scrollByArea : Offset -> Offset -> Coordinates -> ContainerElementId -> Dimensions -> Dimensions -> Float -> Task.Task Browser.Dom.Error ()
scrollByArea area offset currentPosition containerElementId element viewport step =
    case directionByArea area offset currentPosition element viewport of
        Bottom ->
            Browser.Dom.setViewportOf containerElementId viewport.x (viewport.y + step)

        Right ->
            Browser.Dom.setViewportOf containerElementId (viewport.x + step) viewport.y

        Top ->
            Browser.Dom.setViewportOf containerElementId viewport.x (viewport.y - step)

        Left ->
            Browser.Dom.setViewportOf containerElementId (viewport.x - step) viewport.y

        _ ->
            Task.succeed ()


direction : Offset -> Coordinates -> Browser.Dom.Element -> Dimensions -> Direction
direction offset coordinates element viewport =
    if coordinates.x < element.element.x - element.viewport.x - offset.left && coordinates.y > element.element.y - element.viewport.y + viewport.height + offset.bottom then
        BottomLeft

    else if coordinates.x > element.element.x - element.viewport.x + viewport.width + offset.right && coordinates.y > element.element.y - element.viewport.y + viewport.height + offset.bottom then
        BottomRight

    else if coordinates.x > element.element.x - element.viewport.x + viewport.width + offset.right && coordinates.y < element.element.y - element.viewport.y - offset.top then
        TopRight

    else if coordinates.x < element.element.x - element.viewport.x - offset.left && coordinates.y < element.element.y - element.viewport.y - offset.top then
        TopLeft

    else if coordinates.y > element.element.y - element.viewport.y + viewport.height + offset.bottom then
        Bottom

    else if coordinates.x > element.element.x - element.viewport.x + viewport.width + offset.right then
        Right

    else if coordinates.y < element.element.y - element.viewport.y - offset.top then
        Top

    else if coordinates.x < element.element.x - element.viewport.x - offset.left then
        Left

    else
        None


directionByArea : Offset -> Offset -> Coordinates -> Dimensions -> Dimensions -> Direction
directionByArea area offset coordinates element viewport =
    if
        (coordinates.x < element.x - offset.left && coordinates.y > element.y + viewport.height + offset.bottom)
            && (coordinates.x > element.x - area.left && coordinates.y < element.y + viewport.height + area.bottom)
    then
        BottomLeft

    else if
        (coordinates.x > element.x + viewport.width + offset.right && coordinates.y > element.y + viewport.height + offset.bottom)
            && (coordinates.x < element.x + viewport.width + area.right && coordinates.y < element.y + viewport.height + area.bottom)
    then
        BottomRight

    else if
        (coordinates.x > element.x + viewport.width + offset.right && coordinates.y < element.y - offset.top)
            && (coordinates.x < element.x + viewport.width + area.right && coordinates.y > element.y - area.top)
    then
        TopRight

    else if
        (coordinates.x < element.x - offset.left && coordinates.y < element.y - offset.top)
            && (coordinates.x > element.x - area.left && coordinates.y > element.y - area.top)
    then
        TopLeft

    else if
        (coordinates.y > element.y + viewport.height + offset.bottom)
            && (coordinates.y < element.y + viewport.height + area.bottom)
    then
        Bottom

    else if
        (coordinates.x > element.x + viewport.width + offset.right)
            && (coordinates.x < element.x + viewport.width + area.right)
    then
        Right

    else if
        (coordinates.y < element.y - offset.top)
            && (coordinates.y > element.y - area.top)
    then
        Top

    else if
        (coordinates.x < element.x - offset.left)
            && (coordinates.x > element.x - area.left)
    then
        Left

    else
        None
