module Configuration.Groups.InsertBeforeAux exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

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
    , color : String
    }


preparedData : List Item
preparedData =
    [ Item 0 "C" blue
    , Item 0 "II" green
    , Item 0 "2" red
    , Item 0 "I" green
    , Item 0 "3" red
    , Item 0 "III" green
    , Item 0 "" transparent
    , Item 1 "" transparent
    , Item 2 "B" blue
    , Item 2 "A" blue
    , Item 2 "1" red
    , Item 2 "" transparent
    ]



-- SYSTEM


config : DnDList.Groups.Config Item
config =
    { trigger = DnDList.Groups.OnDrag
    , operation = DnDList.Groups.Swap
    , beforeUpdate = \_ _ list -> list
    , groups =
        { trigger = DnDList.Groups.OnDrag
        , operation = DnDList.Groups.InsertBefore
        , beforeUpdate = updateOnGroupChange
        , comparator = compareByGroup
        }
    }


system : DnDList.Groups.System Item Msg
system =
    DnDList.Groups.create config MyMsg


compareByGroup : Item -> Item -> Bool
compareByGroup dragItem dropItem =
    dragItem.group == dropItem.group


updateOnGroupChange : Int -> Int -> List Item -> List Item
updateOnGroupChange dragIndex dropIndex list =
    let
        drop : List Item
        drop =
            list |> List.drop dropIndex |> List.take 1
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == dragIndex then
                    List.map2
                        (\dragItem dropItem -> { dragItem | group = dropItem.group })
                        [ item ]
                        drop

                else
                    [ item ]
            )
        |> List.concat



-- MODEL


type alias Model =
    { dnd : DnDList.Groups.Model
    , items : List Item
    }


initialModel : Model
initialModel =
    { dnd = system.model
    , items = preparedData
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
        [ groupView model 0
        , groupView model 1
        , groupView model 2
        , ghostView model
        ]


groupView : Model -> Int -> Html.Html Msg
groupView model currentGroup =
    model.items
        |> List.filter (\{ group } -> group == currentGroup)
        |> List.indexedMap (itemView model (calculateOffset 0 currentGroup model.items))
        |> Html.div groupStyles


itemView : Model -> Int -> Int -> Item -> Html.Html Msg
itemView model offset localIndex { group, value, color } =
    let
        globalIndex : Int
        globalIndex =
            offset + localIndex

        itemId : String
        itemId =
            "footeraux-" ++ String.fromInt globalIndex
    in
    case ( system.info model.dnd, maybeDragItem model ) of
        ( Just { dragIndex }, Just dragItem ) ->
            if value == "" && group /= dragItem.group then
                Html.div
                    (Html.Attributes.id itemId :: auxiliaryItemStyles ++ system.dropEvents globalIndex itemId)
                    []

            else if value == "" && group == dragItem.group then
                Html.div
                    (Html.Attributes.id itemId :: auxiliaryItemStyles)
                    []

            else if globalIndex /= dragIndex then
                Html.div
                    (Html.Attributes.id itemId :: itemStyles color ++ system.dropEvents globalIndex itemId)
                    [ Html.text value ]

            else
                Html.div
                    (Html.Attributes.id itemId :: itemStyles gray)
                    []

        _ ->
            if value == "" then
                Html.div
                    (Html.Attributes.id itemId :: auxiliaryItemStyles)
                    []

            else
                Html.div
                    (Html.Attributes.id itemId :: itemStyles color ++ system.dragEvents globalIndex itemId)
                    [ Html.text value ]


ghostView : Model -> Html.Html Msg
ghostView model =
    case maybeDragItem model of
        Just { value, color } ->
            Html.div
                (itemStyles color ++ system.ghostStyles model.dnd)
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


gray : String
gray =
    "dimgray"


transparent : String
transparent =
    "transparent"



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "width" "700px"
    , Html.Attributes.style "height" "100%"
    ]


groupStyles : List (Html.Attribute msg)
groupStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "padding-bottom" "3em"
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


auxiliaryItemStyles : List (Html.Attribute msg)
auxiliaryItemStyles =
    [ Html.Attributes.style "flex-grow" "1"
    , Html.Attributes.style "box-sizing" "border-box"
    , Html.Attributes.style "margin-right" "2em"
    , Html.Attributes.style "width" "auto"
    , Html.Attributes.style "height" "50px"
    , Html.Attributes.style "min-width" "50px"
    , Html.Attributes.style "border" "3px dashed dimgray"
    , Html.Attributes.style "background-color" "transparent"
    ]
