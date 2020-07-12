module Global exposing (Model, Msg(..), initialModel, update)


type alias Model =
    { showMenu : Bool }


initialModel : Model
initialModel =
    { showMenu = True }


type Msg
    = ShowMenu


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ShowMenu ->
            ( { model | showMenu = not model.showMenu }, Cmd.none )
