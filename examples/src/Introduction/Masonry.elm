module Introduction.Masonry exposing (Model, Msg, commands, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import DnDList.Single
import Html
import Html.Attributes
import Random



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


type alias Color =
    String


colors : List Color
colors =
    [ "#acfe2f"
    , "#cefe2f"
    , "#f0fe2f"
    , "#feea2f"
    , "#fec72f"
    , "#fea52f"
    , "#fe832f"
    , "#fe612f"
    , "#fe3f2f"
    ]



-- DND


system : DnDList.Single.System Item Msg
system =
    DnDList.Single.config
        |> DnDList.Single.operation DnDList.Swap
        |> DnDList.Single.create DnDMsg



-- MODEL


type alias Width =
    Int


type Item
    = Item Color Width


type alias Model =
    { items : List Item
    , dnd : DnDList.Single.Model
    }


initialModel : Model
initialModel =
    { items = []
    , dnd = system.model
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, commands )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.dnd



-- COMMANDS


commands : Cmd Msg
commands =
    Random.generate NewMasonry (Random.list (List.length colors) (Random.int 50 200))



-- UPDATE


type Msg
    = NewMasonry (List Int)
    | DnDMsg DnDList.Single.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewMasonry widths ->
            ( { model
                | items =
                    List.map2 (\color width -> Item color width) colors widths
              }
            , Cmd.none
            )

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
        [ model.items
            |> List.indexedMap (itemView model.dnd)
            |> Html.div containerStyles
        , ghostView model.dnd model.items
        ]


itemView : DnDList.Single.Model -> Int -> Item -> Html.Html Msg
itemView dnd index (Item color width) =
    let
        itemId : String
        itemId =
            "id-" ++ color
    in
    case system.info dnd of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles color width
                        ++ system.dropEvents index itemId
                    )
                    []

            else
                Html.div
                    (Html.Attributes.id itemId
                        :: itemStyles "dimgray" width
                    )
                    []

        Nothing ->
            Html.div
                (Html.Attributes.id itemId
                    :: itemStyles color width
                    ++ system.dragEvents index itemId
                )
                []


ghostView : DnDList.Single.Model -> List Item -> Html.Html Msg
ghostView dnd items =
    let
        maybeDragItem : Maybe Item
        maybeDragItem =
            system.info dnd
                |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)
    in
    case maybeDragItem of
        Just (Item color width) ->
            Html.div
                (itemStyles color width
                    ++ system.ghostStyles dnd
                )
                []

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "margin" "0 auto"
    , Html.Attributes.style "max-width" "40em"
    , Html.Attributes.style "padding-top" "2em"
    ]


itemStyles : Color -> Width -> List (Html.Attribute msg)
itemStyles color width =
    [ Html.Attributes.style "background-color" color
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "flex" "1 0 auto"
    , Html.Attributes.style "height" "4.5rem"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" (String.fromInt width ++ "px")
    ]
