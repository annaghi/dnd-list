module Main exposing (main)

import Browser
import Browser.Dom
import Browser.Navigation
import DnDList.Groups.Parent
import DnDList.Single.Parent
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
init () url key =
    stepUrl url { key = key, example = NotFound, path = toPath url }


type Example
    = NotFound
    | Home Home.Model
    | Introduction Introduction.Parent.Model
    | Single DnDList.Single.Parent.Model
    | Groups DnDList.Groups.Parent.Model
    | Gallery Gallery.Parent.Model



-- UPDATE


type Msg
    = NoOp
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url
    | HomeMsg Home.Msg
    | IntroductionMsg Introduction.Parent.Msg
    | SingleMsg DnDList.Single.Parent.Msg
    | GroupsMsg DnDList.Groups.Parent.Msg
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

        ( SingleMsg msg, Single mo ) ->
            stepSingle model (DnDList.Single.Parent.update msg mo)

        ( GroupsMsg msg, Groups mo ) ->
            stepGroups model (DnDList.Groups.Parent.update msg mo)

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


stepSingle : Model -> ( DnDList.Single.Parent.Model, Cmd DnDList.Single.Parent.Msg ) -> ( Model, Cmd Msg )
stepSingle model ( mo, cmds ) =
    ( { model | example = Single mo }, Cmd.map SingleMsg cmds )


stepGroups : Model -> ( DnDList.Groups.Parent.Model, Cmd DnDList.Groups.Parent.Msg ) -> ( Model, Cmd Msg )
stepGroups model ( mo, cmds ) =
    ( { model | example = Groups mo }, Cmd.map GroupsMsg cmds )


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

        Single mo ->
            Sub.map SingleMsg (DnDList.Single.Parent.subscriptions mo)

        Groups mo ->
            Sub.map GroupsMsg (DnDList.Groups.Parent.subscriptions mo)

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
                        stepSingle model (DnDList.Single.Parent.init slug)
                    )
                    (Url.Parser.s Path.rootPath </> Url.Parser.s "single" </> slug_)
                , Url.Parser.map
                    (\slug ->
                        stepGroups model (DnDList.Groups.Parent.init slug)
                    )
                    (Url.Parser.s Path.rootPath </> Url.Parser.s "groups" </> slug_)
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
                , Html.map SingleMsg (DnDList.Single.Parent.navigationView model.path)
                , Html.map GroupsMsg (DnDList.Groups.Parent.navigationView model.path)
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

                Single mo ->
                    [ Html.map SingleMsg (DnDList.Single.Parent.headerView mo)
                    , Html.map SingleMsg (DnDList.Single.Parent.demoView mo)
                    , Html.map SingleMsg (DnDList.Single.Parent.codeView mo)
                    ]

                Groups mo ->
                    [ Html.map GroupsMsg (DnDList.Groups.Parent.headerView mo)
                    , Html.map GroupsMsg (DnDList.Groups.Parent.demoView mo)
                    , Html.map GroupsMsg (DnDList.Groups.Parent.codeView mo)
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
