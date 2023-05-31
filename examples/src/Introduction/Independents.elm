module Introduction.Independents exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes
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
    { beforeUpdate = \_ _ list -> list
    , movement = DnDList.Free
    , listen = DnDList.OnDrag
    , operation = DnDList.Swap
    }


redSystem : DnDList.System String Msg
redSystem =
    DnDList.create redConfig RedMsg onPointerMove onPointerUp releasePointerCapture


blueConfig : DnDList.Config String
blueConfig =
    { movement = DnDList.Free
    , listen = DnDList.OnDrag
    , operation = DnDList.Swap
    , beforeUpdate = \_ _ list -> list
    }


blueSystem : DnDList.System String Msg
blueSystem =
    DnDList.create blueConfig BlueMsg onPointerMove onPointerUp releasePointerCapture



-- MODEL


type alias Model =
    { redDnD : DnDList.Model
    , blueDnD : DnDList.Model
    , reds : List String
    , blues : List String
    }


initialModel : Model
initialModel =
    { redDnD = redSystem.model
    , blueDnD = blueSystem.model
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
        [ redSystem.subscriptions model.redDnD
        , blueSystem.subscriptions model.blueDnD
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
                ( redDnD, reds ) =
                    redSystem.update msg model.redDnD model.reds
            in
            ( { model
                | redDnD = redDnD
                , reds = reds
              }
            , redSystem.commands redDnD
            )

        BlueMsg msg ->
            let
                ( blueDnD, blues ) =
                    blueSystem.update msg model.blueDnD model.blues
            in
            ( { model
                | blueDnD = blueDnD
                , blues = blues
              }
            , blueSystem.commands blueDnD
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section sectionStyles
        [ model.reds
            |> List.indexedMap (redView model.redDnD)
            |> Html.div containerStyles
        , model.blues
            |> List.indexedMap (blueView model.blueDnD)
            |> Html.div containerStyles
        , redGhostView model.redDnD model.reds
        , blueGhostView model.blueDnD model.blues
        ]


redView : DnDList.Model -> Int -> String -> Html.Html Msg
redView dnd index item =
    let
        itemId : String
        itemId =
            "red-" ++ item
    in
    case redSystem.info dnd of
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


blueView : DnDList.Model -> Int -> String -> Html.Html Msg
blueView dnd index item =
    let
        itemId : String
        itemId =
            "blue-" ++ item
    in
    case blueSystem.info dnd of
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


redGhostView : DnDList.Model -> List String -> Html.Html Msg
redGhostView dnd items =
    let
        maybeDragRed : Maybe String
        maybeDragRed =
            redSystem.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragRed of
        Just item ->
            Html.div
                (itemStyles redGhost ++ redSystem.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""


blueGhostView : DnDList.Model -> List String -> Html.Html Msg
blueGhostView dnd items =
    let
        maybeDragBlue : Maybe String
        maybeDragBlue =
            blueSystem.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragBlue of
        Just item ->
            Html.div
                (itemStyles blueGhost ++ blueSystem.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- COLORS


red : String
red =
    "#ff1117"


blue : String
blue =
    "#118eff"


redGhost : String
redGhost =
    "#c30005"


blueGhost : String
blueGhost =
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
    , Html.Attributes.style "touch-action" "none"
    ]


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "width" "5rem"
    , Html.Attributes.style "height" "5rem"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin" "0 2em 2em 0"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]
