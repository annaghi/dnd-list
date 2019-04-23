module Gallery.Puzzle exposing (Model, Msg, commands, init, initialModel, main, subscriptions, update, view)

import Browser
import DnDList.Groups
import Html
import Html.Attributes
import Random



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


solution : List Item
solution =
    [ Item 0 "A" cyan
    , Item 0 "B" cyan
    , Item 0 "C" cyan
    , Item 0 "D" cyan
    , Item 1 "Ա" blue
    , Item 1 "Բ" blue
    , Item 1 "Գ" blue
    , Item 1 "Դ" blue
    , Item 2 "1" indigo
    , Item 2 "2" indigo
    , Item 2 "3" indigo
    , Item 2 "4" indigo
    , Item 3 "α" purple
    , Item 3 "β" purple
    , Item 3 "γ" purple
    , Item 3 "δ" purple
    ]



-- SYSTEM


config : DnDList.Groups.Config Item
config =
    { movement = DnDList.Groups.Free
    , trigger = DnDList.Groups.OnDrop
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
    , items = []
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, commands )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.draggable



-- COMMANDS


commands : Cmd Msg
commands =
    Random.generate NewGame (shuffle solution)



-- UPDATE


type Msg
    = NewGame (List Item)
    | MyMsg DnDList.Groups.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        NewGame shuffled ->
            ( { model
                | items =
                    shuffled
                        |> List.indexedMap
                            (\i { value, color } ->
                                case modBy 4 i of
                                    0 ->
                                        Item 0 value color

                                    1 ->
                                        Item 1 value color

                                    2 ->
                                        Item 2 value color

                                    3 ->
                                        Item 3 value color

                                    -- Never
                                    _ ->
                                        Item 3 value color
                            )
                        |> List.sortBy .group
              }
            , Cmd.none
            )

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
    Html.section []
        [ List.range 0 3
            |> List.map
                (\i ->
                    groupView model.draggable (model.items |> List.drop (i * 4) |> List.take 4) (i * 4) i
                )
            |> Html.div containerStyles
        , draggedItemView model.draggable model.items
        ]


groupView : DnDList.Groups.Draggable -> List Item -> Int -> Int -> Html.Html Msg
groupView draggable quads offset index =
    quads
        |> List.indexedMap (itemView draggable offset)
        |> Html.div (groupStyles (groupColor index) (quads == (solution |> List.drop offset |> List.take 4)))


itemView : DnDList.Groups.Draggable -> Int -> Int -> Item -> Html.Html Msg
itemView draggable offset localIndex { value, color } =
    let
        globalIndex : Int
        globalIndex =
            localIndex + offset

        itemId : String
        itemId =
            "id-" ++ String.fromInt globalIndex
    in
    case system.info draggable of
        Just { dragIndex, dropIndex } ->
            if dragIndex /= globalIndex && dropIndex /= globalIndex then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles color
                        ++ system.dropEvents globalIndex itemId
                    )
                    [ Html.text value ]

            else if dragIndex /= globalIndex && dropIndex == globalIndex then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles color
                        ++ droppableStyles
                        ++ system.dropEvents globalIndex itemId
                    )
                    [ Html.text value ]

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles gray
                    )
                    []

        _ ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles color
                    ++ system.dragEvents globalIndex itemId
                )
                [ Html.text value ]


draggedItemView : DnDList.Groups.Draggable -> List Item -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Item
        maybeDraggedItem =
            system.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedItem of
        Just { value, color } ->
            Html.div
                (itemStyles color ++ system.draggedStyles draggable)
                [ Html.text value ]

        _ ->
            Html.text ""



-- HELPERS


groupColor : Int -> String
groupColor index =
    case index of
        0 ->
            cyan

        1 ->
            blue

        2 ->
            indigo

        3 ->
            purple

        -- Never
        _ ->
            purple



-- SHUFFLE


{-| See <https://github.com/elm-community/random-extra/blob/3.0.0/src/Random/List.elm#L78>
-}
get : Int -> List a -> Maybe a
get index list =
    list
        |> List.drop index
        |> List.head


choose : List a -> Random.Generator ( Maybe a, List a )
choose list =
    if List.isEmpty list then
        Random.constant ( Nothing, list )

    else
        let
            lastIndex =
                List.length list - 1

            front i =
                List.take i list

            back i =
                List.drop (i + 1) list

            gen =
                Random.int 0 lastIndex
        in
        Random.map
            (\index ->
                ( get index list, List.append (front index) (back index) )
            )
            gen


shuffle : List a -> Random.Generator (List a)
shuffle list =
    if List.isEmpty list then
        Random.constant list

    else
        let
            helper : ( List a, List a ) -> Random.Generator ( List a, List a )
            helper ( done, remaining ) =
                choose remaining
                    |> Random.andThen
                        (\( m_val, shorter ) ->
                            case m_val of
                                Nothing ->
                                    Random.constant ( done, shorter )

                                Just val ->
                                    helper ( val :: done, shorter )
                        )
        in
        Random.map Tuple.first (helper ( [], list ))



-- COLORS


cyan : String
cyan =
    "#44bcf8"


blue : String
blue =
    "#448ff8"


indigo : String
indigo =
    "#4462f8"


purple : String
purple =
    "#5344f8"


gray : String
gray =
    "dimgray"


transparent : String
transparent =
    "transparent"



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-template-columns" "150px 150px"
    , Html.Attributes.style "grid-template-rows" "150px 150px"
    , Html.Attributes.style "grid-gap" "2em"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding" "3em"
    ]


groupStyles : String -> Bool -> List (Html.Attribute msg)
groupStyles color solved =
    let
        bgColor : String
        bgColor =
            if solved then
                color

            else
                transparent
    in
    [ Html.Attributes.style "background" bgColor
    , Html.Attributes.style "box-shadow" ("0 0 0 4px " ++ color)
    , Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-template-columns" "50px 50px"
    , Html.Attributes.style "grid-template-rows" "50px 50px"
    , Html.Attributes.style "grid-gap" "1em"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding" "20px"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "background" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


droppableStyles : List (Html.Attribute msg)
droppableStyles =
    [ Html.Attributes.style "opacity" "0.6" ]
