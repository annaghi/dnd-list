module DnDList.Groups.HookCommands.DetectReorder exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
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
    [ Item 1 "F" letterColor
    , Item 1 "3" numberColor
    , Item 1 "1" numberColor
    , Item 1 "L" letterColor
    , Item 1 "A" letterColor
    , Item 1 "" transparent
    , Item 2 "4" numberColor
    , Item 2 "S" letterColor
    , Item 2 "8" numberColor
    , Item 2 "M" letterColor
    , Item 2 "" transparent
    ]



-- DND


system : DnDList.Groups.System Item Msg
system =
    DnDList.Groups.config
        |> DnDList.Groups.listen DnDList.OnDrag
        |> DnDList.Groups.operation DnDList.InsertBefore
        |> DnDList.Groups.groups
            { listen = DnDList.OnDrag
            , operation = DnDList.InsertBefore
            , comparator = \item1 item2 -> item1.group == item2.group
            , setter = \item1 item2 -> { item2 | group = item1.group }
            }
        |> DnDList.Groups.detectDrop DetectReorder
        |> DnDList.Groups.create DnDMsg



-- MODEL


type alias Model =
    { items : List Item
    , history : List ( Int, Int )
    , dnd : DnDList.Groups.Model
    }


initialModel : Model
initialModel =
    { items = preparedData
    , history = []
    , dnd = system.model
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
    = DnDMsg DnDList.Groups.Msg
    | DetectReorder Int Int (List Item)


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

        DetectReorder dragIndex dropIndex _ ->
            ( { model | history = ( dragIndex, dropIndex ) :: model.history }
            , Cmd.none
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section []
        [ Html.div [ Html.Attributes.style "display" "flex" ]
            [ historyView model.history
            , groupView model 1
            , groupView model 2
            ]
        , ghostView model.dnd model.items
        ]


historyView : List ( Int, Int ) -> Html.Html Msg
historyView history =
    let
        eventView ( i, j ) =
            Html.li [] [ Html.text (String.fromInt i ++ " ⟷ " ++ String.fromInt j) ]
    in
    history
        |> List.map eventView
        |> (::) (Html.li [] [ Html.text "i ⟷ j" ])
        |> Html.ul [ Html.Attributes.style "list-style" "none", Html.Attributes.style "width" "100px", Html.Attributes.style "font-family" "monospace" ]


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
            "detectreorder-" ++ String.fromInt globalIndex
    in
    case ( system.info model.dnd, maybeDragItem model.dnd model.items ) of
        ( Just { dragIndex, dropIndex }, Just dragItem ) ->
            if value == "" then
                Html.div
                    (Html.Attributes.id itemId :: auxiliaryItemStyles ++ system.dropEvents globalIndex itemId)
                    []

            else if globalIndex /= dragIndex && globalIndex /= dropIndex then
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
            if value == "" then
                Html.div
                    (Html.Attributes.id itemId :: auxiliaryItemStyles)
                    []

            else
                Html.div
                    (Html.Attributes.id itemId :: itemStyles color ++ system.dragEvents globalIndex itemId)
                    [ Html.text value ]


ghostView : DnDList.Groups.Model -> List Item -> Html.Html Msg
ghostView dnd items =
    case maybeDragItem dnd items of
        Just item ->
            Html.div
                (itemStyles item.color ++ system.ghostStyles dnd)
                [ Html.text item.value ]

        Nothing ->
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


maybeDragItem : DnDList.Groups.Model -> List Item -> Maybe Item
maybeDragItem dnd items =
    system.info dnd
        |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)



-- COLORS


dropColor : String
dropColor =
    "gray"


numberColor : String
numberColor =
    "#fb5f51"


letterColor : String
letterColor =
    "#5b84b1"


transparent : String
transparent =
    "transparent"



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex" ]


groupStyles : List (Html.Attribute msg)
groupStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-bottom" "4rem"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "black"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "1.2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    ]


placeholderStyles : List (Html.Attribute msg)
placeholderStyles =
    [ Html.Attributes.style "background-color" "dimgray" ]


auxiliaryItemStyles : List (Html.Attribute msg)
auxiliaryItemStyles =
    [ Html.Attributes.style "flex-grow" "1"
    , Html.Attributes.style "box-sizing" "border-box"
    , Html.Attributes.style "margin-right" "1.5rem"
    , Html.Attributes.style "width" "auto"
    , Html.Attributes.style "height" "50px"
    , Html.Attributes.style "min-width" "50px"
    , Html.Attributes.style "border" "3px dashed gray"
    , Html.Attributes.style "background-color" "transparent"
    ]
