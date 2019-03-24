module Advanced.FreeRotateOnDrop exposing (Model, Msg, initialModel, main, source, subscriptions, update, view)

import Browser
import Browser.Events
import DnDList
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Json.Decode



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


type alias KeyedItem =
    ( String, String )


data : List KeyedItem
data =
    List.range 1 9
        |> List.map (\i -> ( "key-" ++ String.fromInt i, String.fromInt i ))



-- SYSTEM


config : DnDList.Config Msg
config =
    { message = MyMsg
    , movement = DnDList.Free DnDList.Rotate DnDList.OnDrop
    }


system : DnDList.System Msg KeyedItem
system =
    DnDList.create config



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , items : List KeyedItem
    , affected : List Int
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = data
    , affected = []
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ system.subscriptions model.draggable
        , if model.affected == [] then
            Sub.none

          else
            Browser.Events.onMouseDown
                (Json.Decode.succeed ClearAffected)
        ]



-- UPDATE


type Msg
    = MyMsg DnDList.Msg
    | ClearAffected


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        MyMsg message ->
            let
                ( draggable, items ) =
                    system.update message model.draggable model.items

                ( maybeDragIndex, maybeDropIndex ) =
                    ( system.dragIndex draggable, system.dropIndex draggable )

                affected : List Int
                affected =
                    case ( maybeDragIndex, maybeDropIndex ) of
                        ( Just dragIndex, Just dropIndex ) ->
                            if dragIndex < dropIndex then
                                List.range dragIndex dropIndex

                            else if dragIndex > dropIndex then
                                List.range dropIndex dragIndex

                            else
                                []

                        _ ->
                            model.affected
            in
            ( { model | draggable = draggable, items = items, affected = affected }
            , system.commands model.draggable
            )

        ClearAffected ->
            ( { model | affected = [] }, Cmd.none )



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
            |> List.indexedMap (itemView model.affected maybeDragIndex maybeDropIndex)
            |> Html.Keyed.node "div" containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : List Int -> Maybe Int -> Maybe Int -> Int -> KeyedItem -> ( String, Html.Html Msg )
itemView affected maybeDragIndex maybeDropIndex index ( key, item ) =
    case ( maybeDragIndex, maybeDropIndex ) of
        ( Nothing, Nothing ) ->
            let
                itemId : String
                itemId =
                    "id-" ++ item

                styles : List (Html.Attribute Msg)
                styles =
                    itemStyles
                        ++ (if List.member index affected then
                                affectedItemStyles

                            else
                                []
                           )
            in
            ( key
            , Html.div
                (Html.Attributes.id itemId :: styles ++ system.dragEvents index itemId)
                [ Html.text item ]
            )

        ( Just dragIndex, Just dropIndex ) ->
            if dragIndex /= index && dropIndex /= index then
                ( key
                , Html.div
                    (itemStyles ++ system.dropEvents index)
                    [ Html.text item ]
                )

            else if dragIndex /= index && dropIndex == index then
                ( key
                , Html.div
                    (itemStyles ++ overedItemStyles ++ system.dropEvents index)
                    [ Html.text item ]
                )

            else
                ( key
                , Html.div (itemStyles ++ placeholderItemStyles) []
                )

        _ ->
            ( "", Html.text "" )


draggedItemView : DnDList.Draggable -> List KeyedItem -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe KeyedItem
        maybeDraggedItem =
            system.dragIndex draggable
                |> Maybe.andThen (\index -> items |> List.drop index |> List.head)
    in
    case maybeDraggedItem of
        Just ( _, item ) ->
            Html.div
                (itemStyles ++ draggedItemStyles ++ system.draggedStyles draggable)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-template-columns" "7em 7em 7em"
    , Html.Attributes.style "grid-template-rows" "7em 7em 7em"
    , Html.Attributes.style "grid-gap" "2em"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "background" "#1e9daa"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "1.2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


draggedItemStyles : List (Html.Attribute msg)
draggedItemStyles =
    [ Html.Attributes.style "background" "#aa1e9d" ]


placeholderItemStyles : List (Html.Attribute msg)
placeholderItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]


overedItemStyles : List (Html.Attribute msg)
overedItemStyles =
    [ Html.Attributes.style "background" "#63bdc7" ]


affectedItemStyles : List (Html.Attribute msg)
affectedItemStyles =
    [ Html.Attributes.style "background" "#136169" ]



-- SOURCE


