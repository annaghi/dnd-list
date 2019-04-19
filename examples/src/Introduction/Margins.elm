module Introduction.Margins exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

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


type alias Item =
    String


data : List Item
data =
    [ "A", "B", "C", "D" ]



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


type alias Model =
    { draggable : DnDList.Draggable
    , items : List Item
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
            |> Html.div containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : DnDList.Draggable -> Int -> Item -> Html.Html Msg
itemView draggable index item =
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
                Html.div
                    [ Html.Attributes.style "margin" "1em" ]
                    [ Html.div
                        (attrs ++ system.dropEvents index)
                        [ Html.text item ]
                    ]

            else
                Html.div
                    [ Html.Attributes.style "margin" "1em" ]
                    [ Html.div (attrs ++ placeholderItemStyles) [] ]

        Nothing ->
            Html.div
                [ Html.Attributes.style "margin" "1em" ]
                [ Html.div
                    (attrs ++ system.dragEvents index itemId)
                    [ Html.text item ]
                ]


draggedItemView : DnDList.Draggable -> List Item -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Item
        maybeDraggedItem =
            system.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedItem of
        Just item ->
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
