module Example.BasicElmUI exposing (Model, Msg, initialModel, source, subscriptions, update, view)

import DnDList
import Element
import Html
import Html.Attributes



-- DATA


type alias Fruit =
    String


data : List Fruit
data =
    [ "Apples", "Bananas", "Cherries", "Dates" ]



-- SYSTEM


config : DnDList.Config Msg
config =
    { message = MyMsg
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
    = MyMsg DnDList.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
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
        maybeDraggedIndex : Maybe Int
        maybeDraggedIndex =
            system.draggedIndex model.draggable
    in
    Element.layout
        [ Element.width Element.fill
        , Element.height Element.fill
        , Element.inFront (draggedItemView model.draggable model.items)
        ]
        (Element.column
            [ Element.centerX, Element.centerY, Element.padding 10, Element.spacing 10 ]
            (model.items |> List.indexedMap (itemView maybeDraggedIndex))
        )


itemView : Maybe Int -> Int -> Fruit -> Element.Element Msg
itemView maybeDraggedIndex index item =
    case maybeDraggedIndex of
        Nothing ->
            let
                itemId : String
                itemId =
                    "id-" ++ item
            in
            Element.el
                (Element.htmlAttribute (Html.Attributes.id itemId)
                    :: List.map Element.htmlAttribute (system.dragEvents index itemId)
                )
                (Element.text item)

        Just draggedIndex ->
            if draggedIndex /= index then
                Element.el
                    (List.map Element.htmlAttribute (system.dropEvents index))
                    (Element.text item)

            else
                Element.el [] (Element.text "[---------]")


draggedItemView : DnDList.Draggable -> List Fruit -> Element.Element Msg
draggedItemView draggable items =
    let
        maybeDraggedItem : Maybe Fruit
        maybeDraggedItem =
            system.draggedIndex draggable
                |> Maybe.andThen (\index -> items |> List.drop index |> List.head)
    in
    case maybeDraggedItem of
        Just item ->
            Element.el
                (List.map Element.htmlAttribute (system.draggedStyles draggable))
                (Element.text item)

        Nothing ->
            Element.none



-- SOURCE


source : String
source =
    """
    module BasicElmUI exposing (main)

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


    config : DnDList.Config Msg
    config =
        { message = MyMsg
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
        = MyMsg DnDList.Msg


    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
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
            maybeDraggedIndex : Maybe Int
            maybeDraggedIndex =
                system.draggedIndex model.draggable
        in
        Element.layout
            [ Element.width Element.fill
            , Element.height Element.fill
            , Element.inFront (draggedItemView model.draggable model.items)
            ]
            (Element.column
                [ Element.centerX, Element.centerY, Element.padding 10, Element.spacing 10 ]
                (model.items |> List.indexedMap (itemView maybeDraggedIndex))
            )


    itemView : Maybe Int -> Int -> Fruit -> Element.Element Msg
    itemView maybeDraggedIndex index item =
        case maybeDraggedIndex of
            Nothing ->
                let
                    itemId : String
                    itemId =
                        "id-" ++ item
                in
                Element.el
                    (Element.htmlAttribute (Html.Attributes.id itemId)
                        :: List.map Element.htmlAttribute (system.dragEvents index itemId)
                    )
                    (Element.text item)

            Just draggedIndex ->
                if draggedIndex /= index then
                    Element.el
                        (List.map Element.htmlAttribute (system.dropEvents index))
                        (Element.text item)

                else
                    Element.el [] (Element.text "[---------]")


    draggedItemView : DnDList.Draggable -> List Fruit -> Element.Element Msg
    draggedItemView draggable items =
        let
            maybeDraggedItem : Maybe Fruit
            maybeDraggedItem =
                system.draggedIndex draggable
                    |> Maybe.andThen (\\index -> items |> List.drop index |> List.head)
        in
        case maybeDraggedItem of
            Just item ->
                Element.el
                    (List.map Element.htmlAttribute (system.draggedStyles draggable))
                    (Element.text item)

            Nothing ->
                Element.none
    """
