module Introduction.Masonry exposing (Model, Msg, commands, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes
import Random
import Json.Encode




import Home exposing (onPointerMove, onPointerUp, releasePointerCapture)
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
    { beforeUpdate = \_ _ list -> list
    , movement = DnDList.Free
    , listen = DnDList.OnDrag
    , operation = DnDList.Swap
    }


system : DnDList.System Item Msg
system =
    DnDList.create config MyMsg onPointerMove onPointerUp releasePointerCapture



-- MODEL


type alias Width =
    Int


type Item
    = Item Color Width


type alias Model =
    { dnd : DnDList.Model
    , items : List Item
    }


initialModel : Model
initialModel =
    { dnd = system.model
    , items = []
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, commands )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.dnd



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
                ( dnd, items ) =
                    system.update msg model.dnd model.items
            in
            ( { model | dnd = dnd, items = items }
            , system.commands dnd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section 
        [ Html.Attributes.style "touch-action" "none" ]
        [ model.items
            |> List.indexedMap (itemView model.dnd)
            |> Html.div containerStyles
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Model -> Int -> Item -> Html.Html Msg
itemView dnd index (Item color width) =
    let
        itemId : String
        itemId =
            "id-" ++ color
    in
    case system.info dnd of
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


ghostView : DnDList.Model -> List Item -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Item
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just (Item color width) ->
            Html.div
                (itemStyles color width
                    ++ system.ghostStyles dnd
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
    , Html.Attributes.style "height" "4.5rem"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" (String.fromInt width ++ "px")
    ]
