module Configuration.Movement.FreeOnDrag exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

import Browser
import Browser.Events
import DnDList
import Html
import Html.Attributes
import Html.Events
import Json.Decode



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
    List.range 1 9
        |> List.map String.fromInt



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
    , affected : List Int
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = data
    , affected = []
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
    | ClearAffected


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( draggable, items ) =
                    system.update msg model.draggable model.items

                affected : List Int
                affected =
                    case system.info draggable of
                        Just { dragIndex, dropIndex } ->
                            if dragIndex /= dropIndex then
                                dragIndex :: dropIndex :: []

                            else
                                model.affected

                        _ ->
                            model.affected
            in
            ( { model | draggable = draggable, items = items, affected = affected }
            , system.commands model.draggable
            )

        ClearAffected ->
            ( { model | affected = [] }, Cmd.none )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Events.onMouseDown ClearAffected ]
        [ model.items
            |> List.indexedMap (itemView model.draggable model.affected)
            |> Html.div containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : DnDList.Draggable -> List Int -> Int -> Item -> Html.Html Msg
itemView draggable affected index item =
    let
        itemId : String
        itemId =
            "frdrag-" ++ item

        attrs : List (Html.Attribute msg)
        attrs =
            Html.Attributes.id itemId
                :: itemStyles
                ++ (if List.member index affected then
                        affectedItemStyles

                    else
                        []
                   )
    in
    case system.info draggable of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (attrs ++ system.dropEvents index)
                    [ Html.text item ]

            else
                Html.div
                    (attrs ++ placeholderItemStyles)
                    []

        Nothing ->
            Html.div
                (attrs ++ system.dragEvents index itemId)
                [ Html.text item ]


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
    [ Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-template-columns" "50px 50px 50px"
    , Html.Attributes.style "grid-template-rows" "50px 50px 50px"
    , Html.Attributes.style "grid-gap" "1em"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "background" "#aa1e9d"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "1.2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


draggedItemStyles : List (Html.Attribute msg)
draggedItemStyles =
    [ Html.Attributes.style "background" "#1e9daa" ]


placeholderItemStyles : List (Html.Attribute msg)
placeholderItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]


affectedItemStyles : List (Html.Attribute msg)
affectedItemStyles =
    [ Html.Attributes.style "background" "#691361" ]