module Home exposing (Model, Msg, init, initialModel, main, subscriptions, update, view, onPointerMove, onPointerUp, releasePointerCapture)

import Browser
import Html
import Json.Encode


-- pretend ports

onPointerMove : (Json.Encode.Value -> msg) -> Sub msg
onPointerMove _ = Sub.none

onPointerUp : (Json.Encode.Value -> msg) -> Sub msg
onPointerUp _ = Sub.none

releasePointerCapture : Json.Encode.Value -> Cmd msg
releasePointerCapture _ = Cmd.none

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
