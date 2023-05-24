module Config.OperationsOnDrop.Unaltered exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes
import Html.Events
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


type alias Item =
    { value : String
    , color : String
    }


data : List Item
data =
    List.range 1 9
        |> List.map (\i -> Item (String.fromInt i) baseColor)



-- SYSTEM


config : DnDList.Config Item
config =
    { beforeUpdate = beforeUpdate
    , movement = DnDList.Free
    , listen = DnDList.OnDrop
    , operation = DnDList.Unaltered
    }


system : DnDList.System Item Msg
system =
    DnDList.create config MyMsg onPointerMove onPointerUp releasePointerCapture


beforeUpdate : Int -> Int -> List Item -> List Item
beforeUpdate dragIndex dropIndex items =
    if dragIndex /= dropIndex then
        List.indexedMap
            (\i { value } ->
                if i == dragIndex then
                    Item value dragColor

                else if i == dropIndex then
                    Item value dropColor

                else
                    Item value baseColor
            )
            items

    else
        items



-- MODEL


type alias Model =
    { dnd : DnDList.Model
    , items : List Item
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
    | ResetColors


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( dnd, items ) =
                    system.update msg model.dnd model.items
            in
            ( { model | dnd = dnd, items = items }
            , system.commands dnd
            )

        ResetColors ->
            ( { model | items = List.map (\{ value } -> Item value baseColor) model.items }
            , Cmd.none
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Events.onMouseDown ResetColors ]
        [ model.items
            |> List.indexedMap (itemView model.dnd)
            |> Html.div containerStyles
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Model -> Int -> Item -> Html.Html Msg
itemView dnd index { value, color } =
    let
        itemId : String
        itemId =
            "unaltered-" ++ value
    in
    case system.info dnd of
        Just { dragIndex, dropIndex } ->
            if index /= dragIndex && index /= dropIndex then
                Html.div
                    (Html.Attributes.id itemId :: itemStyles color ++ system.dropEvents index itemId)
                    [ Html.text value ]

            else if index /= dragIndex && index == dropIndex then
                Html.div
                    (Html.Attributes.id itemId :: itemStyles dropColor ++ system.dropEvents index itemId)
                    [ Html.text value ]

            else
                Html.div
                    (Html.Attributes.id itemId :: itemStyles dropColor)
                    []

        _ ->
            Html.div
                (Html.Attributes.id itemId :: itemStyles color ++ system.dragEvents index itemId)
                [ Html.text value ]


ghostView : DnDList.Model -> List Item -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Item
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just { value } ->
            Html.div
                (itemStyles dragColor ++ system.ghostStyles dnd)
                [ Html.text value ]

        Nothing ->
            Html.text ""



-- COLORS


baseColor : String
baseColor =
    "dimgray"


dragColor : String
dragColor =
    "red"


dropColor : String
dropColor =
    "green"



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "background-color" color
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    ]
