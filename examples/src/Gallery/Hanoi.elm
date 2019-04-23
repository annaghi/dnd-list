module Gallery.Hanoi exposing (Model, Msg, init, initialModel, main, subscriptions, update, view)

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


type alias Disk =
    { tower : Int
    , width : Int
    , startColor : String
    , solvedColor : String
    }


data : List Disk
data =
    [ Disk 0 300 "transparent" "transparent"
    , Disk 0 60 "#aa7d1e" "#fbe300"
    , Disk 0 120 "#aa711e" "#fbce00"
    , Disk 0 180 "#aa651e" "#fbb900"
    , Disk 0 240 "#aa5a1e" "#fba400"
    , Disk 1 300 "transparent" "transparent"
    , Disk 2 300 "transparent" "transparent"
    ]



-- SYSTEM


config : DnDList.Config Disk
config =
    { movement = DnDList.Free
    , trigger = DnDList.OnDrop
    , operation = DnDList.InsertAfter
    , beforeUpdate = updateTower
    }


system : DnDList.System Disk Msg
system =
    DnDList.create config MyMsg


updateTower : Int -> Int -> List Disk -> List Disk
updateTower dragIndex dropIndex list =
    let
        drop : List Disk
        drop =
            list |> List.drop dropIndex |> List.take 1
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == dragIndex then
                    List.map2
                        (\dragDisk dropDisk -> { dragDisk | tower = dropDisk.tower })
                        [ item ]
                        drop

                else
                    [ item ]
            )
        |> List.concat



-- MODEL


type alias Model =
    { draggable : DnDList.Draggable
    , disks : List Disk
    , solved : Bool
    }


initialModel : Model
initialModel =
    { draggable = system.draggable
    , disks = data
    , solved = False
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
                ( draggable, disks ) =
                    system.update msg model.draggable model.disks

                solved : Bool
                solved =
                    disks |> List.take 3 |> List.all (\disk -> disk.startColor == "transparent")
            in
            ( { model | draggable = draggable, disks = disks, solved = solved }
            , system.commands model.draggable
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    let
        firstTower : List Disk
        firstTower =
            model.disks
                |> List.filter (\{ tower } -> tower == 0)

        secondTower : List Disk
        secondTower =
            model.disks
                |> List.filter (\{ tower } -> tower == 1)

        thirdTower : List Disk
        thirdTower =
            model.disks
                |> List.filter (\{ tower } -> tower == 2)
    in
    Html.section sectionStyles
        [ firstTower
            |> List.indexedMap (diskView model (topDisk firstTower) 0)
            |> Html.div towerStyles
        , secondTower
            |> List.indexedMap (diskView model (topDisk secondTower) (List.length firstTower))
            |> Html.div towerStyles
        , thirdTower
            |> List.indexedMap (diskView model (topDisk thirdTower) (List.length firstTower + List.length secondTower))
            |> Html.div towerStyles
        , draggedDiskView model
        ]


diskView : Model -> Maybe Disk -> Int -> Int -> Disk -> Html.Html Msg
diskView model maybeTopDisk offset localIndex { tower, width, startColor, solvedColor } =
    let
        globalIndex : Int
        globalIndex =
            localIndex + offset

        diskId : String
        diskId =
            "id-" ++ String.fromInt globalIndex

        color : String
        color =
            paint model.solved startColor solvedColor
    in
    case system.info model.draggable of
        Just { dragIndex } ->
            if localIndex == 0 then
                case ( maybeDraggedDisk model, maybeTopDisk ) of
                    ( Just draggedDisk, Just top ) ->
                        if draggedDisk.width < top.width then
                            Html.div
                                (Html.Attributes.id diskId
                                    :: diskStyles width color
                                    ++ droppableDiskStyles
                                    ++ system.dropEvents globalIndex diskId
                                )
                                []

                        else
                            Html.div
                                (Html.Attributes.id diskId
                                    :: diskStyles width color
                                    ++ droppableDiskStyles
                                )
                                []

                    _ ->
                        Html.div
                            (Html.Attributes.id diskId
                                :: diskStyles width color
                                ++ droppableDiskStyles
                                ++ system.dropEvents globalIndex diskId
                            )
                            []

            else if globalIndex == dragIndex then
                Html.div
                    (Html.Attributes.id diskId
                        :: diskStyles width color
                        ++ placeholderDiskStyles
                    )
                    []

            else
                Html.div
                    (Html.Attributes.id diskId
                        :: diskStyles width color
                    )
                    []

        _ ->
            if localIndex == 0 then
                Html.div
                    (Html.Attributes.id diskId
                        :: diskStyles width color
                        ++ droppableDiskStyles
                    )
                    []

            else if localIndex == 1 then
                Html.div
                    (Html.Attributes.id diskId
                        :: diskStyles width color
                        ++ draggableDiskStyles
                        ++ system.dragEvents globalIndex diskId
                    )
                    []

            else
                Html.div
                    (Html.Attributes.id diskId
                        :: diskStyles width color
                    )
                    []


draggedDiskView : Model -> Html.Html Msg
draggedDiskView model =
    case maybeDraggedDisk model of
        Just { width, startColor, solvedColor } ->
            Html.div
                (diskStyles width (paint model.solved startColor solvedColor)
                    ++ draggableDiskStyles
                    ++ system.draggedStyles model.draggable
                )
                []

        _ ->
            Html.text ""



-- HELPERS


maybeDraggedDisk : Model -> Maybe Disk
maybeDraggedDisk { draggable, disks } =
    system.info draggable
        |> Maybe.andThen (\{ dragIndex } -> disks |> List.drop dragIndex |> List.head)


topDisk : List Disk -> Maybe Disk
topDisk disks =
    disks |> List.drop 1 |> List.head


paint : Bool -> String -> String -> String
paint solved startColor solvedColor =
    if solved then
        solvedColor

    else
        startColor



-- STYLES


sectionStyles : List (Html.Attribute msg)
sectionStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-wrap" "wrap"
    , Html.Attributes.style "justify-content" "center"
    , Html.Attributes.style "padding-bottom" "2em"
    ]


towerStyles : List (Html.Attribute msg)
towerStyles =
    [ Html.Attributes.style "display" "flex"
    , Html.Attributes.style "flex-direction" "column"
    , Html.Attributes.style "align-items" "center"
    , Html.Attributes.style "justify-content" "flex-end"
    , Html.Attributes.style "box-shadow" "0 10px 0 0 dimgray"
    , Html.Attributes.style "margin-right" "5em"
    , Html.Attributes.style "width" "300px"
    , Html.Attributes.style "height" "320px"
    ]


diskStyles : Int -> String -> List (Html.Attribute msg)
diskStyles width color =
    [ Html.Attributes.style "width" (String.fromInt width ++ "px")
    , Html.Attributes.style "min-height" "50px"
    , Html.Attributes.style "background" color
    , Html.Attributes.style "margin-bottom" "10px"
    ]


draggableDiskStyles : List (Html.Attribute msg)
draggableDiskStyles =
    [ Html.Attributes.style "cursor" "pointer" ]


droppableDiskStyles : List (Html.Attribute msg)
droppableDiskStyles =
    [ Html.Attributes.style "flex-grow" "1"
    , Html.Attributes.style "margin-bottom" "0"
    , Html.Attributes.style "height" "auto"
    ]


placeholderDiskStyles : List (Html.Attribute msg)
placeholderDiskStyles =
    [ Html.Attributes.style "background" "transparent" ]
