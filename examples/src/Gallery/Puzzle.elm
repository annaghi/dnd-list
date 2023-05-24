module Gallery.Puzzle exposing (Model, Msg, commands, initialModel, main, subscriptions, update, view)

import Browser
import DnDList.Groups
import Html
import Html.Attributes
import Random
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
    { beforeUpdate = \_ _ list -> list
    , listen = DnDList.Groups.OnDrag
    , operation = DnDList.Groups.Swap
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



-- MODEL


type alias Model =
    { dnd : DnDList.Groups.Model
    , items : List Item
    }


initialModel : Model
initialModel =
    { dnd = system.model
    , items = []
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, commands )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.dnd



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
                ( dnd, items ) =
                    system.update msg model.dnd model.items
            in
            ( { model | dnd = dnd, items = items }
            , system.commands dnd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section []
        [ List.range 0 3
            |> List.map
                (\i ->
                    groupView model.dnd (model.items |> List.drop (i * 4) |> List.take 4) (i * 4) i
                )
            |> Html.div containerStyles
        , ghostView model.dnd model.items
        ]


groupView : DnDList.Groups.Model -> List Item -> Int -> Int -> Html.Html Msg
groupView dnd quads offset index =
    quads
        |> List.indexedMap (itemView dnd offset)
        |> Html.div (groupStyles (groupColor index) (quads == (solution |> List.drop offset |> List.take 4)))


itemView : DnDList.Groups.Model -> Int -> Int -> Item -> Html.Html Msg
itemView dnd offset localIndex { value, color } =
    let
        globalIndex : Int
        globalIndex =
            offset + localIndex

        itemId : String
        itemId =
            "id-" ++ String.fromInt globalIndex
    in
    case system.info dnd of
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
                        ++ dropStyles
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


ghostView : DnDList.Groups.Model -> List Item -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Item
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just { value, color } ->
            Html.div
                (itemStyles color ++ system.ghostStyles dnd)
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
    , Html.Attributes.style "grid-template-columns" "12em 12em"
    , Html.Attributes.style "grid-template-rows" "12em 12em"
    , Html.Attributes.style "grid-gap" "2em"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding" "3em 0"
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
    [ Html.Attributes.style "background-color" bgColor
    , Html.Attributes.style "box-shadow" ("0 0 0 4px " ++ color)
    , Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-template-columns" "4em 4em"
    , Html.Attributes.style "grid-template-rows" "4em 4em"
    , Html.Attributes.style "grid-gap" "1.4em"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding" "1.3em"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


dropStyles : List (Html.Attribute msg)
dropStyles =
    [ Html.Attributes.style "opacity" "0.6" ]
