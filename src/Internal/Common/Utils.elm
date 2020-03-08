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
    Json.Decode.map2 Position pageX pageY


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


translate : Int -> Int -> String
translate x y =
    "translate3d(" ++ px x ++ ", " ++ px y ++ ", 0)"


px : Int -> String
px n =
    String.fromInt n ++ "px"
