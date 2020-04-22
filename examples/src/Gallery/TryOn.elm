module Gallery.TryOn exposing (Model, Msg, initialModel, main, subscriptions, update, view)

import Browser
import DnDList
import Html
import Html.Attributes
import Svg
import Svg.Attributes



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


type Property
    = Color
    | Size


type alias Item =
    { id : String
    , property : Property
    , size : Int
    , color : String
    }


data : List Item
data =
    [ Item "id-1" Color 1 "#2ba218"
    , Item "id-2" Color 1 "#70a218"
    , Item "id-3" Color 1 "#a28f18"
    , Item "id-4" Color 1 "#a24b18"
    , Item "id-5" Size 1 "dimgray"
    , Item "id-6" Size 2 "dimgray"
    , Item "id-7" Size 3 "dimgray"
    , Item "id-8" Size 4 "dimgray"
    , Item "id-9" Size 5 "dimgray"
    ]



-- SYSTEM


config : DnDList.Config Item
config =
    { beforeUpdate = updateColor
    , movement = DnDList.Free
    , listen = DnDList.OnDrop
    , operation = DnDList.Unaltered
    }


system : DnDList.System Item Msg
system =
    DnDList.create config MyMsg


updateColor : Int -> Int -> List Item -> List Item
updateColor dragIndex dropIndex list =
    let
        drags : List Item
        drags =
            list |> List.drop dragIndex |> List.take 1
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == dropIndex then
                    List.map2
                        (\dragItem dropItem -> { dropItem | color = dragItem.color })
                        drags
                        [ item ]

                else if index == dragIndex then
                    case item.property of
                        Size ->
                            [ { item | color = "dimgray" } ]

                        _ ->
                            [ item ]

                else
                    [ item ]
            )
        |> List.concat



-- MODEL


