module Main exposing (main)

import Browser
import Browser.Dom
import Browser.Navigation
import Demo
import Global
import Home
import Html
import Router
import Task
import Url
import Views



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = OnUrlChange
        , onUrlRequest = OnUrlRequest
        }



-- ROUTER


type Page
    = Home
    | Demo Demo.Example
    | NotFound


routePage : Router.Route -> Model -> ( Model, Cmd Msg )
routePage route model =
    let
        genPage : ( Page, Cmd Msg )
        genPage =
            case route of
                Router.Home ->
                    ( Home, Cmd.none )

                Router.Demo a b ->
                    Demo.init a b
                        |> Tuple.mapFirst Demo
                        |> Tuple.mapSecond (Cmd.map DemoMsg)

                Router.NotFound ->
                    ( NotFound, Cmd.none )
    in
    ( { model
        | page = Tuple.first genPage
        , route = route
      }
    , Cmd.batch
        [ Tuple.second genPage
        , Task.perform (\_ -> GlobalMsg Global.ShowMenu) (Task.succeed ())

        -- , jumpToTop "dnd"
        ]
    )



-- MODEL


type alias Model =
    { key : Browser.Navigation.Key
    , route : Router.Route
    , global : Global.Model
    , page : Page
    }


init : () -> Url.Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init () url key =
    routePage
        (Router.route url)
        { key = key
        , route = Router.route url
        , global = Global.initialModel -- No commands yet
        , page = NotFound
        }



-- UPDATE


type Msg
    = OnUrlRequest Browser.UrlRequest
    | OnUrlChange Url.Url
    | GlobalMsg Global.Msg
    | DemoMsg Demo.Msg
    | NoOp


jumpToTop : String -> Cmd Msg
jumpToTop id =
    Browser.Dom.getViewportOf id
        |> Task.andThen (\_ -> Browser.Dom.setViewportOf id 0 0)
        |> Task.attempt (\_ -> NoOp)


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.page of
        Home ->
            Sub.none

        Demo mo ->
            Sub.map DemoMsg (Demo.subscriptions mo)

        NotFound ->
            Sub.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnUrlRequest (Browser.Internal location) ->
            ( model
            , Browser.Navigation.pushUrl model.key (Url.toString location)
            )

        OnUrlRequest (Browser.External url) ->
            ( model
              -- TODO Check this if statement
            , if String.isEmpty url then
                Cmd.none

              else
                Browser.Navigation.load url
            )

        OnUrlChange url ->
            routePage (Router.route url) model

        GlobalMsg globalMsg ->
            Global.update globalMsg model.global
                |> Tuple.mapFirst (\m -> { model | global = m })
                |> Tuple.mapSecond (Cmd.map GlobalMsg)

        DemoMsg demoMsg ->
            case model.page of
                Demo mo ->
                    -- TODO Check if Browser.Navigation.pushUrl key is needed
                    Demo.update model.key demoMsg mo
                        |> Tuple.mapFirst (\m -> { model | page = Demo m })
                        |> Tuple.mapSecond (Cmd.map DemoMsg)

                _ ->
                    ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "annaghi | dnd-list"
    , body =
        Views.bodyView
            (GlobalMsg Global.ShowMenu)
            (model.page == Home)
            (case model.page of
                Home ->
                    Home.view

                Demo mo ->
                    Html.map DemoMsg (Demo.view model.global.showMenu mo)

                NotFound ->
                    -- TODO Create a nice view for this page too
                    Html.text "Not found"
            )
    }
