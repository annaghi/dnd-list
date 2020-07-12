module Internal.Scroll exposing (ScrollMeta, baseCoordinates, coordinates, noOffset, scrollOnContainerByStep, scrollOnDocumentByStep)

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


type alias ScrollMeta =
    { scrollOptions : ScrollOptions
    , containerElement : Browser.Dom.Element
    , containerViewport : Browser.Dom.Viewport
    , documentViewport : Browser.Dom.Viewport
    }



-- CONSTANTS


noOffset : Offset
noOffset =
    { top = 0, right = 0, bottom = 0, left = 0 }


documentOffset : Offset
documentOffset =
    { top = -10, right = -10, bottom = -10, left = -10 }



-- SCROLL ON DOCUMENT


scrollOnDocumentByStep : Float -> Coordinates -> Browser.Dom.Viewport -> Task.Task Browser.Dom.Error ()
scrollOnDocumentByStep step currentPosition documentViewport =
    case directionDocument documentOffset currentPosition documentViewport of
        Bottom ->
            Browser.Dom.setViewport documentViewport.viewport.x (documentViewport.viewport.y + step)

        Right ->
            Browser.Dom.setViewport (documentViewport.viewport.x + step) documentViewport.viewport.y

        Top ->
            Browser.Dom.setViewport documentViewport.viewport.x (documentViewport.viewport.y - step)

        Left ->
            Browser.Dom.setViewport (documentViewport.viewport.x - step) documentViewport.viewport.y

        _ ->
            Task.succeed ()


directionDocument : Offset -> Coordinates -> Browser.Dom.Viewport -> Direction
directionDocument offset position { viewport } =
    if position.x < -offset.left && position.y > viewport.height + offset.bottom then
        BottomLeft

    else if position.x > viewport.width + offset.right && position.y > viewport.height + offset.bottom then
        BottomRight

    else if position.x > viewport.width + offset.right && position.y < -offset.top then
        TopRight

    else if position.x < -offset.left && position.y < -offset.top then
        TopLeft

    else if position.y > viewport.height + offset.bottom then
        Bottom

    else if position.x > viewport.width + offset.right then
        Right

    else if position.y < -offset.top then
        Top

    else if position.x < -offset.left then
        Left

    else
        None



-- SCROLL ON CONTAINER


scrollOnContainerByStep : Float -> Coordinates -> ScrollMeta -> Task.Task Browser.Dom.Error ()
scrollOnContainerByStep step currentPosition { scrollOptions, containerElement, containerViewport, documentViewport } =
    case direction currentPosition scrollOptions.offset containerElement containerViewport.viewport documentViewport.viewport of
        Bottom ->
            Browser.Dom.setViewportOf scrollOptions.containerElementId containerViewport.viewport.x (containerViewport.viewport.y + step)

        Right ->
            Browser.Dom.setViewportOf scrollOptions.containerElementId (containerViewport.viewport.x + step) containerViewport.viewport.y

        Top ->
            Browser.Dom.setViewportOf scrollOptions.containerElementId containerViewport.viewport.x (containerViewport.viewport.y - step)

        Left ->
            Browser.Dom.setViewportOf scrollOptions.containerElementId (containerViewport.viewport.x - step) containerViewport.viewport.y

        _ ->
            Task.succeed ()


direction : Coordinates -> Offset -> Browser.Dom.Element -> Dimensions -> Dimensions -> Direction
direction position offset containerElement elementViewport documentViewport =
    if position.x < containerElement.element.x - documentViewport.x - offset.left && position.y > containerElement.element.y - documentViewport.y + elementViewport.height + offset.bottom then
        BottomLeft

    else if position.x > containerElement.element.x - documentViewport.x + elementViewport.width + offset.right && position.y > containerElement.element.y - documentViewport.y + elementViewport.height + offset.bottom then
        BottomRight

    else if position.x > containerElement.element.x - documentViewport.x + elementViewport.width + offset.right && position.y < containerElement.element.y - documentViewport.y - offset.top then
        TopRight

    else if position.x < containerElement.element.x - documentViewport.x - offset.left && position.y < containerElement.element.y - documentViewport.y - offset.top then
        TopLeft

    else if position.y > containerElement.element.y - documentViewport.y + elementViewport.height + offset.bottom then
        Bottom

    else if position.x > containerElement.element.x - documentViewport.x + elementViewport.width + offset.right then
        Right

    else if position.y < containerElement.element.y - documentViewport.y - offset.top then
        Top

    else if position.x < containerElement.element.x - documentViewport.x - offset.left then
        Left

    else
        None



-- GHOST COORDINATES


baseCoordinates : Coordinates -> Coordinates -> Coordinates
baseCoordinates startPosition currentPosition =
    Coordinates
        (currentPosition.x - startPosition.x)
        (currentPosition.y - startPosition.y)


coordinates : Coordinates -> Coordinates -> ScrollMeta -> Coordinates
coordinates startPosition currentPosition { scrollOptions, containerElement, containerViewport, documentViewport } =
    if scrollOptions.hasWall then
        walledCoordinates startPosition currentPosition scrollOptions.offset containerElement containerViewport documentViewport

    else
        baseCoordinates startPosition currentPosition


walledCoordinates : Coordinates -> Coordinates -> Offset -> Browser.Dom.Element -> Browser.Dom.Viewport -> Browser.Dom.Viewport -> Coordinates
walledCoordinates startPosition currentPosition offset containerElement containerViewport documentViewport =
    case direction currentPosition offset containerElement containerViewport.viewport documentViewport.viewport of
        Bottom ->
            Coordinates
                (currentPosition.x - startPosition.x - containerElement.viewport.x)
                (containerElement.element.y + containerElement.element.height - startPosition.y - containerElement.viewport.y + offset.bottom)

        Right ->
            Coordinates
                (containerElement.element.x + containerElement.element.width - startPosition.x - containerElement.viewport.x + offset.right)
                (currentPosition.y - startPosition.y)

        Top ->
            Coordinates
                (currentPosition.x - startPosition.x - containerElement.viewport.x)
                (containerElement.element.y - startPosition.y - containerElement.viewport.y - offset.top)

        Left ->
            Coordinates
                (containerElement.element.x - startPosition.x - containerElement.viewport.x - offset.left)
                (currentPosition.y - startPosition.y)

        BottomLeft ->
            Coordinates
                (containerElement.element.x - startPosition.x - containerElement.viewport.x - offset.left)
                (containerElement.element.y + containerElement.element.height - startPosition.y - containerElement.viewport.y + offset.bottom)

        BottomRight ->
            Coordinates
                (containerElement.element.x + containerElement.element.width - startPosition.x - containerElement.viewport.x + offset.right)
                (containerElement.element.y + containerElement.element.height - startPosition.y - containerElement.viewport.y + offset.bottom)

        TopRight ->
            Coordinates
                (containerElement.element.x + containerElement.element.width - startPosition.x - containerElement.viewport.x + offset.right)
                (containerElement.element.y - startPosition.y - containerElement.viewport.y - offset.top)

        TopLeft ->
            Coordinates
                (containerElement.element.x - startPosition.x - containerElement.viewport.x - offset.left)
                (containerElement.element.y - startPosition.y - containerElement.viewport.y - offset.top)

        None ->
            baseCoordinates startPosition currentPosition
