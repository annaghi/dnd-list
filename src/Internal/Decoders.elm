module Internal.Decoders exposing (decodeCoordinates, decodeCoordinatesWithButtonCheck)

import Internal.Types exposing (Coordinates)
import Json.Decode


decodeCoordinatesWithButtonCheck : Json.Decode.Decoder Coordinates
decodeCoordinatesWithButtonCheck =
    decodeMainMouseButton decodeCoordinates


decodeCoordinates : Json.Decode.Decoder Coordinates
decodeCoordinates =
    Json.Decode.map2 Coordinates clientX clientY


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
