module DnDList.Groups.OperationsOnDrag.Rotate exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Groups
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
    { group : Int
    , value : String
    , color : String
    }


gatheredData : List Item
gatheredData =
    [ Item 1 "1" baseColor
    , Item 2 "2" baseColor
    , Item 2 "3" baseColor
    , Item 2 "4" baseColor
    , Item 3 "5" baseColor
    , Item 3 "6" baseColor
    , Item 3 "7" baseColor
    , Item 3 "8" baseColor
    , Item 3 "9" baseColor
    ]



-- DND


system : DnDList.Groups.System Item Msg
system =
    DnDList.Groups.config
        |> DnDList.Groups.listen DnDList.OnDrag
        |> DnDList.Groups.operation DnDList.Unaltered
        |> DnDList.Groups.groups
            { listen = DnDList.OnDrag
            , operation = DnDList.Rotate
            , comparator = \item1 item2 -> item1.group == item2.group
            , setter = \item1 item2 -> { item2 | group = item1.group }
            }
        |> DnDList.Groups.hookItemsBeforeListUpdate beforeUpdate
        |> DnDList.Groups.create DnDMsg


beforeUpdate : Int -> Int -> List Item -> List Item
beforeUpdate dragIndex dropIndex items =
    if dragIndex < dropIndex then
        List.indexedMap
            (\i item ->
                if i == dragIndex then
                    { item | color = dragColor }

                else if i == dropIndex then
                    { item | color = dropColor }

                else if dragIndex < i && i < dropIndex then
                    { item | color = affectedColor }

                else
                    item
            )
            items

    else if dragIndex > dropIndex then
        List.indexedMap
            (\i item ->
                if i == dragIndex then
                    { item | color = dragColor }

                else if i == dropIndex then
                    { item | color = dropColor }

                else if dropIndex < i && i < dragIndex then
                    { item | color = affectedColor }

                else
                    item
            )
            items

    else
        items



-- MODEL


type alias Model =
    { items : List Item
    , dnd : DnDList.Groups.Model
    }


initialModel : Model
initialModel =
    { items = gatheredData
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
    = DnDMsg DnDList.Groups.Msg
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
            ( { model | items = List.map (\{ group, value } -> Item group value baseColor) model.items }
            , Cmd.none
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        (Html.Events.onMouseDown ResetColors :: sectionStyles)
        [ groupView model 1
        , groupView model 2
        , groupView model 3
        , ghostView model
        ]


groupView : Model -> Int -> Html.Html Msg
groupView model currentGroup =
    model.items
        |> List.filter (\{ group } -> group == currentGroup)
        |> List.indexedMap (itemView model (calculateOffset 0 currentGroup model.items))
        |> Html.div groupStyles


itemView : Model -> Int -> Int -> Item -> Html.Html Msg
itemView model offset localIndex { value, color } =
    let
        globalIndex : Int
        globalIndex =
            offset + localIndex

        itemId : String
        itemId =
            "rotate-" ++ String.fromInt globalIndex
    in
    case system.info model.dnd of
        Just { dragIndex, dropIndex } ->
            if globalIndex /= dragIndex && globalIndex /= dropIndex then
                Html.div
                    (Html.Attributes.id itemId :: itemStyles color ++ system.dropEvents globalIndex itemId)
                    [ Html.text value ]

            else
                Html.div
                    (Html.Attributes.id itemId :: itemStyles dropColor)
                    []

        _ ->
            Html.div
                (Html.Attributes.id itemId :: itemStyles color ++ system.dragEvents globalIndex itemId)
                [ Html.text value ]


ghostView : Model -> Html.Html Msg
ghostView model =
    case maybeDragItem model of
        Just { value } ->
            Html.div
                (itemStyles dragColor ++ system.ghostStyles model.dnd)
                [ Html.text value ]

        _ ->
            Html.text ""



-- HELPERS


calculateOffset : Int -> Int -> List Item -> Int
calculateOffset index group list =
    case list of
        [] ->
            0

        x :: xs ->
            if x.group == group then
                index

            else
                calculateOffset (index + 1) group xs


maybeDragItem : Model -> Maybe Item
maybeDragItem { dnd, items } =
    system.info dnd
        |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)



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


affectedColor : String
affectedColor =
    "purple"



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "width" "800px"
    ]


groupStyles : List (Html.Attribute msg)
groupStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-bottom" "4rem"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin-right" "1.5rem"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "background-color" color
    ]
