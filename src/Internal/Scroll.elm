module Internal.Scroll exposing (coordinatesWithFence)

import Browser.Dom
import Internal.Types exposing (..)


type Direction
    = TopLeft
    | TopRight
    | BottomLeft
    | BottomRight
    | Top
    | Bottom
    | Left
    | Right
    | None


type alias Dimensions =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    }


coordinatesWithFence : Offset -> Coordinates -> Coordinates -> Maybe Browser.Dom.Element -> Coordinates
coordinatesWithFence offset startPosition currentPosition containerElement =
    case containerElement of
        Just { element } ->
            case direction currentPosition offset element element of
                TopLeft ->
                    Coordinates
                        (element.x - startPosition.x - offset.left)
                        (element.y - startPosition.y - offset.top)

                TopRight ->
                    Coordinates
                        (element.x + element.width - startPosition.x + offset.right)
                        (element.y - startPosition.y - offset.top)

                BottomLeft ->
                    Coordinates
                        (element.x - startPosition.x - offset.left)
                        (element.y + element.height - startPosition.y + offset.bottom)

                BottomRight ->
                    Coordinates
                        (element.x + element.width - startPosition.x + offset.right)
                        (element.y + element.height - startPosition.y + offset.bottom)

                Top ->
                    Coordinates
                        (currentPosition.x - startPosition.x)
                        (element.y - startPosition.y - offset.top)

                Bottom ->
                    Coordinates
                        (currentPosition.x - startPosition.x)
                        (element.y + element.height - startPosition.y + offset.bottom)

                Left ->
                    Coordinates
                        (element.x - startPosition.x - offset.left)
                        (currentPosition.y - startPosition.y)

                Right ->
                    Coordinates
                        (element.x + element.width - startPosition.x + offset.right)
                        (currentPosition.y - startPosition.y)

                None ->
                    Coordinates
                        (currentPosition.x - startPosition.x)
                        (currentPosition.y - startPosition.y)

        Nothing ->
            Coordinates
                (currentPosition.x - startPosition.x)
                (currentPosition.y - startPosition.y)


direction : Coordinates -> Offset -> Dimensions -> Dimensions -> Direction
direction coordinates offset element viewport =
    if coordinates.x < element.x - offset.left && coordinates.y < element.y - offset.top then
        TopLeft

    else if coordinates.x > element.x + viewport.width + offset.right && coordinates.y < element.y - offset.top then
        TopRight

    else if coordinates.x < element.x - offset.left && coordinates.y > element.y + viewport.height + offset.bottom then
        BottomLeft

    else if coordinates.x > element.x + viewport.width + offset.right && coordinates.y > element.y + viewport.height + offset.bottom then
        BottomRight

    else if coordinates.y < element.y - offset.top then
        Top

    else if coordinates.y > element.y + viewport.height + offset.bottom then
        Bottom

    else if coordinates.x < element.x - offset.left then
        Left

    else if coordinates.x > element.x + viewport.width + offset.right then
        Right

    else
        None
