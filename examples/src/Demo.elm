module Demo exposing (..)

import Browser
import Browser.Navigation
import DnDList.Groups.Parent
import DnDList.Single.Parent
import Gallery.Parent
import Html
import Introduction.Parent
import Url
import WeakCss



-- MODEL


type alias Model =
    Example


type Example
    = Introduction Introduction.Parent.Model
    | Single DnDList.Single.Parent.Model
    | Groups DnDList.Groups.Parent.Model
    | Gallery Gallery.Parent.Model


init : String -> String -> ( Model, Cmd Msg )
init slug inner =
    toExample slug inner



-- UPDATE


type Msg
    = IntroductionMsg Introduction.Parent.Msg
    | SingleMsg DnDList.Single.Parent.Msg
    | GroupsMsg DnDList.Groups.Parent.Msg
    | GalleryMsg Gallery.Parent.Msg


update : Browser.Navigation.Key -> Msg -> Model -> ( Model, Cmd Msg )
update key message model =
    case ( message, model ) of
        ( IntroductionMsg msg, Introduction mo ) ->
            stepIntroduction (Introduction.Parent.update msg mo)

        ( SingleMsg msg, Single mo ) ->
            stepSingle (DnDList.Single.Parent.update msg mo)

        ( GroupsMsg msg, Groups mo ) ->
            stepGroups (DnDList.Groups.Parent.update msg mo)

        ( GalleryMsg msg, Gallery mo ) ->
            stepGallery (Gallery.Parent.update msg mo)

        _ ->
            ( model, Cmd.none )


stepIntroduction : ( Introduction.Parent.Model, Cmd Introduction.Parent.Msg ) -> ( Model, Cmd Msg )
stepIntroduction ( mo, cmds ) =
    ( Introduction mo, Cmd.map IntroductionMsg cmds )


stepSingle : ( DnDList.Single.Parent.Model, Cmd DnDList.Single.Parent.Msg ) -> ( Model, Cmd Msg )
stepSingle ( mo, cmds ) =
    ( Single mo, Cmd.map SingleMsg cmds )


stepGroups : ( DnDList.Groups.Parent.Model, Cmd DnDList.Groups.Parent.Msg ) -> ( Model, Cmd Msg )
stepGroups ( mo, cmds ) =
    ( Groups mo, Cmd.map GroupsMsg cmds )


stepGallery : ( Gallery.Parent.Model, Cmd Gallery.Parent.Msg ) -> ( Model, Cmd Msg )
stepGallery ( mo, cmds ) =
    ( Gallery mo, Cmd.map GalleryMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        Introduction mo ->
            Sub.map IntroductionMsg (Introduction.Parent.subscriptions mo)

        Single mo ->
            Sub.map SingleMsg (DnDList.Single.Parent.subscriptions mo)

        Groups mo ->
            Sub.map GroupsMsg (DnDList.Groups.Parent.subscriptions mo)

        Gallery mo ->
            Sub.map GalleryMsg (Gallery.Parent.subscriptions mo)



-- VIEW


moduleClass : WeakCss.ClassName
moduleClass =
    WeakCss.namespace "dnd"


view : Model -> Html.Html Msg
view model =
    Html.div
        [ moduleClass |> WeakCss.nest "main" ]
        (case model of
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



-- EXAMPLE INFO


toExample : String -> String -> ( Example, Cmd Msg )
toExample slug inner =
    case slug of
        "introduction" ->
            Introduction.Parent.init inner
                |> Tuple.mapFirst Introduction
                |> Tuple.mapSecond (Cmd.map IntroductionMsg)

        "single" ->
            DnDList.Single.Parent.init inner
                |> Tuple.mapFirst Single
                |> Tuple.mapSecond (Cmd.map SingleMsg)

        "groups" ->
            DnDList.Groups.Parent.init inner
                |> Tuple.mapFirst Groups
                |> Tuple.mapSecond (Cmd.map GroupsMsg)

        "gallery" ->
            Gallery.Parent.init inner
                |> Tuple.mapFirst Gallery
                |> Tuple.mapSecond (Cmd.map GalleryMsg)

        _ ->
            Introduction.Parent.init inner
                |> Tuple.mapFirst Introduction
                |> Tuple.mapSecond (Cmd.map IntroductionMsg)
