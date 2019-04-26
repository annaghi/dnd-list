module Gallery.Shapes exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes
import Svg
import Svg.Attributes
import Svg.Events



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


type Shape
    = Circle
    | Cross
    | Square
    | Triangle


shapeNumber : Int
shapeNumber =
    4


type alias Item =
    { shape : Shape
    , color : String
    , attempts : Int
    , solved : Bool
    }


data : List Item
data =
    [ Item Circle "#d82775" 0 False
    , Item Cross "#ffcf00" 0 False
    , Item Triangle "#00b2d4" 0 False
    , Item Square "#90e200" 0 False
    , Item Triangle "dimgray" 0 False
    , Item Square "dimgray" 0 False
    , Item Cross "dimgray" 0 False
    , Item Circle "dimgray" 0 False
    ]



-- SYSTEM


config : DnDList.Config Item
config =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrop
    , operation = DnDList.Unaltered
    , beforeUpdate = updateShapes
    }


system : DnDList.System Item Msg
system =
    DnDList.create config MyMsg


updateShapes : Int -> Int -> List Item -> List Item
updateShapes dragIndex dropIndex list =
    let
        drag : List Item
        drag =
            list |> List.drop dragIndex |> List.take 1

        drop : List Item
        drop =
            list |> List.drop dropIndex |> List.take 1

        fit : Bool
        fit =
            List.map2
                (\dragItem dropItem -> dragItem.shape == dropItem.shape)
                drag
                drop
                |> List.foldl (||) False
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == dragIndex && fit then
                    [ { item | color = "transparent", solved = True } ]

                else if index == dropIndex && fit then
                    List.map2
                        (\dragItem dropItem ->
                            { dropItem
                                | attempts = dropItem.attempts + 1
                                , color = dragItem.color
                                , solved = True
                            }
                        )
                        drag
                        [ item ]

                else if index == dropIndex && not fit then
                    [ { item | attempts = item.attempts + 1 } ]

                else
                    [ item ]
            )
        |> List.concat



-- MODEL


type alias Model =
    { dnd : DnDList.Model
    , items : List Item
    }


initialModel : Model
initialModel =
    { dnd = system.model
    , items = data
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
    = MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( dnd, items ) =
                    system.update msg model.dnd model.items
            in
            ( { model | dnd = dnd, items = items }
            , system.commands model.dnd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section []
        [ scoreView model.items
        , model.items
            |> List.take shapeNumber
            |> List.indexedMap (shapeView model.dnd)
            |> Html.div containerStyles
        , model.items
            |> List.drop shapeNumber
            |> List.indexedMap (holeView model.dnd)
            |> Html.div containerStyles
        , ghostView model.dnd model.items
        ]


scoreView : List Item -> Html.Html Msg
scoreView items =
    let
        attempts : String
        attempts =
            items |> List.drop shapeNumber |> List.foldl (.attempts >> (+)) 0 |> String.fromInt
    in
    Html.div
        [ Html.Attributes.style "padding-bottom" "3em"
        , Html.Attributes.style "text-align" "center"
        ]
        [ Html.text ("Attempts: " ++ attempts) ]


shapeView : DnDList.Model -> Int -> Item -> Html.Html Msg
shapeView dnd index { shape, color, solved } =
    let
        itemId : String
        itemId =
            "shape-" ++ String.fromInt index
    in
    case system.info dnd of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    wrapperStyles
                    [ svgShapeView shape color [ Html.Attributes.id itemId ] ]

            else
                Html.div
                    wrapperStyles
                    []

        _ ->
            if solved then
                Html.div
                    wrapperStyles
                    []

            else
                Html.div
                    wrapperStyles
                    [ svgShapeView shape color (Html.Attributes.id itemId :: system.dragEvents index itemId) ]


holeView : DnDList.Model -> Int -> Item -> Html.Html Msg
holeView dnd index { shape, color } =
    let
        globalIndex : Int
        globalIndex =
            index + shapeNumber

        itemId : String
        itemId =
            "hole-" ++ String.fromInt globalIndex
    in
    case system.info dnd of
        Just _ ->
            Html.div
                wrapperStyles
                [ svgShapeView shape color (Html.Attributes.id itemId :: system.dropEvents globalIndex itemId) ]

        _ ->
            Html.div
                wrapperStyles
                [ svgShapeView shape color [ Html.Attributes.id itemId ] ]


ghostView : DnDList.Model -> List Item -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Item
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just { shape, color } ->
            svgShapeView shape color (system.ghostStyles dnd)

        Nothing ->
            Html.text ""


svgShapeView : Shape -> String -> List (Html.Attribute Msg) -> Html.Html Msg
svgShapeView shape color dnd =
    Svg.svg
        ([ Svg.Attributes.width "100"
         , Svg.Attributes.height "100"
         , Svg.Attributes.viewBox "0 0 100 100"
         ]
            ++ dnd
        )
        [ case shape of
            Circle ->
                circle color

            Cross ->
                cross color

            Square ->
                rectangle color

            Triangle ->
                triangle color
        ]



-- SHAPES


circle : String -> Html.Html msg
circle color =
    Svg.circle
        [ Svg.Attributes.cx "50%"
        , Svg.Attributes.cy "50%"
        , Svg.Attributes.r "49"
        , Svg.Attributes.fill color
        ]
        []


cross : String -> Html.Html msg
cross color =
    Svg.g []
        [ Svg.line
            [ Svg.Attributes.x1 "10"
            , Svg.Attributes.y1 "10"
            , Svg.Attributes.x2 "90"
            , Svg.Attributes.y2 "90"
            , Svg.Attributes.strokeWidth "40"
            , Svg.Attributes.stroke color
            ]
            []
        , Svg.line
            [ Svg.Attributes.x1 "90"
            , Svg.Attributes.y1 "10"
            , Svg.Attributes.x2 "10"
            , Svg.Attributes.y2 "90"
            , Svg.Attributes.strokeWidth "40"
            , Svg.Attributes.stroke color
            ]
            []
        ]


rectangle : String -> Html.Html msg
rectangle color =
    Svg.rect
        [ Svg.Attributes.width "100"
        , Svg.Attributes.height "100"
        , Svg.Attributes.fill color
        ]
        []


triangle : String -> Html.Html msg
triangle color =
    Svg.polygon
        [ Svg.Attributes.points "50,0 100,100 0,100"
        , Svg.Attributes.fill color
        ]
        []



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


wrapperStyles : List (Html.Attribute msg)
wrapperStyles =
    [ Html.Attributes.style "width" "160px"
    , Html.Attributes.style "height" "160px"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]
