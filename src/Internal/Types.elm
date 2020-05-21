module Internal.Types exposing (..)

import Dict
import Html


type alias DragIndex =
    Int


type alias DropIndex =
    Int


type alias DragElementId =
    String


type alias DropElementId =
    String


type alias Coordinates =
    { x : Float
    , y : Float
    }
