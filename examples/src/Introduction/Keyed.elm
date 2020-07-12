module Introduction.Keyed exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Single
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



-- DND


system : DnDList.Single.System KeyedItem Msg
system =
    DnDList.Single.config
        |> DnDList.Single.operation DnDList.Swap
        |> DnDList.Single.create DnDMsg



-- MODEL


type alias Model =
    { items : List KeyedItem
    , dnd : DnDList.Single.Model
    }


initialModel : Model
initialModel =
    { items = data
    , dnd = system.model
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.dnd



-- UPDATE


type Msg
    = DnDMsg DnDList.Single.Msg


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


itemView : DnDList.Single.Model -> Int -> KeyedItem -> ( String, Html.Html Msg )
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
                    (Html.Attributes.id itemId :: itemStyles blue ++ system.dropEvents index itemId)
                    [ Html.text item ]
                )

            else
                ( key
                , Html.div
                    (Html.Attributes.id itemId :: itemStyles "gainsboro")
                    []
                )

        Nothing ->
            ( key
            , Html.div
                (Html.Attributes.id itemId :: itemStyles blue ++ system.dragEvents index itemId)
                [ Html.text item ]
            )


ghostView : DnDList.Single.Model -> List KeyedItem -> Html.Html Msg
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
                (itemStyles ghostBlue ++ system.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- COLORS


blue : String
blue =
    "#8ca9cd"


ghostBlue : String
ghostBlue =
    "#3f6593"



-- "#5e81ac"
-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-top" "2rem"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "5rem"
    , Html.Attributes.style "height" "5rem"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin" "0 2rem 2rem 0"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]
