module Introduction.Basic_NoTouch exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes


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


config : DnDList.Config Fruit
config =
    { beforeUpdate = \_ _ list -> list
    , movement = DnDList.Free
    , listen = DnDList.OnDrag
    , operation = DnDList.Rotate
    }


system : DnDList.System Fruit Msg
system =
    DnDList.create config MyMsg



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
            , system.commands dnd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Attributes.style "text-align" "center"
        ]
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
