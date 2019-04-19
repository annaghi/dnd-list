module Introduction.Keyed exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes
import Html.Keyed



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


type alias Item =
    String


type alias KeyedItem =
    ( String, Item )


data : List KeyedItem
data =
    [ "A", "B", "C", "D" ]
        |> List.map (\v -> ( "key-" ++ v, v ))



-- SYSTEM


config : DnDList.Config KeyedItem
config =
    { operation = DnDList.Swap
    , movement = DnDList.Free
    , trigger = DnDList.OnDrag
    , beforeUpdate = \_ _ list -> list
    }


system : DnDList.System KeyedItem Msg
system =
    DnDList.create config MyMsg



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , items : List KeyedItem
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
    Html.section []
        [ model.items
            |> List.indexedMap (itemView model.draggable)
            |> Html.Keyed.node "div" containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : DnDList.Draggable -> Int -> KeyedItem -> ( String, Html.Html Msg )
itemView draggable index ( key, item ) =
    let
        itemId : String
        itemId =
            "id-" ++ item

        attrs : List (Html.Attribute msg)
        attrs =
            Html.Attributes.id itemId :: itemStyles
    in
    case system.info draggable of
        Just { dragIndex } ->
            if dragIndex /= index then
                ( key
                , Html.div
                    (attrs ++ system.dropEvents index)
                    [ Html.text item ]
                )

            else
                ( key
                , Html.div
                    (attrs ++ placeholderItemStyles)
                    []
                )

        Nothing ->
            ( key
            , Html.div
                (attrs ++ system.dragEvents index itemId)
                [ Html.text item ]
            )


draggedItemView : DnDList.Draggable -> List KeyedItem -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe KeyedItem
        maybeDraggedItem =
            system.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedItem of
        Just ( _, item ) ->
            Html.div
                (itemStyles ++ draggedItemStyles ++ system.draggedStyles draggable)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    , Html.Attributes.style "background" "#3da565"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin" "0 2em 2em 0"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


draggedItemStyles : List (Html.Attribute msg)
draggedItemStyles =
    [ Html.Attributes.style "background" "#2f804e" ]


placeholderItemStyles : List (Html.Attribute msg)
placeholderItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]
