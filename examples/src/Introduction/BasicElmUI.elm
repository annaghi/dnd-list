module Introduction.BasicElmUI exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Element
import Element.Font
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


config : DnDList.Config Fruit Msg
config =
    DnDList.config
        { movement = DnDList.Free
        , listen = DnDList.OnDrag
        , operation = DnDList.Rotate
        }


system : DnDList.System Fruit Msg
system =
    DnDList.create DnDMsg config



-- MODEL


type alias Model =
    { items : List Fruit
    , dnd : DnDList.Model
    }


initialModel : Model
initialModel =
    { items = data
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
    = DnDMsg DnDList.Msg


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
    Html.section []
        [ Element.layout
            [ Element.width Element.fill
            , Element.height Element.fill
            , Element.inFront (ghostView model.dnd model.items)
            ]
            (Element.column
                [ Element.centerX, Element.centerY, Element.padding 10, Element.spacing 10 ]
                (model.items |> List.indexedMap (itemView model.dnd))
            )
        ]


itemView : DnDList.Model -> Int -> Fruit -> Element.Element Msg
itemView dnd index item =
    let
        itemId : String
        itemId =
            "id-" ++ item
    in
    case system.info dnd of
        Just { dragIndex } ->
            if dragIndex /= index then
                Element.el
                    (Element.Font.color (Element.rgb 1 1 1)
                        :: Element.htmlAttribute (Html.Attributes.id itemId)
                        :: List.map Element.htmlAttribute (system.dropEvents index itemId)
                    )
                    (Element.text item)

            else
                Element.el
                    [ Element.Font.color (Element.rgb 1 1 1)
                    , Element.htmlAttribute (Html.Attributes.id itemId)
                    ]
                    (Element.text "[---------]")

        Nothing ->
            Element.el
                (Element.Font.color (Element.rgb 1 1 1)
                    :: Element.htmlAttribute (Html.Attributes.id itemId)
                    :: List.map Element.htmlAttribute (system.dragEvents index itemId)
                )
                (Element.text item)


ghostView : DnDList.Model -> List Fruit -> Element.Element Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Fruit
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just item ->
            Element.el
                (Element.Font.color (Element.rgb 1 1 1)
                    :: List.map Element.htmlAttribute (system.ghostStyles dnd)
                )
                (Element.text item)

        Nothing ->
            Element.none
