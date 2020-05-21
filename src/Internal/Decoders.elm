module Internal.Decoders exposing (decodeCoordinates, decodeCoordinatesWithButtonCheck)

import Internal.Types exposing (Coordinates)
import Json.Decode


decodeCoordinatesWithButtonCheck : Json.Decode.Decoder Coordinates
decodeCoordinatesWithButtonCheck =
    decodeMainMouseButton decodeCoordinates


decodeCoordinates : Json.Decode.Decoder Coordinates
decodeCoordinates =
    Json.Decode.map2 Coordinates pageX pageY


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


pageX : Json.Decode.Decoder Float
pageX =
    Json.Decode.field "pageX" Json.Decode.float


pageY : Json.Decode.Decoder Float
pageY =
    Json.Decode.field "pageY" Json.Decode.float