type alias Model =
    { dnd : DnDList.Model
    , items : List Item
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
    Html.section sectionStyles
        [ model.items
            |> List.filter (\item -> item.property == Color)
            |> List.indexedMap (colorView model)
            |> Html.div colorGroupStyles
        , model.items
            |> List.filter (\item -> item.property == Size)
            |> List.indexedMap
                (sizeView model (model.items |> List.filter (\item -> item.property == Color) |> List.length))
            |> Html.div sizeGroupStyles
        , ghostView model
        ]


colorView : Model -> Int -> Item -> Html.Html Msg
colorView model index item =
    let
        id : String
        id =
            "color-" ++ String.fromInt index

        width : Int
        width =
            item.size * 4

        height : Int
        height =
            item.size * 4
    in
    case system.info model.dnd of
        Just _ ->
            Html.div
                (Html.Attributes.id id
                    :: colorStyles width height item.color
                    ++ [ Html.Attributes.style "cursor" "pointer" ]
                )
                []

        _ ->
            Html.div
                (Html.Attributes.id id
                    :: colorStyles width height item.color
                    ++ Html.Attributes.style "cursor" "pointer"
                    :: system.dragEvents index id
                )
                []


sizeView : Model -> Int -> Int -> Item -> Html.Html Msg
sizeView model offset localIndex item =
    let
        globalIndex : Int
        globalIndex =
            offset + localIndex

        id : String
        id =
            "size-" ++ String.fromInt localIndex

        width : Int
        width =
            item.size * 50

        height : Int
        height =
            item.size * 50
    in
    case system.info model.dnd of
        Just { dragIndex } ->
            if dragIndex /= globalIndex then
                Html.div wrapperStyles
                    [ svgView width height item.color (Html.Attributes.id id :: system.dropEvents globalIndex id) ]

            else
                Html.div wrapperStyles
                    [ svgView width height "dimgray" (Html.Attributes.id id :: system.dropEvents globalIndex id) ]

        _ ->
            if item.color /= "dimgray" then
                Html.div wrapperStyles
                    [ svgView width height item.color (Html.Attributes.id id :: Html.Attributes.style "cursor" "pointer" :: system.dragEvents globalIndex id) ]

            else
                Html.div wrapperStyles
                    [ svgView width height item.color [ Html.Attributes.id id ] ]


ghostView : Model -> Html.Html Msg
ghostView model =
    case ( system.info model.dnd, maybeDragItem model ) of
        ( Just { dropElement }, Just { color } ) ->
            let
                baseFontSize : Float
                baseFontSize =
                    14

                width : Int
                width =
                    round (dropElement.element.width / baseFontSize)

                height : Int
                height =
                    round (dropElement.element.height / baseFontSize)
            in
            svgView width
                height
                color
                (system.ghostStyles model.dnd
                    ++ [ Html.Attributes.style "width" (String.fromInt width ++ "rem")
                       , Html.Attributes.style "height" (String.fromInt height ++ "rem")
                       , Html.Attributes.style "transition" "width 0.5s, height 0.5s"
                       ]
                )

        _ ->
            Html.text ""


svgView : Int -> Int -> String -> List (Html.Attribute Msg) -> Html.Html Msg
svgView width height color dnd =
    Svg.svg
        ([ Svg.Attributes.width (String.fromInt width)
         , Svg.Attributes.height (String.fromInt height)
         , Svg.Attributes.viewBox "0 0 295.526 295.526"
         ]
            ++ dnd
        )
        [ Svg.g
            [ Svg.Attributes.fill color ]
            [ Svg.path [ Svg.Attributes.d "M147.763,44.074c12.801,0,23.858-8.162,27.83-20.169c-7.578,2.086-17.237,3.345-27.83,3.345c-10.592,0-20.251-1.259-27.828-3.345C123.905,35.911,134.961,44.074,147.763,44.074z" ] []
            , Svg.path [ Svg.Attributes.d "M295.158,58.839c-0.608-1.706-1.873-3.109-3.521-3.873l-56.343-26.01c-11.985-4.06-24.195-7.267-36.524-9.611c-0.434-0.085-0.866-0.126-1.292-0.126c-3.052,0-5.785,2.107-6.465,5.197c-4.502,19.82-22.047,34.659-43.251,34.659c-21.203,0-38.749-14.838-43.25-34.659c-0.688-3.09-3.416-5.197-6.466-5.197c-0.426,0-0.858,0.041-1.292,0.126c-12.328,2.344-24.538,5.551-36.542,9.611L3.889,54.965c-1.658,0.764-2.932,2.167-3.511,3.873c-0.599,1.726-0.491,3.589,0.353,5.217l24.46,48.272c1.145,2.291,3.474,3.666,5.938,3.666c0.636,0,1.281-0.092,1.917-0.283l27.167-8.052v161.97c0,3.678,3.001,6.678,6.689,6.678h161.723c3.678,0,6.67-3.001,6.67-6.678V107.66l27.186,8.052c0.636,0.191,1.28,0.283,1.915,0.283c2.459,0,4.779-1.375,5.94-3.666l24.469-48.272C295.629,62.428,295.747,60.565,295.158,58.839z" ] []
            ]
        ]



-- HELPERS


maybeDragItem : Model -> Maybe Item
maybeDragItem { dnd, items } =
    system.info dnd
        |> Maybe.andThen (\{ dragIndex } -> items |> List.drop dragIndex |> List.head)



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-top" "2rem"
    ]


colorGroupStyles : List (Html.Attribute msg)
colorGroupStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-right" "3rem"
    ]


sizeGroupStyles : List (Html.Attribute msg)
sizeGroupStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "align-items" "baseline"
    , Html.Attributes.style "justify-content" "center"
    ]


colorStyles : Int -> Int -> String -> List (Html.Attribute msg)
colorStyles width height color =
    [ Html.Attributes.style "border-radius" "8px"
    , Html.Attributes.style "margin" "0 3rem 3rem 0"
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "width" (String.fromInt width ++ "rem")
    , Html.Attributes.style "height" (String.fromInt height ++ "rem")
    ]


wrapperStyles : List (Html.Attribute msg)
wrapperStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "margin-right" "2rem"
    ]
