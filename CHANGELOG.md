# Changelog

All notable changes to this project will be documented in this file.

## [7.0.0] - upcoming

### Fixes

-   Stop sending messages from commands

### Features

### Maintenance

-   Update README, documentation, and examples reflecting the new API

## [6.0.0] - 2020-03-08

### Fixes

-   Use fixed `position` instead of absolute for `ghostStyles` in both modules, see: #50

### Features

-   Add `startPosition` field to `Info` in the `DnDList` module only, see: #65
-   Add `currentPosition` field to `Info` in the `DnDList` module only, see: #65

## [5.0.0] - 2019-05-06

### Features

-   Reorder items in groupable lists in the module `DnDList.Groups`
-   List state invariant:
    -   the list is gathered by the grouping property
    -   if there are auxiliary items, they are keep their places as headers or footers

*   Introduce `Info` type alias with a lot of useful fields
*   Add `info` field to `System`

## [4.0.2] - 2019-03-07

### Fixes

-   Instead of `Int` use `Float` when extracting mouse coordinates
-   Delete `preventDefault` from `mouseover` because it has no default action

## [4.0.1] - 2019-02-21

### Maintenance

-   Update README, documentation, and examples for better understanding

## [4.0.0] - 2019-02-19

### Maintenance

-   Rename `draggedIndex` field to `dragIndex` in `System`

## [3.0.0] - 2019-02-18

### Maintenance

-   Add `item` type variable to `System`
-   Move `DnDList.update` function into `System` as a new field called `update`
-   Move `DnDList.getDragIndex` function into `System` as a new field called `draggedIndex`

## [2.0.0] - 2019-02-17

### Maintenance

-   Introduce `Config` type alias

## [1.0.4] - 2019-02-17

### Maintenance

-   Add example using `mdgriffith/elm-ui`, see: #2

## [1.0.3] - 2019-02-14

### Maintenance

-   Update README, documentation, and examples for better understanding

## [1.0.2] - 2019-02-12

### Fixes

-   Move ghost with `translate` instead of `position`, see: #1

## [1.0.1] - 2019-02-08

-   No changes, just checking how the Elm package system works

## [1.0.0] - 2019-02-08

### Features

-   Reorder items in flat lists in the module `DnDList`
-   List state invariant: none

[7.0.0]: https://github.com/annaghi/dnd-list/compare/6.0.0...7.0.0
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
