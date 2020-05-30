module DnDList.Single.HookCommands.DetectReorder exposing (Model, Msg, initialModel, main, subscriptions, update, view)

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
    List.range 1 5
        |> List.map String.fromInt



-- DND


system : DnDList.Single.System Item Msg
system =
    DnDList.Single.config
        |> DnDList.Single.listen DnDList.OnDrag
        |> DnDList.Single.operation DnDList.Swap
        |> DnDList.Single.detectReorder DetectReorder
        |> DnDList.Single.create DnDMsg



-- MODEL


type alias Model =
    { items : List Item
    , history : List ( Int, Int )
    , dnd : DnDList.Single.Model
    }


initialModel : Model
initialModel =
    { items = data
    , history = []
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

        DetectReorder dragIndex dropIndex _ ->
            ( { model | history = ( dragIndex, dropIndex ) :: model.history }
            , Cmd.none
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section
        [ Html.Attributes.style "display" "flex" ]
        [ historyView model.history
        , model.items
            |> List.indexedMap (itemView model.dnd)
            |> Html.div containerStyles
        , ghostView model.dnd model.items
        ]


historyView : List ( Int, Int ) -> Html.Html Msg
historyView history =
    let
        eventView ( i, j ) =
            Html.li [] [ Html.text (String.fromInt i ++ " ⟷ " ++ String.fromInt j) ]
    in
    history
        |> List.map eventView
        |> (::) (Html.li [] [ Html.text "i ⟷ j" ])
        |> Html.ul historyStyles


itemView : DnDList.Single.Model -> Int -> Item -> Html.Html Msg
itemView dnd index item =
    let
        itemId : String
        itemId =
            "detectreorder-" ++ item

        attrs : List (Html.Attribute msg)
        attrs =
            Html.Attributes.id itemId :: itemStyles
    in
    case system.info dnd of
        Just { dragIndex } ->
            if dragIndex /= index then
                Html.div
                    (attrs ++ system.dropEvents index itemId)
                    [ Html.text item ]

            else
                Html.div
                    (attrs ++ placeholderStyles)
                    []

        Nothing ->
            Html.div
                (attrs ++ system.dragEvents index itemId)
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
                (itemStyles ++ ghostStyles ++ system.ghostStyles dnd)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    ]


historyStyles : List (Html.Attribute msg)
historyStyles =
    [ Html.Attributes.style "list-style" "none"
    , Html.Attributes.style "width" "100px"
    , Html.Attributes.style "font-family" "monospace"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "background-color" "#fb5f51"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "black"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "1.2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" "50px"
    , Html.Attributes.style "height" "50px"
    ]


placeholderStyles : List (Html.Attribute msg)
placeholderStyles =
    [ Html.Attributes.style "background-color" "dimgray" ]


ghostStyles : List (Html.Attribute msg)
ghostStyles =
    [ Html.Attributes.style "background-color" "#fb5f51" ]
