module Config.Movement.FreeOnDrop exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Home exposing (onPointerMove, onPointerUp, releasePointerCapture)
import Html
import Html.Attributes
import Html.Events
import Json.Encode



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
    List.range 1 9
        |> List.map String.fromInt



-- SYSTEM


config : DnDList.Config Item
config =
    { beforeUpdate = \_ _ list -> list
    , movement = DnDList.Free
    , listen = DnDList.OnDrop
    , operation = DnDList.Swap
    }


system : DnDList.System Item Msg
system =
    DnDList.createWithTouch config MyMsg onPointerMove onPointerUp releasePointerCapture



-- MODEL


type alias Model =
    { dnd : DnDList.Model
    , items : List Item
    , affected : List Int
    }


initialModel : Model
initialModel =
    { dnd = system.model
    , items = data
    , affected = []
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
    | ClearAffected


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( dnd, items ) =
                    system.update msg model.dnd model.items

                affected : List Int
                affected =
                    case system.info dnd of
                        Just { dragIndex, dropIndex } ->
                            if dragIndex /= dropIndex then
                                [ dragIndex, dropIndex ]

                            else
                                []

                        _ ->
                            model.affected
            in
            ( { model | dnd = dnd, items = items, affected = affected }
            , system.commands dnd
            )

        ClearAffected ->
            ( { model | affected = [] }, Cmd.none )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Events.onMouseDown ClearAffected
        , Html.Attributes.style "touch-action" "none"
        ]
        [ model.items
            |> List.indexedMap (itemView model.dnd model.affected)
            |> Html.div containerStyles
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Model -> List Int -> Int -> Item -> Html.Html Msg
itemView dnd affected index item =
    let
        itemId : String
        itemId =
            "frdrop-" ++ item

        attrs : List (Html.Attribute msg)
        attrs =
            Html.Attributes.id itemId
                :: itemStyles
                ++ (if List.member index affected then
                        affectedStyles

                    else
                        []
                   )
    in
    case system.info dnd of
        Just { dragIndex, dropIndex } ->
            if dragIndex /= index && dropIndex /= index then
                Html.div
                    (attrs ++ system.dropEvents index itemId)
                    [ Html.text item ]

            else if dragIndex /= index && dropIndex == index then
                Html.div
                    (attrs ++ overedStyles ++ system.dropEvents index itemId)
                    [ Html.text item ]

            else
                Html.div
                    (attrs ++ placeholderStyles)
                    []

        Nothing ->
            Html.div
                (attrs ++ system.dragEvents index itemId)
                [ Html.text item ]


ghostView : DnDList.Model -> List Item -> Html.Html Msg
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
                (itemStyles ++ ghostStyles ++ system.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-template-columns" "50px 50px 50px"
    , Html.Attributes.style "grid-template-rows" "50px 50px 50px"
    , Html.Attributes.style "grid-gap" "1em"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "background-color" "#1e9daa"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "1.2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


placeholderStyles : List (Html.Attribute msg)
placeholderStyles =
    [ Html.Attributes.style "background-color" "dimgray" ]


overedStyles : List (Html.Attribute msg)
overedStyles =
    [ Html.Attributes.style "background-color" "#63bdc7" ]


affectedStyles : List (Html.Attribute msg)
affectedStyles =
    [ Html.Attributes.style "background-color" "#136169" ]


ghostStyles : List (Html.Attribute msg)
ghostStyles =
    [ Html.Attributes.style "background-color" "#aa1e9d" ]
