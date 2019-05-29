module Gallery.Knight exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Bitwise
import Browser
import DnDList
import Html
import Html.Attributes
import Url.Builder



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


type alias Square =
    String


indices8x8 : List Int
indices8x8 =
    List.range 0 63
        |> List.filterMap
            (\index8 ->
                if modBy 8 index8 < 5 && index8 < 39 then
                    Just index8

                else
                    Nothing
            )


squares5x5 : List Square
squares5x5 =
    List.range 0 24
        |> List.map
            (\index5 ->
                if index5 == 12 then
                    "N"

                else
                    ""
            )


knightMoves : List Int
knightMoves =
    [ -17, -15, -10, -6, 6, 10, 15, 17 ]



-- SYSTEM


config : DnDList.Config Square
config =
    { beforeUpdate = beforeUpdate
    , movement = DnDList.Free
    , listen = DnDList.OnDrag
    , operation = DnDList.Swap
    }


system : DnDList.System Square Msg
system =
    DnDList.create config MyMsg


beforeUpdate : Int -> Int -> List Square -> List Square
beforeUpdate dragIndex dropIndex squares =
    List.indexedMap
        (\index5 square ->
            if index5 == dragIndex then
                "N"

            else if index5 == dropIndex then
                "×"

            else
                square
        )
        squares



-- MODEL


type alias Model =
    { squares : List Square
    , solved : Bool
    , dnd : DnDList.Model
    }


initialModel : Model
initialModel =
    { squares = squares5x5
    , solved = False
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
    = MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( dnd, squares ) =
                    system.update msg model.dnd model.squares

                solved : Bool
                solved =
                    (squares |> List.filter (\square -> square == "×") |> List.length) == 24
            in
            ( { model | squares = squares, solved = solved, dnd = dnd }
            , system.commands model.dnd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section []
        [ List.map2 Tuple.pair indices8x8 model.squares
            |> List.indexedMap (squareView model.dnd model.solved)
            |> Html.div containerStyles
        , ghostView model.dnd model.squares
        ]


squareView : DnDList.Model -> Bool -> Int -> ( Int, Square ) -> Html.Html Msg
squareView dnd solved index5 ( index8, square ) =
    let
        id : String
        id =
            "id-" ++ String.fromInt index8

        -- See: https://gamedev.stackexchange.com/a/45003
        color : String
        color =
            if Bitwise.and 1 (Bitwise.xor index8 (Bitwise.shiftRightBy 3 index8)) /= 0 then
                "#d18b47"

            else
                "#ffce9e"

        legalKnightMoves : Int -> List Int
        legalKnightMoves position =
            List.map ((+) position) knightMoves

        knight : Html.Html msg
        knight =
            if solved then
                Html.img
                    [ Html.Attributes.src <| Url.Builder.absolute [ "assets", "images", "gallery", "pegasus.png" ] []
                    , Html.Attributes.style "z-index" "9"
                    ]
                    []

            else
                Html.text "♞"
    in
    case system.info dnd of
        Just { dragIndex } ->
            if square /= "×" && List.member index8 (legalKnightMoves (dragIndex + (dragIndex // 5) * 3)) then
                Html.div
                    (Html.Attributes.id id :: squareStyles color ++ system.dropEvents index5 id)
                    [ Html.text "●" ]

            else if dragIndex == index5 then
                Html.div
                    (Html.Attributes.id id :: squareStyles color)
                    [ Html.text "×" ]

            else
                Html.div
                    (Html.Attributes.id id :: squareStyles color)
                    [ Html.text square ]

        Nothing ->
            if square == "N" then
                Html.div
                    (Html.Attributes.id id :: squareStyles color ++ cursorStyles ++ system.dragEvents index5 id)
                    [ knight ]

            else
                Html.div
                    (Html.Attributes.id id :: squareStyles color)
                    [ Html.text square ]


ghostView : DnDList.Model -> List Square -> Html.Html Msg
ghostView dnd squares =
    let
        maybeDragSquare : Maybe Square
        maybeDragSquare =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> squares |> List.drop dragIndex |> List.head)
    in
    case maybeDragSquare of
        Just square ->
            Html.div
                (squareStyles "transparent" ++ system.ghostStyles dnd)
                [ Html.text "♞" ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-gap" "0"
    , Html.Attributes.style "grid-template-columns" "repeat(5, [col] 5rem)"
    , Html.Attributes.style "grid-template-rows" "repeat(5, [row] 5rem)"
    , Html.Attributes.style "margin" "8rem auto"
    , Html.Attributes.style "padding" "2rem"
    , Html.Attributes.style "background-color" "white"
    , Html.Attributes.style "width" "25rem"
    ]


squareStyles : String -> List (Html.Attribute msg)
squareStyles color =
    [ Html.Attributes.style "background-color" color
    , Html.Attributes.style "color" "black"
    , Html.Attributes.style "font-size" "4.6rem"
    , Html.Attributes.style "line-height" "1"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "justify-content" "center"
    ]


cursorStyles : List (Html.Attribute msg)
cursorStyles =
    [ Html.Attributes.style "cursor" "pointer" ]
