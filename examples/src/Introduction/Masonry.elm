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
    [ "#39a5dc", "#3997dc", "#398adc", "#397cdc", "#396edc", "#3961dc", "#3953dc" ]



-- SYSTEM


config : DnDList.Config Item
config =
    { operation = DnDList.Swap
    , movement = DnDList.Free
    , trigger = DnDList.OnDrag
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

        attrs : List (Html.Attribute msg)
        attrs =
            Html.Attributes.id itemId :: itemStyles color width
    in
    case system.info draggable of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div (attrs ++ system.dropEvents index) []

            else
                Html.div (attrs ++ placeholderItemStyles) []

        Nothing ->
            Html.div (attrs ++ system.dragEvents index itemId) []


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
            Html.div (itemStyles color width ++ system.draggedStyles draggable) []

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "margin" "0 auto"
    , Html.Attributes.style "max-width" "40em"
    ]


itemStyles : Color -> Width -> List (Html.Attribute msg)
itemStyles color width =
    [ Html.Attributes.style "background" color
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "flex" "1 0 auto"
    , Html.Attributes.style "height" "5em"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" (String.fromInt width ++ "px")
    ]


placeholderItemStyles : List (Html.Attribute msg)
placeholderItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]
