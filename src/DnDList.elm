module DnDList exposing (Movement(..), Listen(..), Operation(..), Orientation(..))

{-|


# Config

@docs Movement, Listen, Operation, Orientation, HasWall

-}


{-| Represents the mouse dragging movement.
This [demo config](https://annaghi.github.io/dnd-list/config/movement) shows the different movements in action.

  - `Free` : The ghost element follows the mouse pointer.

  - `Horizontal` : The ghost element can only move horizontally.

  - `Vertical` : The ghost element can only move vertically.

-}
type Movement
    = Free
    | Horizontal
    | Vertical


{-| Represents the event for which the list sorting is available.

  - `OnDrag`: The list will be sorted when the ghost element is being dragged over a drop target item.

  - `OnDrop`: The list will be sorted when the ghost element is dropped on a drop target item.

-}
type Listen
    = OnDrag
    | OnDrop


{-| Represents the list sort operation.
Detailed comparisons can be found here:
[sorting on drag](https://annaghi.github.io/dnd-list/config/operations-drag)
and [sorting on drop](https://annaghi.github.io/dnd-list/config/operations-drop).

  - `InsertAfter`: The drag source item will be inserted after the drop target item.

  - `InsertBefore`: The drag source item will be inserted before the drop target item.

  - `Rotate`: The items between the drag source and the drop target items will be circularly shifted.

  - `Swap`: The drag source and the drop target items will be swapped.

  - `Unaltered`: The list items will keep their initial order.

-}
type Operation
    = InsertAfter
    | InsertBefore
    | Rotate
    | Swap
    | Unaltered


type Orientation
    = Scroll_X
    | Scroll_Y
    | Scroll_XY
