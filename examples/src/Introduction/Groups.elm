module Introduction.Groups exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

import Browser
import Css
import DnDList.Groups
import Html
import Html.Styled
import Html.Styled.Attributes



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
    , Item Top "A" blue
    , Item Top "" transparent
    , Item Bottom "3" red
    , Item Bottom "B" blue
    , Item Bottom "1" red
    , Item Bottom "" transparent
    ]



-- SYSTEM


config : DnDList.Groups.Config Item
config =
    { movement = DnDList.Groups.Free
    , trigger = DnDList.Groups.OnDrag
    , operation = DnDList.Groups.RotateOut
    , beforeUpdate = \_ _ list -> list
    , groups =
        { comparator = compareByGroup
        , operation = DnDList.Groups.InsertBefore
        , beforeUpdate = updateOnGroupChange
        }
    }


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
    Html.Styled.toUnstyled <|
        Html.Styled.section
            [ sectionStyles ]
            [ model.items
                |> List.filter (\item -> item.group == Top)
                |> List.indexedMap (itemView model (calculateOffset 0 Top model.items))
                |> Html.Styled.div [ containerStyles lightRed ]
            , model.items
                |> List.filter (\item -> item.group == Bottom)
                |> List.indexedMap (itemView model (calculateOffset 0 Bottom model.items))
                |> Html.Styled.div [ containerStyles lightBlue ]
            , draggedItemView model.draggable model.items
            ]


itemView : Model -> Int -> Int -> Item -> Html.Styled.Html Msg
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
                Html.Styled.div
                    (Html.Styled.Attributes.id itemId
                        :: auxiliaryStyles
                        :: List.map Html.Styled.Attributes.fromUnstyled (system.dropEvents globalIndex itemId)
                    )
                    []

            else if value == "" && draggedItem.group == group then
                Html.Styled.div
                    (Html.Styled.Attributes.id itemId
                        :: [ auxiliaryStyles ]
                    )
                    []

            else if dragIndex /= globalIndex then
                Html.Styled.div
                    (Html.Styled.Attributes.id itemId
                        :: itemStyles color
                        :: List.map Html.Styled.Attributes.fromUnstyled (system.dropEvents globalIndex itemId)
                    )
                    [ Html.Styled.text value ]

            else
                Html.Styled.div
                    (Html.Styled.Attributes.id itemId
                        :: [ itemStyles gray ]
                    )
                    []

        _ ->
            if value == "" then
                Html.Styled.div
                    (Html.Styled.Attributes.id itemId
                        :: [ auxiliaryStyles ]
                    )
                    []

            else
                Html.Styled.div
                    (Html.Styled.Attributes.id itemId
                        :: itemStyles color
                        :: List.map Html.Styled.Attributes.fromUnstyled (system.dragEvents globalIndex itemId)
                    )
                    [ Html.Styled.text value ]


draggedItemView : DnDList.Groups.Draggable -> List Item -> Html.Styled.Html Msg
draggedItemView draggable items =
    case maybeDraggedItem draggable items of
        Just { value, color } ->
            Html.Styled.div
                (itemStyles color
                    :: List.map Html.Styled.Attributes.fromUnstyled (system.draggedStyles draggable)
                )
                [ Html.Styled.text value ]

        Nothing ->
            Html.Styled.text ""



-- HELPERS


calculateOffset : Int -> Group -> List Item -> Int
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


sectionStyles : Html.Styled.Attribute msg
sectionStyles =
    Html.Styled.Attributes.css
        [ Css.displayFlex
        , Css.alignItems Css.top
        , Css.justifyContent Css.center
        ]


containerStyles : String -> Html.Styled.Attribute msg
containerStyles color =
    Html.Styled.Attributes.css
        [ Css.display Css.table
        , Css.backgroundColor (Css.hex color)
        , Css.paddingTop (Css.em 3)
        ]


itemStyles : String -> Html.Styled.Attribute msg
itemStyles color =
    Html.Styled.Attributes.css
        [ Css.width (Css.rem 5)
        , Css.height (Css.rem 5)
        , Css.backgroundColor (Css.hex color)
        , Css.borderRadius (Css.px 8)
        , Css.color (Css.hex "#ffffff")
        , Css.cursor Css.pointer
        , Css.margin4 (Css.em 0) Css.auto (Css.em 2) Css.auto
        , Css.displayFlex
        , Css.alignItems Css.center
        , Css.justifyContent Css.center
        , Css.nthLastChild "2" [ Css.marginBottom (Css.px 0) ]
        ]


auxiliaryStyles : Html.Styled.Attribute msg
auxiliaryStyles =
    Html.Styled.Attributes.css
        [ Css.height Css.auto
        , Css.height (Css.rem 3)
        , Css.width (Css.rem 10)
        ]
