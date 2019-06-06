# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Meaningful type aliases

We are using the following type aliases throughout this document for the purposes of better understanding.

```elm
type alias DragIndex = Int
type alias DropIndex = Int
type alias DragElementId = String
type alias DropElementId = String
type alias ZoneElementId = String
```

When it is not confusing we omit the `DnDList` module name.

## [Unreleased] -

### Added

- Introduce Pipeline Pattern in `Config`.
- Change `Config` type alias to type.
- Add default `config`.
- Add pipeline function `withBeforeSort`.
- Add pipeline function `withMovement`.
- Add pipeline function `withFlat`.
- Add pipeline function `withGroups`.
- Add pipeline function `withZones`.

- Add `zoneEvents` function to `System`.
- Add `group` argument to `dragEvents`, and reorder its arguments too.
- Add `group` argument to `dropEvents`, and reorder its arguments too.

### Changed

- Reorder `create` function's arguments.

* Remove `commands` from `System` and return `Cmd Msg` in `update` instead.
* Totally reorganize `update` function.

```elm
DnDList

create : Msg group -> DnDList.Config group item -> DnDList.System Msg group item
```

```elm
system

model : DnDList.Model group
update : Msg group -> List item -> DnDList.Model group -> ( List item, DnDList.Model group, Cmd Msg )
subscriptions : DnDList.Model group -> Sub Msg
dragEvents : DragElementId -> group -> DragIndex -> List (Html.Attribute Msg)
dropEvents : DropElementId -> group -> DropIndex -> List (Html.Attribute Msg)
zoneEvents : ZoneElementId -> group -> List (Html.Attribute Msg)
ghostStyles : DnDList.Model group -> List (Html.Attribute Msg)
info : DnDList.Model group -> Maybe (DnDList.Info group)
```

```elm
config : DnDList.Config group item

-- is equal to

config =
    { beforeSort = \_ _ list -> list
    , movement = Free
    , flat =
        { listen = OnDrag
        , operation = Rotate
        }
    , groups = Nothing
    , zones = Nothing
    }
```

```elm
withBeforeSort :
    (DragIndex -> DropIndex -> List item -> List item)
    -> Config group item
    -> Config group item

withMovement :
    Movement
    -> Config group item
    -> Config group item

withFlat :
    { listen : Listen
    , operation : Operation
    }
    -> Config group item
    -> Config group item

withGroups :
    { listen : Listen
    , operation : Operation
    , comparator : item -> item -> Bool
    , setter : item -> item -> item
    }
    -> Config group item
    -> Config group item

withZones :
    { listen : Listen
    , operation : Operation
    , comparator : group -> item -> Bool
    , setter : group -> item -> item
    }
    -> Config group item
    -> Config group item
```

```elm
type Config group item = Config
    { beforeSort : DragIndex -> DropIndex -> List item -> List item
    , movement : Movement
    , flat :
        { listen = Listen
        , operation = Operation
        }
    , groups : Maybe
        { listen = Listen
        , operation = Operation
        , comparator = item -> item -> Bool
        , setter = item -> item -> item
        }
    , zones : Maybe
        { listen = Listen
        , operation = Operation
        , comparator = group -> item -> Bool
        , setter = group -> item -> item
        }
    }
```

```elm
type alias Info group =
    { dragIndex : Int
    , dropIndex : Int
    , group : group
    , dragElementId : String
    , dropElementId : String
    , zoneElementId : String
    , dragElement : Browser.Dom.Element
    , dropElement : Browser.Dom.Element
    , zoneElement : Browser.Dom.Element
    }
```

## [5.0.0] - 2019-05-06

### Added

- Introduce `Info` type alias with a lot of useful fields.
- Add `info` field to `System`.
- Move `dragIndex` field from `System` to `Info` as a field called `dragIndex`.

* Add `beforeUpdate` field to `Config`.
* Add `listen` field to `Config`.
* Add `operation` field to `Config`.

### Changed

- Move `message` field from `Config` to `create` function as a new `Msg` argument.

* Rename `Draggable` type to `Model`.
* Rename `draggable` field to `model` in `System`.

```elm
DnDList

create : DnDList.Config item -> Msg -> DnDList.System Msg item
```

```elm
system

model : DnDList.Model
update : DnDList.Msg -> DnDList.Model -> List item -> ( DnDList.Model, List item )
subscriptions : DnDList.Model -> Sub Msg
commands : DnDList.Model -> Cmd Msg
dragEvents : DragIndex -> DragElementId -> List (Html.Attribute Msg)
dropEvents : DropIndex -> DropElementId -> List (Html.Attribute Msg)
ghostStyles : DnDList.Model -> List (Html.Attribute Msg)
info : DnDList.Model -> Maybe DnDList.Info
```

```elm
type alias Config item =
    { beforeUpdate : DragIndex -> DropIndex -> List item -> List item
    , movement : Movement
    , listen : Listen
    , operation : Operation
    }
```

```elm
type alias Info =
    { dragIndex : Int
    , dropIndex : Int
    , dragElementId : String
    , dropElementId : String
    , dragElement : Browser.Dom.Element
    , dropElement : Browser.Dom.Element
    }
```

## [4.0.2] - 2019-03-07

### Fix

- Instead of `Int` use `Float` when extracting mouse position.
- Delete `preventDefault` from `mouseover` because it has no default action.

