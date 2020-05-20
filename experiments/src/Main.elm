module Main exposing (main)

import Browser
import Flat
import Glue
import Groups
import Html
import Html.Attributes


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


flat : Glue.Glue Model Flat.Model Msg Flat.Msg
flat =
    Glue.glue
        { msg = FlatMsg
        , get = .flat
        , set = \subModel model -> { model | flat = subModel }
        }


groups : Glue.Glue Model Groups.Model Msg Groups.Msg
groups =
    Glue.glue
        { msg = GroupsMsg
        , get = .groups
        , set = \subModel model -> { model | groups = subModel }
        }


type alias Model =
    { flat : Flat.Model
    , groups : Groups.Model
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( Model, Cmd.none )
        |> Glue.init flat Flat.init
        |> Glue.init groups Groups.init


type Msg
    = FlatMsg Flat.Msg
    | GroupsMsg Groups.Msg


subscriptions : Model -> Sub Msg
subscriptions =
    always Sub.none
        |> Glue.subscriptions flat Flat.subscriptions
        |> Glue.subscriptions groups Groups.subscriptions


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        FlatMsg flatMsg ->
            ( model, Cmd.none )
                |> Glue.update flat Flat.update flatMsg

        GroupsMsg groupsMsg ->
            ( model, Cmd.none )
                |> Glue.update groups Groups.update groupsMsg


view : Model -> Html.Html Msg
view model =
    Html.div
        [ Html.Attributes.style "display" "flex"
        , Html.Attributes.style "justify-content" "space-evenly"
        ]
        [ Glue.view flat Flat.view model
        , Glue.view groups Groups.view model
        ]
