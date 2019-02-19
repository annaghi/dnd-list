module Basic exposing (main)

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


type alias Fruit =
    String


data : List Fruit
data =
    [ "Apples", "Bananas", "Cherries", "Dates" ]



-- SYSTEM


config : DnDList.Config Msg
config =
    { message = DnDMsg
    , movement = DnDList.Free
    }


system : DnDList.System Msg Fruit
system =
    DnDList.create config



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , items : List Fruit
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = data
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
    = DnDMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        DnDMsg message ->
            let
                ( draggable, items ) =
                    system.update message model.draggable model.items
            in
            ( { model | draggable = draggable, items = items }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    let
        maybeDraggedIndex : Maybe Int
        maybeDraggedIndex =
            system.draggedIndex model.draggable
    in
    Html.section
        [ Html.Attributes.style "margin" "6em 0"
        , Html.Attributes.style "text-align" "center"
        ]
        [ model.items
            |> List.indexedMap (itemView maybeDraggedIndex)
            |> Html.div []
        , draggedItemView model.draggable model.items
        ]


itemView : Maybe Int -> Int -> Fruit -> Html.Html Msg
itemView maybeDraggedIndex index item =
    case maybeDraggedIndex of
        Nothing ->
            let
                itemId : String
                itemId =
                    "id-" ++ String.replace " " "-" item
            in
            Html.p
                (Html.Attributes.id itemId :: system.dragEvents index itemId)
                [ Html.text item ]

        Just draggedIndex ->
            if draggedIndex /= index then
                Html.p
                    (system.dropEvents index)
                    [ Html.text item ]

            else
                Html.p [] [ Html.text "[---------]" ]


draggedItemView : DnDList.Draggable -> List Fruit -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Fruit
        maybeDraggedItem =
            system.draggedIndex draggable
                |> Maybe.andThen (\index -> items |> List.drop index |> List.head)
    in
    case maybeDraggedItem of
        Just item ->
            Html.div
                (system.draggedStyles draggable)
                [ Html.text item ]

        Nothing ->
            Html.text ""
