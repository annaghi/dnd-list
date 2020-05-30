module Main exposing (main)

import Browser
import Browser.Dom
import Browser.Navigation
import Demo
import DnDList.Groups.Parent
import DnDList.Single.Parent
import Gallery.Parent
import Home
import Html
import Introduction.Parent
import Router
import Task
import Url
import Views
import WeakCss



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = RouteTo
        }



-- ROUTER


type Page
    = Home
    | Demo Demo.Model
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
    , Tuple.second genPage
    )



-- MODEL


type alias Model =
    { key : Browser.Navigation.Key
    , route : Router.Route
    , page : Page
    }


init : () -> Url.Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init () url key =
    routePage
        (Router.route url)
        { key = key
        , route = Router.route url
        , page = NotFound
        }



-- UPDATE


type Msg
    = RouteTo Browser.UrlRequest
    | UrlChanged Url.Url
    | DemoMsg Demo.Msg
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model.page ) of
        ( RouteTo url, _ ) ->
            case url of
                Browser.Internal location ->
                    ( model
                    , Cmd.batch
                        [ Browser.Navigation.pushUrl model.key (Url.toString location)
                        , jumpToTop "main"
                        ]
                    )

                Browser.External url_ ->
                    ( model
                      -- TODO Check this if statement
                    , if String.isEmpty url_ then
                        Cmd.none

                      else
                        Browser.Navigation.load url_
                    )

        ( UrlChanged url, _ ) ->
            routePage (Router.route url) model

        ( DemoMsg msg, Demo mo ) ->
            -- TODO Check if Browser.Navigation.pushUrl key is needed
            Demo.update model.key msg mo
                |> Tuple.mapFirst (\m -> { model | page = Demo m })
                |> Tuple.mapSecond (Cmd.map DemoMsg)

        _ ->
            ( model, Cmd.none )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.page of
        Home ->
            Sub.none

        Demo mo ->
            Sub.map DemoMsg (Demo.subscriptions mo)

        NotFound ->
            Sub.none



-- COMMANDS


jumpToTop : String -> Cmd Msg
jumpToTop id =
    Browser.Dom.getViewportOf id
        |> Task.andThen (\_ -> Browser.Dom.setViewportOf id 0 0)
        |> Task.attempt (\_ -> NoOp)



-- VIEW


moduleClass : WeakCss.ClassName
moduleClass =
    WeakCss.namespace "dnd"


view : Model -> Browser.Document Msg
view model =
    { title = "annaghi | dnd-list"
    , body =
        [ Html.div
            [ moduleClass |> WeakCss.withStates [ ( "home", model.page == Home ) ] ]
            [ Views.headerView
            , Html.div
                [ moduleClass |> WeakCss.nest "content" ]
                [ Html.div
                    [ moduleClass |> WeakCss.nestMany [ "content", "nav" ] ]
                    [ Introduction.Parent.navigationView
                    , DnDList.Single.Parent.navigationView
                    , DnDList.Groups.Parent.navigationView
                    , Gallery.Parent.navigationView
                    ]
                , case model.page of
                    Home ->
                        Home.view

                    Demo mo ->
                        Html.map DemoMsg (Demo.view mo)

                    NotFound ->
                        Html.text "Not found"
                ]
            , Views.footerView
            ]
        ]
    }
