[![Latest Version](https://img.shields.io/elm-package/v/annaghi/dnd-list.svg?label=version)](https://package.elm-lang.org/packages/annaghi/dnd-list/latest/)

# DnD List

Drag and Drop for sortable lists in Elm web apps with mouse support.

[Demos and Sources](https://annaghi.github.io/dnd-list/)

## Basic API

```elm
create : DnDList.Config a -> Msg -> DnDList.System a Msg
```

```elm
update: DnDList.Msg -> DnDList.Draggable -> List a -> ( DnDList.Draggable, List a )

dragEvents : Int -> String -> List (Html.Attribute Msg)

dropEvents : Int -> String -> List (Html.Attribute Msg)

draggedStyles : DnDList.Draggable -> List (Html.Attribute Msg)

info : DnDList.Draggable -> Maybe Info
```

## Config

```elm
pseudocode type alias Config a =
    { movement : Free | Horizontal | Vertical
    , trigger : OnDrag | OnDrop
    , operation : InsertAfter | InsertBefore | RotateIn | RotateOut | Swap | Unmove
    , beforeUpdate : DragIndex -> DropIndex -> List a -> List a
    }
```

## Info

```elm
type alias Info =
    { dragIndex : Int
    , dropIndex : Int
    , sourceElement : Browser.Dom.Element
    , sourceElementId : String
    , targetElement : Browser.Dom.Element
    , targetElementId : String
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
    { movement = DnDList.Free
    , trigger = DnDList.OnDrag
    , operation = DnDList.RotateOut
    , beforeUpdate = \_ _ list -> list
    }


system : DnDList.System Fruit Msg
system =
    DnDList.create config MyMsg



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , items : List Fruit
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = data
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.draggable



-- UPDATE


type Msg
    = MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( draggable, items ) =
                    system.update msg model.draggable model.items
            in
            ( { model | draggable = draggable, items = items }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Attributes.style "text-align" "center" ]
        [ model.items
            |> List.indexedMap (itemView model.draggable)
            |> Html.div []
        , draggedItemView model.draggable model.items
        ]


itemView : DnDList.Draggable -> Int -> Fruit -> Html.Html Msg
itemView draggable index item =
    let
        itemId : String
        itemId =
            "id-" ++ item
    in
    case system.info draggable of
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


draggedItemView : DnDList.Draggable -> List Fruit -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Fruit
        maybeDraggedItem =
            system.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedItem of
        Just item ->
            Html.div
                (system.draggedStyles draggable)
                [ Html.text item ]

        Nothing ->
            Html.text ""
```

## Credits

This package was inspired by the following shiny gems:

- [ir4y/elm-dnd](https://package.elm-lang.org/packages/ir4y/elm-dnd/latest/) :gem:
- [zwilias/elm-reorderable](https://package.elm-lang.org/packages/zwilias/elm-reorderable/latest/)
- [Dart Drag and Drop](https://code.makery.ch/library/dart-drag-and-drop/)
