[![Latest Version](https://img.shields.io/elm-package/v/annaghi/dnd-list.svg?label=version)](https://package.elm-lang.org/packages/annaghi/dnd-list/latest/) [![Build Status](https://travis-ci.org/annaghi/dnd-list.svg?branch=master)](https://travis-ci.org/annaghi/dnd-list)

# DnD List

Drag and Drop for sortable lists in Elm web apps with mouse support.

[Demos and Sources](https://annaghi.github.io/dnd-list/)

## Basic API

```elm
create : DnDList.Config a -> Msg -> DnDList.System a Msg
```

```elm
update: DnDList.Msg -> DnDList.Model -> List a -> ( DnDList.Model, List a )

dragEvents : Int -> String -> List (Html.Attribute Msg)

dropEvents : Int -> String -> List (Html.Attribute Msg)

ghostStyles : DnDList.Model -> List (Html.Attribute Msg)

info : DnDList.Model -> Maybe Info
```

## Config

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

## Info

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

## Example

```elm
module Main exposing (main)

import Browser
import DnDList
import Html
import Html.Attributes



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- DATA


type alias Fruit =
    String


data : List Fruit
data =
    [ "Apples", "Bananas", "Cherries", "Dates" ]



-- SYSTEM


config : DnDList.Config Fruit
config =
    { beforeUpdate = \_ _ list -> list
    , movement = DnDList.Free
    , listen = DnDList.OnDrag
    , operation = DnDList.Rotate
    }


system : DnDList.System Fruit Msg
system =
    DnDList.create config MyMsg



-- MODEL


type alias Model =
    { dnd : DnDList.Model
    , items : List Fruit
    }


initialModel : Model
initialModel =
    { dnd = system.model
    , items = data
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.dnd



-- UPDATE


type Msg
    = MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( dnd, items ) =
                    system.update msg model.dnd model.items
            in
            ( { model | dnd = dnd, items = items }
            , system.commands model.dnd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Attributes.style "text-align" "center" ]
        [ model.items
            |> List.indexedMap (itemView model.dnd)
            |> Html.div []
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Model -> Int -> Fruit -> Html.Html Msg
itemView dnd index item =
    let
        itemId : String
        itemId =
            "id-" ++ item
    in
    case system.info dnd of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.p
                    (Html.Attributes.id itemId :: system.dropEvents index itemId)
                    [ Html.text item ]

            else
                Html.p
                    [ Html.Attributes.id itemId ]
                    [ Html.text "[---------]" ]

        Nothing ->
            Html.p
                (Html.Attributes.id itemId :: system.dragEvents index itemId)
                [ Html.text item ]


ghostView : DnDList.Model -> List Fruit -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Fruit
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just item ->
            Html.div
                (system.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""
```

## Credits

This package was inspired by the following shiny gems:

- [ir4y/elm-dnd](https://package.elm-lang.org/packages/ir4y/elm-dnd/latest/) :gem:
- [zwilias/elm-reorderable](https://package.elm-lang.org/packages/zwilias/elm-reorderable/latest/)
- [Dart Drag and Drop](https://code.makery.ch/library/dart-drag-and-drop/)
