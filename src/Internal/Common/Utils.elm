module Internal.Common.Utils exposing (Position, pageX, pageY, px, translate)

import Json.Decode


type alias Position =
    { x : Float
    , y : Float
    }


px : Int -> String
px n =
    String.fromInt n ++ "px"


translate : Int -> Int -> String
translate x y =
    "translate3d(" ++ px x ++ ", " ++ px y ++ ", 0)"


pageX : Json.Decode.Decoder Float
pageX =
    Json.Decode.field "pageX" Json.Decode.float


pageY : Json.Decode.Decoder Float
pageY =
    Json.Decode.field "pageY" Json.Decode.float
