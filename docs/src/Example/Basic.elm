module Example.Basic exposing (Model, Msg, initialModel, source, subscriptions, update, view)

import DnDList
import Html
import Html.Attributes



-- DATA


data : List String
data =
    [ "Apples", "Bananas", "Cherries", "Dates" ]



-- SYSTEM


config : DnDList.Config Msg
config =
    { events = DnDMsg
    , movement = DnDList.Free
    }


system : DnDList.System Msg
system =
    DnDList.create config



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , items : List String
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
    = NoOp
    | DnDMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        DnDMsg message ->
            let
                ( draggable, items ) =
                    DnDList.update message model.draggable model.items
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
            DnDList.getDragIndex model.draggable
    in
    Html.section
        [ Html.Attributes.style "margin" "6em 0"
        , Html.Attributes.style "text-align" "center"
        ]
        [ model.items
            |> List.indexedMap (itemView maybeDragIndex)
            |> Html.div []
        , draggedItemView model.draggable model.items
        ]


itemView : Maybe Int -> Int -> String -> Html.Html Msg
itemView maybeDragIndex index item =
    case maybeDragIndex of
        Nothing ->
            let
                itemId : String
                itemId =
                    "id-" ++ String.replace " " "-" item
            in
            Html.p
                (Html.Attributes.id itemId :: system.dragEvents index itemId)
                [ Html.text item ]

        Just dragIndex ->
            if dragIndex /= index then
                Html.p
                    (system.dropEvents index)
                    [ Html.text item ]

            else
                Html.p [] [ Html.text "[---------]" ]


draggedItemView : DnDList.Draggable -> List String -> Html.Html Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe String
        maybeDraggedItem =
            DnDList.getDragIndex draggable
                |> Maybe.andThen (\index -> items |> List.drop index |> List.head)
    in
    case maybeDraggedItem of
        Just item ->
            Html.div
                (system.draggedStyles draggable)
                [ Html.text item ]

        Nothing ->
            Html.text ""



-- SOURCE


source : String
source =
    """
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


    data : List String
    data =
        [ "Apples", "Bananas", "Cherries", "Dates" ]



    -- SYSTEM


    config : DnDList.Config Msg
    config =
        { events = DnDMsg
        , movement = DnDList.Free
        }


    system : DnDList.System Msg
    system =
        DnDList.create config



    -- MODEL


    type alias Model =
        { draggable : DnDList.Draggable
        , items : List String
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
        = NoOp
        | DnDMsg DnDList.Msg


    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            NoOp ->
                ( model, Cmd.none )

            DnDMsg message ->
                let
                    ( draggable, items ) =
                        DnDList.update message model.draggable model.items
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
                DnDList.getDragIndex model.draggable
        in
        Html.section
            [ Html.Attributes.style "margin" "6em 0"
            , Html.Attributes.style "text-align" "center"
            ]
            [ model.items
                |> List.indexedMap (itemView maybeDragIndex)
                |> Html.div []
            , draggedItemView model.draggable model.items
            ]


    itemView : Maybe Int -> Int -> String -> Html.Html Msg
    itemView maybeDragIndex index item =
        case maybeDragIndex of
            Nothing ->
                let
                    itemId : String
                    itemId =
                        "id-" ++ String.replace " " "-" item
                in
                Html.p
                    (Html.Attributes.id itemId :: system.dragEvents index itemId)
                    [ Html.text item ]

            Just dragIndex ->
                if dragIndex /= index then
                    Html.p
                        (system.dropEvents index)
                        [ Html.text item ]

                else
                    Html.p [] [ Html.text "[---------]" ]


    draggedItemView : DnDList.Draggable -> List String -> Html.Html Msg
    draggedItemView draggable items =
        let
            maybeDraggedItem : Maybe String
            maybeDraggedItem =
                DnDList.getDragIndex draggable
                    |> Maybe.andThen (\\index -> items |> List.drop index |> List.head)
        in
        case maybeDraggedItem of
            Just item ->
                Html.div
                    (system.draggedStyles draggable)
                    [ Html.text item ]

            Nothing ->
                Html.text ""
    """
