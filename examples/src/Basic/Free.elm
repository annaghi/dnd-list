module Basic.Free exposing (Model, Msg, commands, initialModel, main, source, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes
import Html.Keyed
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
    [ "#39a5dc", "#3997dc", "#398adc", "#397cdc", "#396edc", "#3961dc", "#3953dc" ]



-- SYSTEM


config : DnDList.Config Msg
config =
    { message = MyMsg
    , movement = DnDList.Free DnDList.Swap DnDList.OnDrop
    }


system : DnDList.System Msg Item
system =
    DnDList.create config



-- MODEL


type Item
    = Item Color Width


type alias Width =
    Int


type alias Model =
    { draggable : DnDList.Draggable
    , items : List Item
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = []
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, commands )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.draggable



-- COMMANDS


commands : Cmd Msg
commands =
    Random.generate NewMasonry (Random.list (List.length colors) (Random.int 50 200))



-- UPDATE


type Msg
    = NewMasonry (List Int)
    | MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewMasonry widths ->
            ( { model
                | items =
                    List.map2
                        (\color width -> Item color width)
                        colors
                        widths
              }
            , Cmd.none
            )

        MyMsg message ->
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
        maybeDragIndex : Maybe Int
        maybeDragIndex =
            system.dragIndex model.draggable

        maybeDropIndex : Maybe Int
        maybeDropIndex =
            system.dropIndex model.draggable
    in
    Html.section
        [ Html.Attributes.style "margin" "6em 0" ]
        [ model.items
            |> List.indexedMap (itemView maybeDragIndex maybeDropIndex)
            |> Html.div containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : Maybe Int -> Maybe Int -> Int -> Item -> Html.Html Msg
itemView maybeDragIndex maybeDropIndex index (Item color width) =
    case ( maybeDragIndex, maybeDropIndex ) of
        ( Just dragIndex, Just dropIndex ) ->
            if dragIndex /= index && dropIndex /= index then
                Html.div
                    (itemStyles color width ++ system.dropEvents index)
                    []

            else if dragIndex /= index && dropIndex == index then
                Html.div
                    (itemStyles color width ++ overedItemStyles ++ system.dropEvents index)
                    []

            else
                Html.div
                    (itemStyles color width ++ placeholderItemStyles)
                    []

        _ ->
            let
                itemId : String
                itemId =
                    "id-" ++ String.fromInt index
            in
            Html.div
                (Html.Attributes.id itemId :: itemStyles color width ++ system.dragEvents index itemId)
                []


draggedItemView : DnDList.Draggable -> List Item -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Item
        maybeDraggedItem =
            system.dragIndex draggable
                |> Maybe.andThen (\index -> items |> List.drop index |> List.head)
    in
    case maybeDraggedItem of
        Just (Item color width) ->
            Html.div
                (itemStyles color width ++ system.draggedStyles draggable)
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
    ]


itemStyles : Color -> Width -> List (Html.Attribute msg)
itemStyles color width =
    [ Html.Attributes.style "background" color
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "flex" "1 0 auto"
    , Html.Attributes.style "height" "5em"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" (String.fromInt width ++ "px")
    ]


placeholderItemStyles : List (Html.Attribute msg)
placeholderItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]


overedItemStyles : List (Html.Attribute msg)
overedItemStyles =
    [ Html.Attributes.style "opacity" "0.7" ]



-- SOURCE


source : String
source =
    """
module Free exposing (main)

import Browser
import DnDList
import Html
import Html.Attributes
import Html.Keyed
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
    [ "#39a5dc", "#3997dc", "#398adc", "#397cdc", "#396edc", "#3961dc", "#3953dc" ]



-- SYSTEM


config : DnDList.Config Msg
config =
    { message = MyMsg
    , movement = DnDList.Free DnDList.Swap DnDList.OnDrop
    }


system : DnDList.System Msg Item
system =
    DnDList.create config



-- MODEL


type Item
    = Item Color Width


type alias Width =
    Int


type alias Model =
    { draggable : DnDList.Draggable
    , items : List Item
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = []
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, commands )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    system.subscriptions model.draggable



-- COMMANDS


commands : Cmd Msg
commands =
    Random.generate NewMasonry (Random.list (List.length colors) (Random.int 50 200))



-- UPDATE


type Msg
    = NewMasonry (List Int)
    | MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewMasonry widths ->
            ( { model
                | items =
                    List.map2
                        (\\color width -> Item color width)
                        colors
                        widths
              }
            , Cmd.none
            )

        MyMsg message ->
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
        maybeDragIndex : Maybe Int
        maybeDragIndex =
            system.dragIndex model.draggable

        maybeDropIndex : Maybe Int
        maybeDropIndex =
            system.dropIndex model.draggable
    in
    Html.section
        [ Html.Attributes.style "margin" "6em 0" ]
        [ model.items
            |> List.indexedMap (itemView maybeDragIndex maybeDropIndex)
            |> Html.div containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : Maybe Int -> Maybe Int -> Int -> Item -> Html.Html Msg
itemView maybeDragIndex maybeDropIndex index (Item color width) =
    case ( maybeDragIndex, maybeDropIndex ) of
        ( Just dragIndex, Just dropIndex ) ->
            if dragIndex /= index && dropIndex /= index then
                Html.div
                    (itemStyles color width ++ system.dropEvents index)
                    []

            else if dragIndex /= index && dropIndex == index then
                Html.div
                    (itemStyles color width ++ overedItemStyles ++ system.dropEvents index)
                    []

            else
                Html.div
                    (itemStyles color width ++ placeholderItemStyles)
                    []

        _ ->
            let
                itemId : String
                itemId =
                    "id-" ++ String.fromInt index
            in
            Html.div
                (Html.Attributes.id itemId :: itemStyles color width ++ system.dragEvents index itemId)
                []


draggedItemView : DnDList.Draggable -> List Item -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Item
        maybeDraggedItem =
            system.dragIndex draggable
                |> Maybe.andThen (\\index -> items |> List.drop index |> List.head)
    in
    case maybeDraggedItem of
        Just (Item color width) ->
            Html.div
                (itemStyles color width ++ system.draggedStyles draggable)
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
    ]


itemStyles : Color -> Width -> List (Html.Attribute msg)
itemStyles color width =
    [ Html.Attributes.style "background" color
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "flex" "1 0 auto"
    , Html.Attributes.style "height" "5em"
    , Html.Attributes.style "margin" "0 1.5em 1.5em 0"
    , Html.Attributes.style "width" (String.fromInt width ++ "px")
    ]


placeholderItemStyles : List (Html.Attribute msg)
placeholderItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]


overedItemStyles : List (Html.Attribute msg)
overedItemStyles =
    [ Html.Attributes.style "opacity" "0.7" ]
    """
