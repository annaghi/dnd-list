module Introduction.Groups exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

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


type Group
    = Top
    | Bottom


type alias Item =
    { group : Group
    , value : String
    , color : String
    }


gatheredByGroup : List Item
gatheredByGroup =
    [ Item Top "C" blue
    , Item Top "2" red
    , Item Top "1" red
    , Item Top "" transparent
    , Item Bottom "A" blue
    , Item Bottom "D" blue
    , Item Bottom "3" red
    , Item Bottom "B" blue
    , Item Bottom "4" red
    , Item Bottom "" transparent
    ]



-- SYSTEM


config : DnDList.Groups.Config Item
config =
    { operation = DnDList.Groups.RotateOut
    , movement = DnDList.Groups.Free
    , trigger = DnDList.Groups.OnDrag
    , beforeUpdate = updateGroup
    , groups =
        { operation = DnDList.Groups.InsertBefore
        , comparator = groupComparator
        }
    }


updateGroup : Int -> Int -> List Item -> List Item
updateGroup dragIndex dropIndex list =
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
                        (\dragItem dropItem ->
                            { dragItem | group = dropItem.group }
                        )
                        [ item ]
                        drop

                else
                    [ item ]
            )
        |> List.concat


groupComparator : Item -> Item -> Bool
groupComparator dragItem dropItem =
    dragItem.group == dropItem.group


system : DnDList.Groups.System Item Msg
system =
    DnDList.Groups.create config MyMsg



-- MODEL


type alias Model =
    { draggable : DnDList.Groups.Draggable
    , items : List Item
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = gatheredByGroup
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
    = MyMsg DnDList.Groups.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( draggable, items ) =
                    system.update msg model.draggable model.items
            in
            ( { model
                | draggable = draggable
                , items = items
              }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section sectionStyles
        [ model.items
            |> List.filter (\item -> item.group == Top)
            |> List.indexedMap (itemView model 0)
            |> Html.div (containerStyles lightRed)
        , model.items
            |> List.filter (\item -> item.group == Bottom)
            |> List.indexedMap (itemView model (findOffset 0 Bottom model.items))
            |> Html.div (containerStyles lightBlue)
        , draggedItemView model.draggable model.items
        ]


itemView : Model -> Int -> Int -> Item -> Html.Html Msg
itemView model offset localIndex { group, value, color } =
    let
        globalIndex : Int
        globalIndex =
            offset + localIndex

        itemId : String
        itemId =
            "id-" ++ String.fromInt globalIndex
    in
    case ( system.info model.draggable, maybeDraggedItem model.draggable model.items ) of
        ( Just { dragIndex }, Just draggedItem ) ->
            if value == "" && draggedItem.group /= group then
                Html.div (auxStyles ++ system.dropEvents globalIndex) []

            else if value == "" && draggedItem.group == group then
                Html.div auxStyles []

            else if dragIndex /= globalIndex then
                Html.div
                    (attrs color itemId ++ system.dropEvents globalIndex)
                    [ Html.text value ]

            else
                Html.div (attrs gray itemId) []

        _ ->
            if value == "" then
                Html.div auxStyles []

            else
                Html.div
                    (attrs color itemId ++ system.dragEvents globalIndex itemId)
                    [ Html.text value ]


draggedItemView : DnDList.Groups.Draggable -> List Item -> Html.Html Msg
draggedItemView draggable items =
    case maybeDraggedItem draggable items of
        Just { value, color } ->
            Html.div
                (itemStyles color ++ system.draggedStyles draggable)
                [ Html.text value ]

        Nothing ->
            Html.text ""



-- HELPERS


findOffset : Int -> Group -> List Item -> Int
findOffset index group list =
    case list of
        [] ->
            0

        x :: xs ->
            if x.group == group then
                index

            else
                findOffset (index + 1) group xs


attrs : String -> String -> List (Html.Attribute msg)
attrs color itemId =
    Html.Attributes.id itemId :: itemStyles color


maybeDraggedItem : DnDList.Groups.Draggable -> List Item -> Maybe Item
maybeDraggedItem draggable items =
    system.info draggable
        |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)



-- COLORS


red : String
red =
    "#c30005"


blue : String
blue =
    "#0067c3"


lightRed : String
lightRed =
    "#ea9088"


lightBlue : String
lightBlue =
    "#88b0ea"


gray : String
gray =
    "dimgray"


transparent : String
transparent =
    "transparent"



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "table" ]


containerStyles : String -> List (Html.Attribute msg)
containerStyles color =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "padding" "1em"
    , Html.Attributes.style "width" "720px"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    , Html.Attributes.style "background" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin" "0 2em 0 0"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


auxStyles : List (Html.Attribute msg)
auxStyles =
    [ Html.Attributes.style "flex-grow" "1"
    , Html.Attributes.style "width" "auto"
    , Html.Attributes.style "min-width" "50px"
    , Html.Attributes.style "height" "50px"
    ]