## [4.0.1] - 2019-02-21

### Docs

- Update README, documentation, and examples for better understanding.

## [4.0.0] - 2019-02-19

### Changed

- Rename `draggedIndex` field to `dragIndex` in `System`.

```elm
DnDList

create : DnDList.Config Msg -> DnDList.System Msg item
```

```elm
system

draggable : DnDList.Draggable
update : DnDList.Msg -> DnDList.Draggable -> List item -> ( DnDList.Draggable, List item )
subscriptions : DnDList.Draggable -> Sub Msg
commands : DnDList.Draggable -> Cmd Msg
dragEvents : DragIndex -> DragElementId -> List (Html.Attribute Msg)
dropEvents : DropIndex -> List (Html.Attribute Msg)
draggedStyles : DnDList.Draggable -> List (Html.Attribute Msg)
dragIndex : DnDList.Draggable -> Maybe DragIndex
```

```elm
type alias Config Msg =
    { message : Msg
    , movement : Movement
    }
```

## [3.0.0] - 2019-02-18

### Changed

- Add `item` type variable to `System`.
- Move `DnDList.update` function into `System` as a new field called `update`.
- Move `DnDList.getDragIndex` function into `System` as a new field called `draggedIndex`.

* Rename `events` field to `message` in `Config`.

```elm
DnDList

create : DnDList.Config Msg -> DnDList.System Msg item
```

```elm
system

draggable : DnDList.Draggable
update : DnDList.Msg -> DnDList.Draggable -> List item -> ( DnDList.Draggable, List item )
subscriptions : DnDList.Draggable -> Sub Msg
commands : DnDList.Draggable -> Cmd Msg
dragEvents : DragIndex -> DragElementId -> List (Html.Attribute Msg)
dropEvents : DropIndex -> List (Html.Attribute Msg)
draggedStyles : DnDList.Draggable -> List (Html.Attribute Msg)
draggedIndex : DnDList.Draggable -> Maybe DragIndex
```

```elm
type alias Config Msg =
    { message : Msg
    , movement : Movement
    }
```

## [2.0.0] - 2019-02-17

### Added

- Introduce `Config` type alias.
- Replace `Msg` argument with `Config Msg` in `create` function.
- Add the removed `Msg` from `create` to `Config` as a field called `events`.
- Move `Movement` argument from `draggedStyles` to `Config` as a field called `movement`.

```elm
DnDList

create : DnDList.Config Msg -> DnDList.System Msg
update : DnDList.Msg -> DnDList.Draggable -> List item -> ( DnDList.Draggable, List item )
getDragIndex : DnDList.Draggable -> Maybe DragIndex
```

```elm
system

draggable : DnDList.Draggable
subscriptions : DnDList.Draggable -> Sub Msg
commands : DnDList.Draggable -> Cmd Msg
dragEvents : DragIndex -> DragElementId -> List (Html.Attribute Msg)
dropEvents : DropIndex -> List (Html.Attribute Msg)
draggedStyles : DnDList.Draggable -> List (Html.Attribute Msg)
```

```elm
type alias Config Msg =
    { events : Msg
    , movement : Movement
    }
```

## [1.0.4] - 2019-02-17

### Docs

- New example was added using `mdgriffith/elm-ui`.

## [1.0.3] - 2019-02-14

### Docs

- Update README, documentation, and examples for better understanding.

## [1.0.2] - 2019-02-12

### Fixed

- The ghost element's position was animated by setting the left and top properties which trigger layout operations, and that's expensive. The better solution is to use a translate on the element, which does not trigger layout.

## [1.0.1] - 2019-02-08

- No changes, just check how the Elm package system works.

## [1.0.0] - 2019-02-08

### Added

```elm
DnDList

create : Msg -> DnDList.System Msg
update : DnDList.Msg -> DnDList.Draggable -> List item -> ( DnDList.Draggable, List item )
getDragIndex : DnDList.Draggable -> Maybe DragIndex
```

```elm
system

draggable : DnDList.Draggable
subscriptions : DnDList.Draggable -> Sub Msg
commands : DnDList.Draggable -> Cmd Msg
dragEvents : DragIndex -> DragElementId -> List (Html.Attribute Msg)
dropEvents : DropIndex -> List (Html.Attribute Msg)
draggedStyles : DnDList.Draggable -> DnDList.Movement -> List (Html.Attribute Msg)
```

[unreleased]: https://github.com/annaghi/dnd-list/compare/5.0.0...v6-zones
[5.0.0]: https://github.com/annaghi/dnd-list/compare/4.0.2...5.0.0
[4.0.2]: https://github.com/annaghi/dnd-list/compare/4.0.1...4.0.2
[4.0.1]: https://github.com/annaghi/dnd-list/compare/4.0.0...4.0.1
[4.0.0]: https://github.com/annaghi/dnd-list/compare/3.0.0...4.0.0
[3.0.0]: https://github.com/annaghi/dnd-list/compare/2.0.0...3.0.0
[2.0.0]: https://github.com/annaghi/dnd-list/compare/1.0.4...2.0.0
[1.0.4]: https://github.com/annaghi/dnd-list/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/annaghi/dnd-list/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/annaghi/dnd-list/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/annaghi/dnd-list/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/annaghi/dnd-list/releases/tag/1.0.0
