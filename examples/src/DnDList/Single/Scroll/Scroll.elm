module DnDList.Single.Scroll.Scroll exposing (..)

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


data : List Item
data =
    List.range 1 100 |> List.map String.fromInt



-- DND


scrollableContainerId : String
scrollableContainerId =
    "scrollable-container-scroll"


system : DnDList.Single.System Item Msg
system =
    DnDList.Single.config
        |> DnDList.Single.scroll scrollableContainerId
        |> DnDList.Single.create DnDMsg



-- MODEL


type alias Model =
    { items : List Item
    , dnd : DnDList.Single.Model
    }


initialModel : Model
initialModel =
    { items = data
    , dnd = system.model
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.dnd



-- UPDATE


type Msg
    = DnDMsg DnDList.Single.Msg


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



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Attributes.style "width" "400px"
        , Html.Attributes.style "padding" "70px 0"
        , if system.info model.dnd /= Nothing then
            Html.Attributes.style "cursor" "grabbing"

          else
            Html.Attributes.style "cursor" "default"
        ]
        [ model.items
            |> List.indexedMap (itemView model.dnd)
            |> Html.div
                [ Html.Attributes.id scrollableContainerId
                , Html.Attributes.style "width" "400px"
                , Html.Attributes.style "overflow" "auto"
                , Html.Attributes.style "display" "flex"
                ]
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Single.Model -> Int -> Item -> Html.Html Msg
itemView dnd index item =
    let
        itemId : String
        itemId =
            "scroll-" ++ item
    in
    case system.info dnd of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (Html.Attributes.id itemId :: itemStyles "#5b84b1" ++ system.dropEvents index itemId)
                    [ Html.text item ]

            else
                Html.div
                    ([ Html.Attributes.id itemId, Html.Attributes.style "color" "#bbbbbb" ] ++ itemStyles "#bbbbbb")
                    [ Html.text item ]

        Nothing ->
            Html.div
                ([ Html.Attributes.id itemId, Html.Attributes.style "cursor" "grab" ] ++ itemStyles "#5b84b1" ++ system.dragEvents index itemId)
                [ Html.text item ]


ghostView : DnDList.Single.Model -> List Item -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Item
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just item ->
            Html.div
                (system.ghostStyles dnd ++ itemStyles "#d64161")
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- STYLES


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "padding" "1rem"
    , Html.Attributes.style "border" "1px solid #bbbbbb"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "box-sizing" "border-box"
    ]
