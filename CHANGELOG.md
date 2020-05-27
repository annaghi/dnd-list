# Changelog

All notable changes to this project will be documented in this file.


## [6.0.1] - 2020-05-27

### Fixes

- Fix broken ghost coordinates when scrolling, see: #50


## [6.0.0] - 2020-03-08

### Added

- Add `startPosition` field to `Info` in the `DnDList` module only.
- Add `currentPosition` field to `Info` in the `DnDList` module only.

### Changed

- Use fixed `position` instead of absolute in `ghostStyles` in both modules.

## [5.0.0] - 2019-05-06

### New

- Transfer groupable items between different groups using only list items as drop elements.
- List state invariant:
  - the list is gathered by the grouping property
  - if there are auxiliary items, they are keep their header or footer places

### Added

- Add new module `DnDList.Groups`.

* Introduce `Info` type alias with a lot of useful fields.
* Add `info` field to `System`.
* Move `dragIndex` field from `System` to `Info` as a field called `dragIndex`.

- Add `beforeUpdate` field to `Config`.
- Add `listen` field to `Config`.
- Add `operation` field to `Config`.

### Changed

- Move `message` field from `Config` to `create` function as a new `Msg` argument.

* Rename `Draggable` type to `Model`.
* Rename `draggable` field to `model` in `System`.

## [4.0.2] - 2019-03-07

### Fixed

- Instead of `Int` use `Float` when extracting mouse position.
- Delete `preventDefault` from `mouseover` because it has no default action.

## [4.0.1] - 2019-02-21

### Docs

- Update README, documentation, and examples for better understanding.

## [4.0.0] - 2019-02-19

### Changed

- Rename `draggedIndex` field to `dragIndex` in `System`.

## [3.0.0] - 2019-02-18

### Changed

- Add `item` type variable to `System`.
- Move `DnDList.update` function into `System` as a new field called `update`.
- Move `DnDList.getDragIndex` function into `System` as a new field called `draggedIndex`.

* Rename `events` field to `message` in `Config`.

## [2.0.0] - 2019-02-17

### Added

- Introduce `Config` type alias.
- Replace `Msg` argument with `Config Msg` in `create` function.
- Add the removed `Msg` from `create` to `Config` as a field called `events`.
- Move `Movement` argument from `draggedStyles` to `Config` as a field called `movement`.

## [1.0.4] - 2019-02-17

### Docs

- Add example using `mdgriffith/elm-ui`.

## [1.0.3] - 2019-02-14

### Docs

- Update README, documentation, and examples for better understanding.

## [1.0.2] - 2019-02-12

### Fixed

- The ghost element's position was animated by setting the left and top properties which trigger layout operations, and that's expensive. The better solution is to use a translate on the element, which does not trigger layout.

## [1.0.1] - 2019-02-08

- No changes, just check how the Elm package system works.

## [1.0.0] - 2019-02-08

### New

- Move items in flat lists.
- List state invariant: none

### Added

- Add module called `DnDList`.

[6.0.0]: https://github.com/annaghi/dnd-list/compare/5.0.0...6.0.0
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
