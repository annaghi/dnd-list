module Groups exposing (Model, Msg, init, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Groups
import Html
import Html.Attributes



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = \_ -> init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- DATA


type Group
    = Left
    | Right


type alias Item =
    { group : Group
    , value : String
    , color : String
    }


preparedData : List Item
preparedData =
    [ Item Left "C" blue
    , Item Left "2" red
    , Item Left "A" blue
    , Item Left "footer" transparent
    , Item Right "3" red
    , Item Right "1" red
    , Item Right "B" blue
    , Item Right "footer" transparent
    ]



-- SYSTEM


system : DnDList.Groups.System Item Msg
system =
    DnDList.Groups.config
        |> DnDList.Groups.listen DnDList.OnDrag
        |> DnDList.Groups.operation DnDList.Rotate
        |> DnDList.Groups.groups
            { listen = DnDList.OnDrag
            , operation = DnDList.InsertBefore
            , comparator = \item1 item2 -> item1.group == item2.group
            , setter = \item1 item2 -> { item2 | group = item1.group }
            }
        |> DnDList.Groups.hookItemsBeforeListUpdate (\_ _ list -> list)
        |> DnDList.Groups.ghost [ "width", "height", "position" ]
        |> DnDList.Groups.detectDrop DetectDrop
        |> DnDList.Groups.create DnDMsg



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


init : ( Model, Cmd Msg )
init =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.dnd



-- UPDATE


type Msg
    = DnDMsg DnDList.Groups.Msg
    | DetectDrop Int Int (List Item)


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

        DetectDrop dragIndex dropIndex fruits ->
            let
                _ =
                    Debug.log "DetectDrop" dragIndex

                _ =
                    Debug.log "DetectDrop" dropIndex

                _ =
                    Debug.log "DetectDrop" fruits
            in
            ( model, Cmd.none )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section sectionStyles
        [ groupView model Left lightRed
        , groupView model Right lightBlue
        , ghostView model.dnd model.items
        ]


groupView : Model -> Group -> String -> Html.Html Msg
groupView model group color =
    model.items
        |> List.filter (\item -> item.group == group)
        |> List.indexedMap (itemView model (calculateOffset 0 group model.items))
        |> Html.div (groupStyles color)


itemView : Model -> Int -> Int -> Item -> Html.Html Msg
itemView model offset localIndex { group, value, color } =
    let
        globalIndex : Int
        globalIndex =
            offset + localIndex

        itemId : String
        itemId =
            "groups-" ++ String.fromInt globalIndex
    in
    case ( system.info model.dnd, maybeDragItem model.dnd model.items ) of
        ( Just { dragIndex }, Just dragItem ) ->
            if color == transparent && value == "footer" && dragItem.group /= group then
                Html.div
                    (Html.Attributes.id itemId
                        :: auxiliaryStyles
                        ++ system.dropEvents globalIndex itemId
                    )
                    []

            else if color == transparent && value == "footer" && dragItem.group == group then
                Html.div
                    (Html.Attributes.id itemId
                        :: auxiliaryStyles
                    )
                    []

            else if dragIndex /= globalIndex then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles color
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
            if color == transparent && value == "footer" then
                Html.div
                    (Html.Attributes.id itemId
                        :: auxiliaryStyles
                    )
                    []

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles color
                        ++ system.dragEvents globalIndex itemId
                    )
                    [ Html.text value ]


ghostView : DnDList.Groups.Model -> List Item -> Html.Html Msg
ghostView dnd items =
    case maybeDragItem dnd items of
        Just { value, color } ->
            Html.div
                (itemStyles color ++ system.ghostStyles dnd)
                [ Html.text value ]

        Nothing ->
            Html.text ""



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


maybeDragItem : DnDList.Groups.Model -> List Item -> Maybe Item
maybeDragItem dnd items =
    system.info dnd
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
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "top"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "align-items" "flex-start"
    , Html.Attributes.style "padding-top" "2rem"
    , Html.Attributes.style "height" "41rem"
    ]


groupStyles : String -> List (Html.Attribute msg)
groupStyles color =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "padding-top" "2rem"
    , Html.Attributes.style "min-height" "19rem"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "5rem"
    , Html.Attributes.style "height" "5rem"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "#ffffff"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin" "0 auto 1rem auto"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


{-| We can do much better with pseudo-classes.
-}
auxiliaryStyles : List (Html.Attribute msg)
auxiliaryStyles =
    [ Html.Attributes.style "flex-grow" "1"
    , Html.Attributes.style "height" "auto"
    , Html.Attributes.style "min-height" "1rem"
    , Html.Attributes.style "width" "8rem"
    ]
