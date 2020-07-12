module Main exposing (main)

import Browser
import Glue
import Groups
import Html
import Html.Attributes
import Single


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


single : Glue.Glue Model Single.Model Msg Single.Msg
single =
    Glue.glue
        { msg = SingleMsg
        , get = .single
        , set = \subModel model -> { model | single = subModel }
        }


groups : Glue.Glue Model Groups.Model Msg Groups.Msg
groups =
    Glue.glue
        { msg = GroupsMsg
        , get = .groups
        , set = \subModel model -> { model | groups = subModel }
        }


type alias Model =
    { single : Single.Model
    , groups : Groups.Model
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( Model, Cmd.none )
        |> Glue.init single Single.init
        |> Glue.init groups Groups.init


type Msg
    = SingleMsg Single.Msg
    | GroupsMsg Groups.Msg


subscriptions : Model -> Sub Msg
subscriptions =
    (\_ -> Sub.none)
        |> Glue.subscriptions single Single.subscriptions
        |> Glue.subscriptions groups Groups.subscriptions


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SingleMsg singleMsg ->
            ( model, Cmd.none )
                |> Glue.update single Single.update singleMsg

        GroupsMsg groupsMsg ->
            ( model, Cmd.none )
                |> Glue.update groups Groups.update groupsMsg


view : Model -> Html.Html Msg
view model =
    Html.div
        [ Html.Attributes.style "display" "flex"
        , Html.Attributes.style "justify-content" "space-evenly"
        ]
        [ Glue.view single Single.view model
        , Glue.view groups Groups.view model
        ]
