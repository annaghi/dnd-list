[![Latest Version](https://img.shields.io/elm-package/v/annaghi/dnd-list.svg?label=version)](https://package.elm-lang.org/packages/annaghi/dnd-list/latest/) [![Build Status](https://travis-ci.org/annaghi/dnd-list.svg?branch=master)](https://travis-ci.org/annaghi/dnd-list)

# DnD List

Drag and Drop for sortable lists in Elm web apps with mouse support.

[Demos and Sources](https://annaghi.github.io/dnd-list/)

### Examples

```bash
$ npm install -g elm elm-live
$ npm run watch
```

### Basic API

```elm
create : DnDList.Config a -> Msg -> DnDList.System a Msg
```

```elm
update: DnDList.Msg -> DnDList.Model -> List a -> ( DnDList.Model, List a )

dragEvents : DragIndex -> DragElementId -> List (Html.Attribute Msg)

dropEvents : DropIndex -> DropElementId -> List (Html.Attribute Msg)

ghostStyles : DnDList.Model -> List (Html.Attribute Msg)

info : DnDList.Model -> Maybe DnDList.Info
```

### Config

```elm
pseudocode type alias Config a =
    { beforeUpdate : DragIndex -> DropIndex -> List a -> List a

    , movement : Free
               | Horizontal
               | Vertical

    , listen : OnDrag
             | OnDrop

    , operation : InsertAfter
                | InsertBefore
                | Rotate
                | Swap
                | Unaltered
    }
```

### Info

```elm
type alias Info =
    { dragIndex : Int
    , dropIndex : Int
    , dragElementId : String
    , dropElementId : String
    , dragElement : Browser.Dom.Element
    , dropElement : Browser.Dom.Element
    , startPosition : { x : Float, y : Float }
    , currentPosition : { x : Float, y : Float }
    }
```

## Real Projects

- [Risk Register](https://marketplace.atlassian.com/apps/1213146/risk-register?hosting=server&tab=overview) by ProjectBalm is a risk management add-on for Atlassian Jira.  
  _dnd-list_ is used in the risk model editor for re-ordering risk levels, and is even used to re-order the rows and columns of the risk matrix.

## Credits

This package was inspired by the following shiny gems:

- [ir4y/elm-dnd](https://package.elm-lang.org/packages/ir4y/elm-dnd/latest/) :gem:
- [zwilias/elm-reorderable](https://package.elm-lang.org/packages/zwilias/elm-reorderable/latest/)
- [Dart Drag and Drop](https://code.makery.ch/library/dart-drag-and-drop/)
