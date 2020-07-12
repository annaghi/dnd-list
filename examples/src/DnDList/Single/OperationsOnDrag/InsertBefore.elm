module DnDList.Single.OperationsOnDrag.InsertBefore exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Single
import Html
import Html.Attributes
import Html.Events



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



-- DND


system : DnDList.Single.System Item Msg
system =
    DnDList.Single.config
        |> DnDList.Single.listen DnDList.OnDrag
        |> DnDList.Single.operation DnDList.InsertBefore
        |> DnDList.Single.setItemsBeforeReorder beforeUpdate
        |> DnDList.Single.create DnDMsg


beforeUpdate : Int -> Int -> List Item -> List Item
beforeUpdate dragIndex dropIndex items =
    if dragIndex < dropIndex then
        List.indexedMap
            (\i { value, color } ->
                if i == dragIndex then
                    Item value dragColor

                else if i == dropIndex then
                    Item value dropColor

                else if dragIndex < i && i < dropIndex then
                    Item value affectedColor

                else
                    Item value color
            )
            items

    else if dragIndex > dropIndex then
        List.indexedMap
            (\i { value, color } ->
                if i == dragIndex then
                    Item value dragColor

                else if i == dropIndex then
                    Item value dropColor

                else if dropIndex < i && i < dragIndex then
                    Item value affectedColor

                else
                    Item value color
            )
            items

    else
        items



-- MODEL


type alias Model =
    { items : List Item
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
    | ResetColors


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


itemView : DnDList.Single.Model -> Int -> Item -> Html.Html Msg
itemView dnd index { value, color } =
    let
        itemId : String
        itemId =
            "insertbefore-" ++ value
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


ghostView : DnDList.Single.Model -> List Item -> Html.Html Msg
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
    "transparent"


dragColor : String
dragColor =
    "#3692c7"


dropColor : String
dropColor =
    "#44526f"


affectedColor : String
affectedColor =
    "#eabd00"



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
    , if color == baseColor then
        Html.Attributes.style "border" "1px solid gray"

      else
        Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    ]