source : String
source =
    """
module FreeRotateOnDrop exposing (main)

import Browser
import Browser.Events
import DnDList
import Html
import Html.Attributes
import Html.Events
import Html.Keyed
import Json.Decode



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


type alias KeyedItem =
    ( String, String )


data : List KeyedItem
data =
    List.range 1 9
        |> List.map (\\i -> ( "key-" ++ String.fromInt i, String.fromInt i ))



-- SYSTEM


config : DnDList.Config Msg
config =
    { message = MyMsg
    , movement = DnDList.Free DnDList.Rotate DnDList.OnDrop
    }


system : DnDList.System Msg KeyedItem
system =
    DnDList.create config



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , items : List KeyedItem
    , affected : List Int
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , items = data
    , affected = []
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ system.subscriptions model.draggable
        , if model.affected == [] then
            Sub.none

          else
            Browser.Events.onMouseDown
                (Json.Decode.succeed ClearAffected)
        ]



-- UPDATE


type Msg
    = MyMsg DnDList.Msg
    | ClearAffected


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        MyMsg message ->
            let
                ( draggable, items ) =
                    system.update message model.draggable model.items

                ( maybeDragIndex, maybeDropIndex ) =
                    ( system.dragIndex draggable, system.dropIndex draggable )

                affected : List Int
                affected =
                    case ( maybeDragIndex, maybeDropIndex ) of
                        ( Just dragIndex, Just dropIndex ) ->
                            if dragIndex < dropIndex then
                                List.range dragIndex dropIndex

                            else if dragIndex > dropIndex then
                                List.range dropIndex dragIndex

                            else
                                []

                        _ ->
                            model.affected
            in
            ( { model | draggable = draggable, items = items, affected = affected }
            , system.commands model.draggable
            )

        ClearAffected ->
            ( { model | affected = [] }, Cmd.none )



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
            |> List.indexedMap (itemView model.affected maybeDragIndex maybeDropIndex)
            |> Html.Keyed.node "div" containerStyles
        , draggedItemView model.draggable model.items
        ]


itemView : List Int -> Maybe Int -> Maybe Int -> Int -> KeyedItem -> ( String, Html.Html Msg )
itemView affected maybeDragIndex maybeDropIndex index ( key, item ) =
    case ( maybeDragIndex, maybeDropIndex ) of
        ( Nothing, Nothing ) ->
            let
                itemId : String
                itemId =
                    "id-" ++ item

                styles : List (Html.Attribute Msg)
                styles =
                    itemStyles
                        ++ (if List.member index affected then
                                affectedItemStyles

                            else
                                []
                           )
            in
            ( key
            , Html.div
                (Html.Attributes.id itemId :: styles ++ system.dragEvents index itemId)
                [ Html.text item ]
            )

        ( Just dragIndex, Just dropIndex ) ->
            if dragIndex /= index && dropIndex /= index then
                ( key
                , Html.div
                    (itemStyles ++ system.dropEvents index)
                    [ Html.text item ]
                )

            else if dragIndex /= index && dropIndex == index then
                ( key
                , Html.div
                    (itemStyles ++ overedItemStyles ++ system.dropEvents index)
                    [ Html.text item ]
                )

            else
                ( key
                , Html.div (itemStyles ++ placeholderItemStyles) []
                )

        _ ->
            ( "", Html.text "" )


draggedItemView : DnDList.Draggable -> List KeyedItem -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe KeyedItem
        maybeDraggedItem =
            system.dragIndex draggable
                |> Maybe.andThen (\\index -> items |> List.drop index |> List.head)
    in
    case maybeDraggedItem of
        Just ( _, item ) ->
            Html.div
                (itemStyles ++ draggedItemStyles ++ system.draggedStyles draggable)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- STYLES


containerStyles : List (Html.Attribute msg)
containerStyles =
    [ Html.Attributes.style "display" "grid"
    , Html.Attributes.style "grid-template-columns" "7em 7em 7em"
    , Html.Attributes.style "grid-template-rows" "7em 7em 7em"
    , Html.Attributes.style "grid-gap" "2em"
    , Html.Attributes.style "justify-content" "center"
    ]


itemStyles : List (Html.Attribute msg)
itemStyles =
    [ Html.Attributes.style "background" "#1e9daa"
    , Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "color" "white"
    , Html.Attributes.style "cursor" "pointer"
    , Html.Attributes.style "font-size" "1.2em"
    , Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    ]


draggedItemStyles : List (Html.Attribute msg)
draggedItemStyles =
    [ Html.Attributes.style "background" "#aa1e9d" ]


placeholderItemStyles : List (Html.Attribute msg)
placeholderItemStyles =
    [ Html.Attributes.style "background" "dimgray" ]


overedItemStyles : List (Html.Attribute msg)
overedItemStyles =
    [ Html.Attributes.style "background" "#63bdc7" ]


affectedItemStyles : List (Html.Attribute msg)
affectedItemStyles =
    [ Html.Attributes.style "background" "#136169" ]
    """
