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
    { dnd : DnDList.Model
    , disks : List Disk
    , solved : Bool
    }


initialModel : Model
initialModel =
    { dnd = system.model
    , disks = data
    , solved = False
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
                ( dnd, disks ) =
                    system.update msg model.dnd model.disks

                solved : Bool
                solved =
                    disks |> List.take 3 |> List.all (\disk -> disk.startColor == "transparent")
            in
            ( { model | dnd = dnd, disks = disks, solved = solved }
            , system.commands model.dnd
            )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.section sectionStyles
        [ towerView model 0
        , towerView model 1
        , towerView model 2
        , ghostDiskView model
        ]


towerView : Model -> Int -> Html.Html Msg
towerView model currentTower =
    let
        disks : List Disk
        disks =
            model.disks
                |> List.filter (\{ tower } -> tower == currentTower)
    in
    disks
        |> List.indexedMap (diskView model (maybeTopDisk disks) (calculateOffset 0 currentTower model.disks))
        |> Html.div towerStyles


diskView : Model -> Maybe Disk -> Int -> Int -> Disk -> Html.Html Msg
diskView model maybeTopDisk_ offset localIndex { tower, width, startColor, solvedColor } =
    let
        globalIndex : Int
        globalIndex =
            offset + localIndex

        diskId : String
        diskId =
            "id-" ++ String.fromInt globalIndex

        color : String
        color =
            paint model.solved startColor solvedColor
    in
    case system.info model.dnd of
        Just { dragIndex } ->
            if localIndex == 0 then
                case ( maybeDragDisk model.dnd model.disks, maybeTopDisk_ ) of
                    ( Just dragDisk, Just topDisk ) ->
                        if dragDisk.width < topDisk.width then
                            Html.div
                                (Html.Attributes.id diskId
                                    :: diskStyles width color
                                    ++ auxiliaryStyles
                                    ++ system.dropEvents globalIndex diskId
                                )
                                []

                        else
                            Html.div
                                (Html.Attributes.id diskId
                                    :: diskStyles width color
                                    ++ auxiliaryStyles
                                )
                                []

                    _ ->
                        Html.div
                            (Html.Attributes.id diskId
                                :: diskStyles width color
                                ++ auxiliaryStyles
                                ++ system.dropEvents globalIndex diskId
                            )
                            []

            else if globalIndex == dragIndex then
                Html.div
                    (Html.Attributes.id diskId
                        :: diskStyles width color
                        ++ placeholderStyles
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
                        ++ auxiliaryStyles
                    )
                    []

            else if localIndex == 1 then
                Html.div
                    (Html.Attributes.id diskId
                        :: diskStyles width color
                        ++ cursorStyles
                        ++ system.dragEvents globalIndex diskId
                    )
                    []

            else
                Html.div
                    (Html.Attributes.id diskId
                        :: diskStyles width color
                    )
                    []


ghostDiskView : Model -> Html.Html Msg
ghostDiskView model =
    case maybeDragDisk model.dnd model.disks of
        Just { width, startColor, solvedColor } ->
            Html.div
                (diskStyles width (paint model.solved startColor solvedColor)
                    ++ cursorStyles
                    ++ system.ghostStyles model.dnd
                )
                []

        _ ->
            Html.text ""



-- HELPERS


calculateOffset : Int -> Int -> List Disk -> Int
calculateOffset index tower list =
    case list of
        [] ->
            0

        x :: xs ->
            if x.tower == tower then
                index

            else
                calculateOffset (index + 1) tower xs


maybeDragDisk : DnDList.Model -> List Disk -> Maybe Disk
maybeDragDisk dnd disks =
    system.info dnd
        |> Maybe.andThen (\{ dragIndex } -> disks |> List.drop dragIndex |> List.head)


maybeTopDisk : List Disk -> Maybe Disk
maybeTopDisk disks =
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
    , Html.Attributes.style "background-color" color
    , Html.Attributes.style "margin-bottom" "10px"
    ]


auxiliaryStyles : List (Html.Attribute msg)
auxiliaryStyles =
    [ Html.Attributes.style "flex-grow" "1"
    , Html.Attributes.style "margin-bottom" "0"
    , Html.Attributes.style "height" "auto"
    ]


placeholderStyles : List (Html.Attribute msg)
placeholderStyles =
    [ Html.Attributes.style "background-color" "transparent" ]


cursorStyles : List (Html.Attribute msg)
cursorStyles =
    [ Html.Attributes.style "cursor" "pointer" ]
