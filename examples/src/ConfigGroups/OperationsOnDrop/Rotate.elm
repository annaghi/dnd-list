module ConfigGroups.OperationsOnDrop.Rotate exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList.Groups
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
    { group : Int
    , value : String
    }


gatheredData : List Item
gatheredData =
    [ Item 1 "1"
    , Item 2 "2"
    , Item 2 "3"
    , Item 2 "4"
    , Item 3 "5"
    , Item 3 "6"
    , Item 3 "7"
    , Item 3 "8"
    , Item 3 "9"
    ]



-- SYSTEM


config : DnDList.Groups.Config Item
config =
    { beforeUpdate = \_ _ list -> list
    , listen = DnDList.Groups.OnDrop
    , operation = DnDList.Groups.Unaltered
    , groups =
        { listen = DnDList.Groups.OnDrop
        , operation = DnDList.Groups.Rotate
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


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( dnd, items ) =
                    system.update msg model.dnd model.items
            in
            ( { model | dnd = dnd, items = items }
            , system.commands model.dnd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section sectionStyles
        [ groupView model 1 red
        , groupView model 2 blue
        , groupView model 3 green
        , ghostView model
        ]


groupView : Model -> Int -> String -> Html.Html Msg
groupView model currentGroup bgColor =
    model.items
        |> List.filter (\{ group } -> group == currentGroup)
        |> List.indexedMap (itemView model (calculateOffset 0 currentGroup model.items))
        |> Html.div (groupStyles bgColor)


itemView : Model -> Int -> Int -> Item -> Html.Html Msg
itemView model offset localIndex { group, value } =
    let
        globalIndex : Int
        globalIndex =
            offset + localIndex

        itemId : String
        itemId =
            "rotate-" ++ String.fromInt globalIndex
    in
    case system.info model.dnd of
        Just { dragIndex } ->
            if globalIndex /= dragIndex then
                Html.div
                    (Html.Attributes.id itemId :: itemStyles dark ++ system.dropEvents globalIndex itemId)
                    [ Html.text value ]

            else
                Html.div
                    (Html.Attributes.id itemId :: itemStyles gray)
                    []

        _ ->
            Html.div
                (Html.Attributes.id itemId :: itemStyles dark ++ system.dragEvents globalIndex itemId)
                [ Html.text value ]


ghostView : Model -> Html.Html Msg
ghostView model =
    case maybeDragItem model of
        Just { value } ->
            Html.div
                (itemStyles dark ++ system.ghostStyles model.dnd)
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


green : String
green =
    "#757b3d"


red : String
red =
    "#8c4585"


blue : String
blue =
    "#45858c"


dark : String
dark =
    "#292929"


gray : String
gray =
    "#333333"


transparent : String
transparent =
    "transparent"



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "width" "800px"
    ]


groupStyles : String -> List (Html.Attribute msg)
groupStyles color =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding" "1em 0"
    , Html.Attributes.style "background-color" color
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin-right" "2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "background-color" color
    ]
