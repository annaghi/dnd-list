port module Home exposing (Model, Msg, init, initialModel, main, onPointerMove, onPointerUp, releasePointerCapture, subscriptions, update, view)

import Browser
import Html
import Json.Encode



-- PORTS


port onPointerMove : (Json.Encode.Value -> msg) -> Sub msg


port onPointerUp : (Json.Encode.Value -> msg) -> Sub msg


port releasePointerCapture : Json.Encode.Value -> Cmd msg



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    Int


initialModel : Model
initialModel =
    4


init : () -> ( Model, Cmd Msg )
init _ =
    ( initialModel, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- UPDATE


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        NoOp ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Html.Html Msg
view model =
    Html.text ""
