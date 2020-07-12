module Internal.Types exposing (..)

import DnDList exposing (..)


type alias DragIndex =
    Int


type alias DropIndex =
    Int


type alias DragElementId =
    String


type alias DropElementId =
    String


type alias ContainerElementId =
    String


type alias Coordinates =
    { x : Float
    , y : Float
    }


type alias Offset =
    { top : Float
    , right : Float
    , bottom : Float
    , left : Float
    }


type alias ScrollOptions =
    { containerElementId : ContainerElementId
    , orientation : Orientation
    , offset : Offset
    , hasWall : Bool
    }
