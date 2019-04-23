module Introduction.Independents exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
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
    String


redData : List Item
redData =
    [ "1", "2", "3", "4" ]


blueData : List Item
blueData =
    [ "A", "B", "C", "D" ]



-- SYSTEM


redConfig : DnDList.Config String
redConfig =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrag
    , operation = DnDList.Swap
    , beforeUpdate = \_ _ list -> list
    }


redSystem : DnDList.System String Msg
redSystem =
    DnDList.create redConfig RedMsg


blueConfig : DnDList.Config String
blueConfig =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrag
    , operation = DnDList.Swap
    , beforeUpdate = \_ _ list -> list
    }


blueSystem : DnDList.System String Msg
blueSystem =
    DnDList.create blueConfig BlueMsg



-- MODEL


type alias Model =
    { redDraggable : DnDList.Draggable
    , blueDraggable : DnDList.Draggable
    , reds : List String
    , blues : List String
    }


initialModel : Model
initialModel =
    { redDraggable = redSystem.draggable
    , blueDraggable = blueSystem.draggable
    , reds = redData
    , blues = blueData
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ redSystem.subscriptions model.redDraggable
        , blueSystem.subscriptions model.blueDraggable
        ]



-- UPDATE


type Msg
    = RedMsg DnDList.Msg
    | BlueMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        RedMsg msg ->
            let
                ( redDraggable, reds ) =
                    redSystem.update msg model.redDraggable model.reds
            in
            ( { model
                | redDraggable = redDraggable
                , reds = reds
              }
            , redSystem.commands model.redDraggable
            )

        BlueMsg msg ->
            let
                ( blueDraggable, blues ) =
                    blueSystem.update msg model.blueDraggable model.blues
            in
            ( { model
                | blueDraggable = blueDraggable
                , blues = blues
              }
            , blueSystem.commands model.blueDraggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section sectionStyles
        [ model.reds
            |> List.indexedMap (redView model.redDraggable)
            |> Html.div containerStyles
        , model.blues
            |> List.indexedMap (blueView model.blueDraggable)
            |> Html.div containerStyles
        , draggedRedView model.redDraggable model.reds
        , draggedBlueView model.blueDraggable model.blues
        ]


redView : DnDList.Draggable -> Int -> String -> Html.Html Msg
redView draggable index item =
    let
        itemId : String
        itemId =
            "red-" ++ item
    in
    case redSystem.info draggable of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles red
                        ++ redSystem.dropEvents index itemId
                    )
                    [ Html.text item ]

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles gray
                    )
                    []

        Nothing ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles red
                    ++ redSystem.dragEvents index itemId
                )
                [ Html.text item ]


blueView : DnDList.Draggable -> Int -> String -> Html.Html Msg
blueView draggable index item =
    let
        itemId : String
        itemId =
            "blue-" ++ item
    in
    case blueSystem.info draggable of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles blue
                        ++ blueSystem.dropEvents index itemId
                    )
                    [ Html.text item ]

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles gray
                    )
                    []

        Nothing ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles blue
                    ++ blueSystem.dragEvents index itemId
                )
                [ Html.text item ]


draggedRedView : DnDList.Draggable -> List String -> Html.Html Msg
draggedRedView draggable items =
    let
        maybeDraggedRed : Maybe String
        maybeDraggedRed =
            redSystem.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedRed of
        Just item ->
            Html.div
                (itemStyles draggedRed ++ redSystem.draggedStyles draggable)
                [ Html.text item ]

        Nothing ->
            Html.text ""


draggedBlueView : DnDList.Draggable -> List String -> Html.Html Msg
draggedBlueView draggable items =
    let
        maybeDraggedBlue : Maybe String
        maybeDraggedBlue =
            blueSystem.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedBlue of
        Just item ->
            Html.div
                (itemStyles draggedBlue ++ blueSystem.draggedStyles draggable)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- HELPERS


attrs : String -> String -> List (Html.Attribute msg)
attrs color itemId =
    Html.Attributes.id itemId :: itemStyles color



-- COLORS


red : String
red =
    "#ff1117"


blue : String
blue =
    "#118eff"


draggedRed : String
draggedRed =
    "#c30005"


draggedBlue : String
draggedBlue =
    "#0067c3"


gray : String
gray =
    "dimgray"



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "padding-top" "2em"
    ]


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin" "0 2em 2em 0"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]
