module Introduction.BasicElmUI exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Element
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


config : DnDList.Config Fruit
config =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrag
    , operation = DnDList.RotateOut
    , beforeUpdate = \_ _ list -> list
    }


system : DnDList.System Fruit Msg
system =
    DnDList.create config MyMsg



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
    = MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        MyMsg msg ->
            let
                ( draggable, items ) =
                    system.update msg model.draggable model.items
            in
            ( { model | draggable = draggable, items = items }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section []
        [ Element.layout
            [ Element.width Element.fill
            , Element.height Element.fill
            , Element.inFront (draggedItemView model.draggable model.items)
            ]
            (Element.column
                [ Element.centerX, Element.centerY, Element.padding 10, Element.spacing 10 ]
                (model.items |> List.indexedMap (itemView model.draggable))
            )
        ]


itemView : DnDList.Draggable -> Int -> Fruit -> Element.Element Msg
itemView draggable index item =
    let
        itemId : String
        itemId =
            "id-" ++ item
    in
    case system.info draggable of
        Just { dragIndex } ->
            if dragIndex /= index then
                Element.el
                    (Element.htmlAttribute (Html.Attributes.id itemId)
                        :: List.map Element.htmlAttribute (system.dropEvents index itemId)
                    )
                    (Element.text item)

            else
                Element.el
                    [ Element.htmlAttribute (Html.Attributes.id itemId) ]
                    (Element.text "[---------]")

        Nothing ->
            Element.el
                (Element.htmlAttribute (Html.Attributes.id itemId)
                    :: List.map Element.htmlAttribute (system.dragEvents index itemId)
                )
                (Element.text item)


draggedItemView : DnDList.Draggable -> List Fruit -> Element.Element Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Fruit
        maybeDraggedItem =
            system.info draggable
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDraggedItem of
        Just item ->
            Element.el
                (List.map Element.htmlAttribute (system.draggedStyles draggable))
                (Element.text item)

        Nothing ->
            Element.none
