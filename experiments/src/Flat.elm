module Flat exposing (Model, Msg, init, subscriptions, update, view)

import Browser
import DnDList
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


type alias Fruit =
    String


data : List Fruit
data =
    [ "Apples", "Bananas", "Cherries", "Dates" ]



-- SYSTEM


config : DnDList.Config Fruit Msg
config =
    DnDList.config
        { movement = DnDList.Free
        , listen = DnDList.OnDrag
        , operation = DnDList.Rotate
        }


system : DnDList.System Fruit Msg
system =
    config
        --|> DnDList.hookItemsBeforeListUpdate (\_ _ list -> list)
        --|> DnDList.Groups.ghostProperties [ "width", "height", "position" ]
        |> DnDList.detectReorder DetectReorder
        |> DnDList.create DnDMsg



-- MODEL


type alias Model =
    { dnd : DnDList.Model
    , items : List Fruit
    }


initialModel : Model
initialModel =
    { dnd = system.model
    , items = data
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
    = DnDMsg DnDList.Msg
    | DetectReorder Int Int (List Fruit)


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

        DetectReorder dragIndex dropIndex fruits ->
            let
                _ =
                    Debug.log "DetectDrag" dragIndex

                _ =
                    Debug.log "DetectDrag" dropIndex

                _ =
                    Debug.log "DetectDrag" fruits
            in
            ( model, Cmd.none )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Attributes.style "width" "200px" ]
        [ model.items
            |> List.indexedMap (itemView model.dnd)
            |> Html.div []
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Model -> Int -> Fruit -> Html.Html Msg
itemView dnd index item =
    let
        itemId : String
        itemId =
            "id-" ++ item
    in
    case system.info dnd of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.p
                    (Html.Attributes.id itemId :: system.dropEvents index itemId)
                    [ Html.text item ]

            else
                Html.p
                    [ Html.Attributes.id itemId ]
                    [ Html.text "[---------]" ]

        Nothing ->
            Html.p
                (Html.Attributes.id itemId :: system.dragEvents index itemId)
                [ Html.text item ]


ghostView : DnDList.Model -> List Fruit -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Fruit
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just item ->
            Html.div
                (system.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""
