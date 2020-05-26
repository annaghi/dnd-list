module Internal.Types exposing (..)

import Browser.Dom


type alias State =
    { dragIndex : DragIndex
    , dropIndex : DropIndex
    , moveCounter : Int
    , startPosition : Coordinates
    , currentPosition : Coordinates
    , translateVector : Coordinates
    , dragElementId : DragElementId
    , dropElementId : DropElementId
    , dragElement : Maybe Browser.Dom.Element
    , dropElement : Maybe Browser.Dom.Element

    -- TODO For Single only
    , containerElement : Maybe Browser.Dom.Element
    }


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


type alias Offset =
    { top : Float
    , right : Float
    , bottom : Float
    , left : Float
    }
