module Single exposing (Model, Msg, init, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Single
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


type alias Item =
    String


data : List Item
data =
    List.range 1 100 |> List.map String.fromInt



-- DND


scrollableContainerId : String
scrollableContainerId =
    "scrollable-container"


system : DnDList.Single.System Item Msg
system =
    DnDList.Single.config
        |> DnDList.Single.hookItemsBeforeListUpdate (\_ _ list -> list)
        |> DnDList.Single.ghost [ "width", "height", "position" ]
        |> DnDList.Single.movement DnDList.Free
        |> DnDList.Single.listen DnDList.OnDrag
        |> DnDList.Single.operation DnDList.Rotate
        |> DnDList.Single.detectReorder DetectReorder
        --|> DnDList.Single.scroll scrollableContainerId
        --|> DnDList.Single.scrollWithOffset scrollableContainerId
        --    { offset = { top = -40, right = 0, bottom = -40, left = 0 } }
        |> DnDList.Single.scrollWithOffsetAndFence scrollableContainerId
            { offset = { top = 0, right = 0, bottom = 0, left = 0 } }
        --|> DnDList.Single.scrollWithOffsetAndArea scrollableContainerId
        --    { offset = { top = 0, right = 0, bottom = 0, left = 0 }
        --    , area = { top = 40, right = 0, bottom = 40, left = 0 }
        --    }
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


init : ( Model, Cmd Msg )
init =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.dnd



-- UPDATE


type Msg
    = DnDMsg DnDList.Single.Msg
    | DetectReorder Int Int (List Item)


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
                    Debug.log "DetectReorder" dragIndex

                _ =
                    Debug.log "DetectReorder" dropIndex

                _ =
                    Debug.log "DetectReorder" fruits
            in
            ( model, Cmd.none )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Attributes.style "width" "200px"
        , Html.Attributes.style "padding" "100px 0"
        , if system.info model.dnd /= Nothing then
            Html.Attributes.style "cursor" "grabbing"

          else
            Html.Attributes.style "cursor" "default"
        ]
        [ List.range 1 30
            |> List.map (String.fromInt >> (\n -> Html.div [] [ Html.text n ]))
            |> Html.div []
        , model.items
            |> List.indexedMap (itemView model.dnd)
            |> Html.div
                [ Html.Attributes.id scrollableContainerId
                , Html.Attributes.style "height" "300px"
                , Html.Attributes.style "overflow" "auto"
                ]

        --,
        --model.items
        --  |> List.indexedMap (itemView model.dnd)
        --  |> Html.div
        --      [ Html.Attributes.id scrollableContainerId
        --      , Html.Attributes.style "width" "300px"
        --      , Html.Attributes.style "overflow" "auto"
        --      , Html.Attributes.style "display" "flex"
        --      ]
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Single.Model -> Int -> Item -> Html.Html Msg
itemView dnd index item =
    let
        itemId : String
        itemId =
            "single-" ++ item
    in
    case system.info dnd of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (Html.Attributes.id itemId :: itemStyles "#eeeeee" ++ system.dropEvents index itemId)
                    [ Html.text item ]

            else
                Html.div
                    (Html.Attributes.id itemId :: itemStyles "#bbbbbb")
                    [ Html.text item ]

        Nothing ->
            Html.div
                ([ Html.Attributes.id itemId, Html.Attributes.style "cursor" "grab" ] ++ itemStyles "white" ++ system.dragEvents index itemId)
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
                (system.ghostStyles dnd ++ itemStyles "red")
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- STYLES


itemStyles : String -> List (Html.Attribute msg)
itemStyles color =
    [ Html.Attributes.style "padding" "1rem"
    , Html.Attributes.style "border" "1px solid #bbb"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "box-sizing" "border-box"
    ]
