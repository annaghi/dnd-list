module Introduction.Independents exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Single
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



-- DND


redSystem : DnDList.Single.System String Msg
redSystem =
    DnDList.Single.config
        |> DnDList.Single.operation DnDList.Swap
        |> DnDList.Single.create RedMsg


blueSystem : DnDList.Single.System String Msg
blueSystem =
    DnDList.Single.config
        |> DnDList.Single.operation DnDList.Swap
        |> DnDList.Single.create BlueMsg



-- MODEL


type alias Model =
    { reds : List String
    , blues : List String
    , redDnD : DnDList.Single.Model
    , blueDnD : DnDList.Single.Model
    }


initialModel : Model
initialModel =
    { reds = redData
    , blues = blueData
    , redDnD = redSystem.model
    , blueDnD = blueSystem.model
    }


init : () -> ( Model, Cmd Msg )
init () =
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
    = RedMsg DnDList.Single.Msg
    | BlueMsg DnDList.Single.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RedMsg redMsg ->
            let
                ( reds, redDnDModel, redCmd ) =
                    redSystem.update model.reds redMsg model.redDnD
            in
            ( { model
                | reds = reds
                , redDnD = redDnDModel
              }
            , redCmd
            )

        BlueMsg blueMsg ->
            let
                ( blues, blueDnDModel, blueCmd ) =
                    blueSystem.update model.blues blueMsg model.blueDnD
            in
            ( { model
                | blues = blues
                , blueDnD = blueDnDModel
              }
            , blueCmd
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


redView : DnDList.Single.Model -> Int -> String -> Html.Html Msg
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


blueView : DnDList.Single.Model -> Int -> String -> Html.Html Msg
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


redGhostView : DnDList.Single.Model -> List String -> Html.Html Msg
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


blueGhostView : DnDList.Single.Model -> List String -> Html.Html Msg
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
                (itemStyles ghostBlue ++ blueSystem.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- COLORS


red : String
red =
    "#d8dee9"


redGhost : String
redGhost =
    "#3f6593"


blue : String
blue =
    "#8ca9cd"


ghostBlue : String
ghostBlue =
    "#3f6593"


gray : String
gray =
    "gainsboro"



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
    [ Html.Attributes.style "width" "5rem"
    , Html.Attributes.style "height" "5rem"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "margin" "0 2em 2em 0"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]
