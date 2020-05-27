module Internal.Common.Utils exposing (decodeCoordinates, decodeCoordinatesWithButtonCheck, px, translate)

import Json.Decode


type alias Position =
    { x : Float
    , y : Float
    }


decodeCoordinatesWithButtonCheck : Json.Decode.Decoder Position
decodeCoordinatesWithButtonCheck =
    decodeMainMouseButton decodeCoordinates


decodeCoordinates : Json.Decode.Decoder Position
decodeCoordinates =
    Json.Decode.map2 Position clientX clientY


decodeMainMouseButton : Json.Decode.Decoder a -> Json.Decode.Decoder a
decodeMainMouseButton decoder =
    Json.Decode.field "button" Json.Decode.int
        |> Json.Decode.andThen
            (\button ->
                if button == 0 then
                    decoder

                else
                    Json.Decode.fail "Event is only relevant when the main mouse button was pressed."
            )


clientX : Json.Decode.Decoder Float
clientX =
    Json.Decode.field "clientX" Json.Decode.float


clientY : Json.Decode.Decoder Float
clientY =
    Json.Decode.field "clientY" Json.Decode.float


translate : Int -> Int -> String
translate x y =
    "translate3d(" ++ px x ++ ", " ++ px y ++ ", 0)"


px : Int -> String
px n =
    String.fromInt n ++ "px"
