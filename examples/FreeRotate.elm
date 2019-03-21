module FreeRotate exposing (main)

import Browser
import DnDList
import Html
import Html.Attributes
import Html.Keyed



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


type alias KeyedItem =
    ( String, Int )


data : List KeyedItem
data =
    List.range 1 9
        |> List.indexedMap Tuple.pair
        |> List.map (\( k, v ) -> ( "key-" ++ String.fromInt k, v ))



-- SYSTEM


config : DnDList.Config Msg
config =
    { message = MyMsg
    , movement = DnDList.Free DnDList.Rotate
    }


system : DnDList.System Msg KeyedItem
system =
    DnDList.create config



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , items : List KeyedItem
    , affected : List Int
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = data
    , affected = []
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
    = MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        MyMsg message ->
            let
                ( draggable, items ) =
                    system.update message model.draggable model.items

                ( maybeDragIndex, maybeDropIndex ) =
                    ( system.dragIndex draggable, system.dropIndex draggable )

                affected =
                    case ( maybeDragIndex, maybeDropIndex ) of
                        ( Just dragIndex, Just dropIndex ) ->
                            if dragIndex < dropIndex then
                                List.range dragIndex dropIndex

                            else if dragIndex > dropIndex then
                                List.range dropIndex dragIndex

                            else
                                model.affected

                        _ ->
                            model.affected
            in
            ( { model | draggable = draggable, items = items, affected = affected }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    let
        maybeDragIndex : Maybe Int
        maybeDragIndex =
            system.dragIndex model.draggable
    in
    Html.section
        [ Html.Attributes.style "margin" "6em 0 3em 0" ]
        [ model.items
            |> List.indexedMap (itemView model.affected maybeDragIndex)
            |> Html.Keyed.node "div" containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : List Int -> Maybe Int -> Int -> KeyedItem -> ( String, Html.Html Msg )
itemView affected maybeDragIndex index ( key, item ) =
    case maybeDragIndex of
        Nothing ->
            let
                itemId : String
                itemId =
                    "id-" ++ String.fromInt item

                styles : List (Html.Attribute Msg)
                styles =
                    itemStyles
                        ++ (if List.member index affected then
                                affectedItemStyles

                            else
                                []
                           )
            in
            ( key
            , Html.div
                (Html.Attributes.id itemId :: styles ++ system.dragEvents index itemId)
                [ Html.div [] [ Html.text (String.fromInt item) ] ]
            )

        Just dragIndex ->
            if dragIndex /= index then
                ( key
                , Html.div
                    (itemStyles ++ system.dropEvents index)
                    [ Html.div [] [ Html.text (String.fromInt item) ] ]
                )

            else
                ( key
                , Html.div (itemStyles ++ overedItemStyles) []
                )


draggedItemView : DnDList.Draggable -> List KeyedItem -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe KeyedItem
        maybeDraggedItem =
            system.dragIndex draggable
                |> Maybe.andThen (\index -> items |> List.drop index |> List.head)
    in
    case maybeDraggedItem of
        Just ( _, item ) ->
            Html.div
                (itemStyles ++ draggedItemStyles ++ system.draggedStyles draggable)
                [ Html.div [] [ Html.text (String.fromInt item) ] ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-template-columns" "5em 5em 5em"
    , Html.Attributes.style "grid-template-rows" "5em 5em 5em"
    , Html.Attributes.style "grid-gap" "5em"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "background" "#1a8994"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "large"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


draggedItemStyles : List (Html.Attribute msg)
draggedItemStyles =
    [ Html.Attributes.style "background" "#941a89" ]


overedItemStyles : List (Html.Attribute msg)
overedItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]


affectedItemStyles : List (Html.Attribute msg)
affectedItemStyles =
    [ Html.Attributes.style "background" "#0f4d53" ]
