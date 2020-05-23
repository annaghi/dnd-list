module Introduction.Keyed exposing (Model, Msg, initialModel, main, subscriptions, update, view)

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


config : DnDList.Config KeyedItem Msg
config =
    DnDList.config
        { movement = DnDList.Free
        , listen = DnDList.OnDrag
        , operation = DnDList.Swap
        }


system : DnDList.System KeyedItem Msg
system =
    DnDList.create DnDMsg config



-- MODEL


type alias Model =
    { items : List KeyedItem
    , dnd : DnDList.Model
    }


initialModel : Model
initialModel =
    { items = data
    , dnd = system.model
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
    = DnDMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DnDMsg dndMsg ->
            let
                ( items, dndModel, dndCmd ) =
                    system.update model.items dndMsg model.dnd
            in
            ( { model | items = items, dnd = dndModel }
            , dndCmd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section []
        [ model.items
            |> List.indexedMap (itemView model.dnd)
            |> Html.Keyed.node "div" containerStyles
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Model -> Int -> KeyedItem -> ( String, Html.Html Msg )
itemView dnd index ( key, item ) =
    let
        itemId : String
        itemId =
            "id-" ++ item
    in
    case system.info dnd of
        Just { dragIndex } ->
            if dragIndex /= index then
                ( key
                , Html.div
                    (Html.Attributes.id itemId :: itemStyles green ++ system.dropEvents index itemId)
                    [ Html.text item ]
                )

            else
                ( key
                , Html.div
                    (Html.Attributes.id itemId :: itemStyles "dimgray")
                    []
                )

        Nothing ->
            ( key
            , Html.div
                (Html.Attributes.id itemId :: itemStyles green ++ system.dragEvents index itemId)
                [ Html.text item ]
            )


ghostView : DnDList.Model -> List KeyedItem -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe KeyedItem
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just ( _, item ) ->
            Html.div
                (itemStyles ghostGreen ++ system.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- COLORS


green : String
green =
    "#3da565"


ghostGreen : String
ghostGreen =
    "#2f804e"



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-top" "2em"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "5rem"
    , Html.Attributes.style "height" "5rem"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin" "0 2em 2em 0"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]
