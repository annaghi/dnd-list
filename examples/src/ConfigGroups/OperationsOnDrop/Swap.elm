module ConfigGroups.OperationsOnDrop.Swap exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
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



-- SYSTEM


config : DnDList.Groups.Config Item
config =
    { beforeUpdate = beforeUpdate
    , listen = DnDList.Groups.OnDrop
    , operation = DnDList.Groups.Unaltered
    , groups =
        { listen = DnDList.Groups.OnDrop
        , operation = DnDList.Groups.Swap
        , comparator = comparator
        , setter = setter
        }
    }


comparator : Item -> Item -> Bool
comparator item1 item2 =
    item1.group == item2.group


setter : Item -> Item -> Item
setter item1 item2 =
    { item2 | group = item1.group }


system : DnDList.Groups.System Item Msg
system =
    DnDList.Groups.create config MyMsg


beforeUpdate : Int -> Int -> List Item -> List Item
beforeUpdate dragIndex dropIndex items =
    if dragIndex /= dropIndex then
        List.indexedMap
            (\i item ->
                if i == dropIndex then
                    { item | color = dropColor }

                else if i == dragIndex then
                    { item | color = dragColor }

                else
                    { item | color = baseColor }
            )
            items

    else
        items



-- MODEL


type alias Model =
    { dnd : DnDList.Groups.Model
    , items : List Item
    }


initialModel : Model
initialModel =
    { dnd = system.model
    , items = gatheredData
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
    = MyMsg DnDList.Groups.Msg
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
            "swap-" ++ String.fromInt globalIndex
    in
    case system.info model.dnd of
        Just { dragIndex, dropIndex } ->
            if globalIndex /= dragIndex && globalIndex /= dropIndex then
                Html.div
                    (Html.Attributes.id itemId :: itemStyles color ++ system.dropEvents globalIndex itemId)
                    [ Html.text value ]

            else if globalIndex /= dragIndex && globalIndex == dropIndex then
                Html.div
                    (Html.Attributes.id itemId :: itemStyles dropColor ++ system.dropEvents globalIndex itemId)
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
