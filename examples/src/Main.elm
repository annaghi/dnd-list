module Main exposing (main)

import Browser
import Browser.Dom
import Browser.Navigation
import DnDList.Parent
import DnDListGroups.Parent
import Gallery.Parent
import Home
import Html
import Html.Attributes
import Introduction.Parent
import Path
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
    | Introduction Introduction.Parent.Model
    | DnDList DnDList.Parent.Model
    | DnDListGroups DnDListGroups.Parent.Model
    | Gallery Gallery.Parent.Model



-- UPDATE


type Msg
    = NoOp
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | HomeMsg Home.Msg
    | IntroductionMsg Introduction.Parent.Msg
    | DnDListMsg DnDList.Parent.Msg
    | DnDListGroupsMsg DnDListGroups.Parent.Msg
    | GalleryMsg Gallery.Parent.Msg


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
            stepIntroduction model (Introduction.Parent.update msg mo)

        ( DnDListMsg msg, DnDList mo ) ->
            stepConfig model (DnDList.Parent.update msg mo)

        ( DnDListGroupsMsg msg, DnDListGroups mo ) ->
            stepConfigGroups model (DnDListGroups.Parent.update msg mo)

        ( GalleryMsg msg, Gallery mo ) ->
            stepGallery model (Gallery.Parent.update msg mo)

        _ ->
            ( model, Cmd.none )


stepHome : Model -> ( Home.Model, Cmd Home.Msg ) -> ( Model, Cmd Msg )
stepHome model ( mo, cmds ) =
    ( { model | example = Home mo }, Cmd.map HomeMsg cmds )


stepIntroduction : Model -> ( Introduction.Parent.Model, Cmd Introduction.Parent.Msg ) -> ( Model, Cmd Msg )
stepIntroduction model ( mo, cmds ) =
    ( { model | example = Introduction mo }, Cmd.map IntroductionMsg cmds )


stepConfig : Model -> ( DnDList.Parent.Model, Cmd DnDList.Parent.Msg ) -> ( Model, Cmd Msg )
stepConfig model ( mo, cmds ) =
    ( { model | example = DnDList mo }, Cmd.map DnDListMsg cmds )


stepConfigGroups : Model -> ( DnDListGroups.Parent.Model, Cmd DnDListGroups.Parent.Msg ) -> ( Model, Cmd Msg )
stepConfigGroups model ( mo, cmds ) =
    ( { model | example = DnDListGroups mo }, Cmd.map DnDListGroupsMsg cmds )


stepGallery : Model -> ( Gallery.Parent.Model, Cmd Gallery.Parent.Msg ) -> ( Model, Cmd Msg )
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
            Sub.map IntroductionMsg (Introduction.Parent.subscriptions mo)

        DnDList mo ->
            Sub.map DnDListMsg (DnDList.Parent.subscriptions mo)

        DnDListGroups mo ->
            Sub.map DnDListGroupsMsg (DnDListGroups.Parent.subscriptions mo)

        Gallery mo ->
            Sub.map GalleryMsg (Gallery.Parent.subscriptions mo)



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
                    (stepGallery model (Gallery.Parent.init "hanoi"))
                    Url.Parser.top
                , Url.Parser.map
                    (stepGallery model (Gallery.Parent.init "hanoi"))
                    (Url.Parser.s Path.rootPath)
                , Url.Parser.map
                    (\slug ->
                        stepIntroduction model (Introduction.Parent.init slug)
                    )
                    (Url.Parser.s Path.rootPath </> Url.Parser.s "introduction" </> slug_)
                , Url.Parser.map
                    (\slug ->
                        stepConfig model (DnDList.Parent.init slug)
                    )
                    (Url.Parser.s Path.rootPath </> Url.Parser.s "DnDList" </> slug_)
                , Url.Parser.map
                    (\slug ->
                        stepConfigGroups model (DnDListGroups.Parent.init slug)
                    )
                    (Url.Parser.s Path.rootPath </> Url.Parser.s "DnDListGroups" </> slug_)
                , Url.Parser.map
                    (\slug ->
                        stepGallery model (Gallery.Parent.init slug)
                    )
                    (Url.Parser.s Path.rootPath </> Url.Parser.s "gallery" </> slug_)
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
    if (url.path == "/" ++ Path.rootPath) || (url.path == "/" ++ Path.rootPath ++ "/") then
        Url.Builder.absolute [ Path.rootPath, "gallery", "hanoi" ] []

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
                [ Html.map IntroductionMsg (Introduction.Parent.navigationView model.path)
                , Html.map DnDListMsg (DnDList.Parent.navigationView model.path)
                , Html.map DnDListGroupsMsg (DnDListGroups.Parent.navigationView model.path)
                , Html.map GalleryMsg (Gallery.Parent.navigationView model.path)
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
                    [ Html.map IntroductionMsg (Introduction.Parent.headerView mo)
                    , Html.map IntroductionMsg (Introduction.Parent.demoView mo)
                    , Html.map IntroductionMsg (Introduction.Parent.codeView mo)
                    ]

                DnDList mo ->
                    [ Html.map DnDListMsg (DnDList.Parent.headerView mo)
                    , Html.map DnDListMsg (DnDList.Parent.demoView mo)
                    , Html.map DnDListMsg (DnDList.Parent.codeView mo)
                    ]

                DnDListGroups mo ->
                    [ Html.map DnDListGroupsMsg (DnDListGroups.Parent.headerView mo)
                    , Html.map DnDListGroupsMsg (DnDListGroups.Parent.demoView mo)
                    , Html.map DnDListGroupsMsg (DnDListGroups.Parent.codeView mo)
                    ]

                Gallery mo ->
                    [ Html.map GalleryMsg (Gallery.Parent.headerView mo)
                    , Html.map GalleryMsg (Gallery.Parent.demoView mo)
                    , Html.map GalleryMsg (Gallery.Parent.codeView mo)
                    ]
            )
        ]
    }


cardView : Html.Html Msg
cardView =
    Html.header []
        [ Html.h1 []
            [ Html.a
                [ Html.Attributes.href (Url.Builder.absolute [ Path.rootPath ] []) ]
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
