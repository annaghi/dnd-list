module Main exposing (main)

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
    , color : String
    }


gatheredByGroup : List Item
gatheredByGroup =
    [ { group = 0, color = yellow }
    , { group = 0, color = blue }
    , { group = 0, color = green }
    , { group = 1, color = green }
    , { group = 1, color = blue }
    , { group = 1, color = yellow }
    , { group = 2, color = blue }
    , { group = 2, color = yellow }
    , { group = 2, color = green }
    ]



-- SYSTEM


config : DnDList.Groups.Config Item
config =
    { movement = DnDList.Groups.Free
    , trigger = DnDList.Groups.OnDrag
    , operation = DnDList.Groups.Swap
    , beforeUpdate = \_ _ list -> list
    , groups =
        { comparator = compareByGroup
        , operation = DnDList.Groups.Swap
        , beforeUpdate = updateOnGroupChange
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
        drag : List Item
        drag =
            list |> List.drop dragIndex |> List.take 1

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

                else if index == dropIndex then
                    List.map2
                        (\dragItem dropItem -> { dropItem | group = dragItem.group })
                        drag
                        [ item ]

                else
                    [ item ]
            )
        |> List.concat



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
            |> List.filter (\{ group } -> group == 0)
            |> List.indexedMap (itemView model (calculateOffset 0 0 model.items))
            |> Html.div containerStyles
        , model.items
            |> List.filter (\{ group } -> group == 1)
            |> List.indexedMap (itemView model (calculateOffset 0 1 model.items))
            |> Html.div containerStyles
        , model.items
            |> List.filter (\{ group } -> group == 2)
            |> List.indexedMap (itemView model (calculateOffset 0 2 model.items))
            |> Html.div containerStyles
        , draggedItemView model
        ]


itemView : Model -> Int -> Int -> Item -> Html.Html Msg
itemView model offset localIndex { group, color } =
    let
        globalIndex : Int
        globalIndex =
            localIndex + offset

        itemId : String
        itemId =
            "id-" ++ String.fromInt globalIndex

        ( width, height ) =
            if group == 0 then
                ( "120px", "60px" )

            else if group == 2 then
                ( "60px", "120px" )

            else
                ( "60px", "60px" )
    in
    case system.info model.draggable of
        Just { dragIndex } ->
            if globalIndex /= dragIndex then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles color
                        ++ [ Html.Attributes.style "width" width
                           , Html.Attributes.style "height" height
                           ]
                        ++ system.dropEvents globalIndex itemId
                    )
                    []

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles gray
                        ++ [ Html.Attributes.style "width" width
                           , Html.Attributes.style "height" height
                           ]
                    )
                    []

        _ ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles color
                    ++ [ Html.Attributes.style "width" width
                       , Html.Attributes.style "height" height
                       ]
                    ++ system.dragEvents globalIndex itemId
                )
                []


draggedItemView : Model -> Html.Html Msg
draggedItemView model =
    case ( system.info model.draggable, maybeDraggedItem model.draggable model.items ) of
        ( Just { dragIndex, targetElement }, Just { color } ) ->
            let
                width : String
                width =
                    targetElement.element.width |> round |> String.fromInt

                height : String
                height =
                    targetElement.element.height |> round |> String.fromInt
            in
            Html.div
                (itemStyles color
                    ++ system.draggedStyles model.draggable
                    ++ [ Html.Attributes.style "width" (width ++ "px")
                       , Html.Attributes.style "height" (height ++ "px")
                       , Html.Attributes.style "transition" "width 0.5s, height 0.5s"
                       ]
                )
                []

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


maybeDraggedItem : DnDList.Groups.Draggable -> List Item -> Maybe Item
maybeDraggedItem draggable items =
    system.info draggable
        |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)



-- COLORS


green : String
green =
    "#25D366"


yellow : String
yellow =
    "#bfd325"


blue : String
blue =
    "#2592d3"


gray : String
gray =
    "dimgray"



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "padding-top" "2em"
    ]


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "justify-content" "end"
    , Html.Attributes.style "padding-bottom" "3em"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "60px"
    , Html.Attributes.style "height" "60px"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin-right" "2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "background-color" color
    ]
