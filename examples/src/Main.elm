module Main exposing (main)

import Base
import Browser
import Browser.Dom
import Browser.Navigation
import Config.Root
import ConfigGroups.Root
import Gallery.Root
import Home
import Html
import Html.Attributes
import Introduction.Root
import Task
import Url
import Url.Builder
import Url.Parser exposing ((</>))



-- MAIN


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }



-- MODEL


type alias Model =
    { key : Browser.Navigation.Key
    , example : Example
    , path : String
    }


init : () -> Url.Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init flags url key =
    stepUrl url { key = key, example = NotFound, path = toPath url }


type Example
    = NotFound
    | Home Home.Model
    | Introduction Introduction.Root.Model
    | DnD Config.Root.Model
    | ConfigGroups ConfigGroups.Root.Model
    | Gallery Gallery.Root.Model



-- UPDATE


type Msg
    = NoOp
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | HomeMsg Home.Msg
    | IntroductionMsg Introduction.Root.Msg
    | DnDMsg Config.Root.Msg
    | DnDGroupsMsg ConfigGroups.Root.Msg
    | GalleryMsg Gallery.Root.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model.example ) of
        ( NoOp, _ ) ->
            ( model, Cmd.none )

        ( LinkClicked urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( { model | path = toPath url }
                    , Cmd.batch
                        [ Browser.Navigation.pushUrl model.key (Url.toString url)
                        , jumpToTop "main"
                        ]
                    )

                Browser.External href ->
                    ( model
                    , Browser.Navigation.load href
                    )

        ( UrlChanged url, _ ) ->
            stepUrl url model

        ( HomeMsg msg, Home mo ) ->
            stepHome model (Home.update msg mo)

        ( IntroductionMsg msg, Introduction mo ) ->
            stepIntroduction model (Introduction.Root.update msg mo)

        ( DnDMsg msg, DnD mo ) ->
            stepDnD model (Config.Root.update msg mo)

        ( DnDGroupsMsg msg, ConfigGroups mo ) ->
            stepDnDGroups model (ConfigGroups.Root.update msg mo)

        ( GalleryMsg msg, Gallery mo ) ->
            stepGallery model (Gallery.Root.update msg mo)

        _ ->
            ( model, Cmd.none )


stepHome : Model -> ( Home.Model, Cmd Home.Msg ) -> ( Model, Cmd Msg )
stepHome model ( mo, cmds ) =
    ( { model | example = Home mo }, Cmd.map HomeMsg cmds )


stepIntroduction : Model -> ( Introduction.Root.Model, Cmd Introduction.Root.Msg ) -> ( Model, Cmd Msg )
stepIntroduction model ( mo, cmds ) =
    ( { model | example = Introduction mo }, Cmd.map IntroductionMsg cmds )


stepDnD : Model -> ( Config.Root.Model, Cmd Config.Root.Msg ) -> ( Model, Cmd Msg )
stepDnD model ( mo, cmds ) =
    ( { model | example = DnD mo }, Cmd.map DnDMsg cmds )


stepDnDGroups : Model -> ( ConfigGroups.Root.Model, Cmd ConfigGroups.Root.Msg ) -> ( Model, Cmd Msg )
stepDnDGroups model ( mo, cmds ) =
    ( { model | example = ConfigGroups mo }, Cmd.map DnDGroupsMsg cmds )


stepGallery : Model -> ( Gallery.Root.Model, Cmd Gallery.Root.Msg ) -> ( Model, Cmd Msg )
stepGallery model ( mo, cmds ) =
    ( { model | example = Gallery mo }, Cmd.map GalleryMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.example of
        NotFound ->
            Sub.none

        Home mo ->
            Sub.map HomeMsg (Home.subscriptions mo)

        Introduction mo ->
            Sub.map IntroductionMsg (Introduction.Root.subscriptions mo)

        DnD mo ->
            Sub.map DnDMsg (Config.Root.subscriptions mo)

        ConfigGroups mo ->
            Sub.map DnDGroupsMsg (ConfigGroups.Root.subscriptions mo)

        Gallery mo ->
            Sub.map GalleryMsg (Gallery.Root.subscriptions mo)



-- COMMANDS


jumpToTop : String -> Cmd Msg
jumpToTop id =
    Browser.Dom.getViewportOf id
        |> Task.andThen (\_ -> Browser.Dom.setViewportOf id 0 0)
        |> Task.attempt (\_ -> NoOp)



-- ROUTER


stepUrl : Url.Url -> Model -> ( Model, Cmd Msg )
stepUrl url model =
    let
        parser : Url.Parser.Parser (( Model, Cmd Msg ) -> b) b
        parser =
            Url.Parser.oneOf
                [ Url.Parser.map
                    (stepIntroduction model (Introduction.Root.init "groups"))
                    Url.Parser.top
                , Url.Parser.map
                    (stepIntroduction model (Introduction.Root.init "groups"))
                    (Url.Parser.s Base.base)
                , Url.Parser.map
                    (\slug ->
                        stepIntroduction model (Introduction.Root.init slug)
                    )
                    (Url.Parser.s Base.base </> Url.Parser.s "introduction" </> slug_)
                , Url.Parser.map
                    (\slug ->
                        stepDnD model (Config.Root.init slug)
                    )
                    (Url.Parser.s Base.base </> Url.Parser.s "config" </> slug_)
                , Url.Parser.map
                    (\slug ->
                        stepDnDGroups model (ConfigGroups.Root.init slug)
                    )
                    (Url.Parser.s Base.base </> Url.Parser.s "config-groups" </> slug_)
                , Url.Parser.map
                    (\slug ->
                        stepGallery model (Gallery.Root.init slug)
                    )
                    (Url.Parser.s Base.base </> Url.Parser.s "gallery" </> slug_)
                ]
    in
    case Url.Parser.parse parser url of
        Nothing ->
            ( { model | example = NotFound }, Cmd.none )

        Just answer ->
            answer


slug_ : Url.Parser.Parser (String -> a) a
slug_ =
    Url.Parser.custom "SLUG" Just


toPath : Url.Url -> String
toPath url =
    if (url.path == "/" ++ Base.base) || (url.path == "/" ++ Base.base ++ "/") then
        Url.Builder.absolute [ Base.base, "introduction", "groups" ] []

    else
        url.path



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "annaghi | dnd-list"
    , body =
        [ Html.div
            [ Html.Attributes.id "sidebar" ]
            [ cardView
            , Html.nav []
                [ Html.map IntroductionMsg (Introduction.Root.navigationView model.path)
                , Html.map DnDMsg (Config.Root.navigationView model.path)
                , Html.map DnDGroupsMsg (ConfigGroups.Root.navigationView model.path)
                , Html.map GalleryMsg (Gallery.Root.navigationView model.path)
                ]
            ]
        , Html.main_
            [ Html.Attributes.id "main" ]
            (case model.example of
                NotFound ->
                    [ Html.text "Not found" ]

                Home mo ->
                    [ Html.map HomeMsg (Home.view mo) ]

                Introduction mo ->
                    [ Html.map IntroductionMsg (Introduction.Root.headerView mo)
                    , Html.map IntroductionMsg (Introduction.Root.demoView mo)
                    , Html.map IntroductionMsg (Introduction.Root.codeView mo)
                    ]

                DnD mo ->
                    [ Html.map DnDMsg (Config.Root.headerView mo)
                    , Html.map DnDMsg (Config.Root.demoView mo)
                    , Html.map DnDMsg (Config.Root.codeView mo)
                    ]

                ConfigGroups mo ->
                    [ Html.map DnDGroupsMsg (ConfigGroups.Root.headerView mo)
                    , Html.map DnDGroupsMsg (ConfigGroups.Root.demoView mo)
                    , Html.map DnDGroupsMsg (ConfigGroups.Root.codeView mo)
                    ]

                Gallery mo ->
                    [ Html.map GalleryMsg (Gallery.Root.headerView mo)
                    , Html.map GalleryMsg (Gallery.Root.demoView mo)
                    , Html.map GalleryMsg (Gallery.Root.codeView mo)
                    ]
            )
        ]
    }


cardView : Html.Html Msg
cardView =
    Html.header []
        [ Html.h1 []
            [ Html.a
                [ Html.Attributes.href (Url.Builder.absolute [ Base.base ] []) ]
                [ Html.text "dnd-list" ]
            ]
        , Html.div []
            [ Html.a
                [ Html.Attributes.href "https://github.com/annaghi/dnd-list" ]
                [ Html.text "GitHub" ]
            , Html.text " | "
            , Html.a
                [ Html.Attributes.href "https://package.elm-lang.org/packages/annaghi/dnd-list/latest" ]
                [ Html.text "Docs" ]
            ]
        , Html.p [] [ Html.text "Drag and Drop for sortable lists in Elm web apps with mouse support" ]
        ]
