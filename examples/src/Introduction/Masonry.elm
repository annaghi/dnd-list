module Introduction.Masonry exposing (Model, Msg, commands, init, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes
import Random



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


type alias Color =
    String


colors : List Color
colors =
    [ "#acfe2f"
    , "#cefe2f"
    , "#f0fe2f"
    , "#feea2f"
    , "#fec72f"
    , "#fea52f"
    , "#fe832f"
    , "#fe612f"
    , "#fe3f2f"
    ]



-- SYSTEM


config : DnDList.Config Item
config =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrag
    , operation = DnDList.Swap
    , beforeUpdate = \_ _ list -> list
    }


system : DnDList.System Item Msg
system =
    DnDList.create config MyMsg



-- MODEL


type Item
    = Item Color Width


type alias Width =
    Int


type alias Model =
    { draggable : DnDList.Draggable
    , items : List Item
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = []
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, commands )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.draggable



-- COMMANDS


commands : Cmd Msg
commands =
    Random.generate NewMasonry (Random.list (List.length colors) (Random.int 50 200))



-- UPDATE


type Msg
    = NewMasonry (List Int)
    | MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        NewMasonry widths ->
            ( { model
                | items =
                    List.map2 (\color width -> Item color width) colors widths
              }
            , Cmd.none
            )

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
    Html.section []
        [ model.items
            |> List.indexedMap (itemView model.draggable)
            |> Html.div containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : DnDList.Draggable -> Int -> Item -> Html.Html Msg
itemView draggable index (Item color width) =
    let
        itemId : String
        itemId =
            "id-" ++ color
    in
    case system.info draggable of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles color width
                        ++ system.dropEvents index itemId
                    )
                    []

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles "dimgray" width
                    )
                    []

        Nothing ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles color width
                    ++ system.dragEvents index itemId
                )
                []


draggedItemView : DnDList.Draggable -> List Item -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Item
        maybeDraggedItem =
            system.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedItem of
        Just (Item color width) ->
            Html.div
                (itemStyles color width
                    ++ system.draggedStyles draggable
                )
                []

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "margin" "0 auto"
    , Html.Attributes.style "max-width" "40em"
    , Html.Attributes.style "padding-top" "2em"
    ]


itemStyles : Color -> Width -> List (Html.Attribute msg)
itemStyles color width =
    [ Html.Attributes.style "background-color" color
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "flex" "1 0 auto"
    , Html.Attributes.style "height" "4em"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" (String.fromInt width ++ "px")
    ]
