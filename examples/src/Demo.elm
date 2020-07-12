module Demo exposing (..)

import Browser
import Browser.Navigation
import DnDList.Groups.Parent
import DnDList.Single.Parent
import Gallery.Parent
import Html
import Html.Attributes
import Introduction.Parent
import Url
import Views
import WeakCss



-- MODEL


type Example
    = Introduction Introduction.Parent.Example
    | Single DnDList.Single.Parent.Example
    | Groups DnDList.Groups.Parent.Example
    | Gallery Gallery.Parent.Example


init : String -> String -> ( Example, Cmd Msg )
init slug inner =
    toExample slug inner



-- UPDATE


type Msg
    = IntroductionMsg Introduction.Parent.Msg
    | SingleMsg DnDList.Single.Parent.Msg
    | GroupsMsg DnDList.Groups.Parent.Msg
    | GalleryMsg Gallery.Parent.Msg


subscriptions : Example -> Sub Msg
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


update : Browser.Navigation.Key -> Msg -> Example -> ( Example, Cmd Msg )
update key msg model =
    case ( msg, model ) of
        ( IntroductionMsg subMsg, Introduction subModel ) ->
            stepIntroduction (Introduction.Parent.update subMsg subModel)

        ( SingleMsg subMsg, Single subModel ) ->
            stepSingle (DnDList.Single.Parent.update subMsg subModel)

        ( GroupsMsg subMsg, Groups subModel ) ->
            stepGroups (DnDList.Groups.Parent.update subMsg subModel)

        ( GalleryMsg subMsg, Gallery subModel ) ->
            stepGallery (Gallery.Parent.update subMsg subModel)

        _ ->
            ( model, Cmd.none )


stepIntroduction : ( Introduction.Parent.Example, Cmd Introduction.Parent.Msg ) -> ( Example, Cmd Msg )
stepIntroduction ( subModel, subCmd ) =
    ( Introduction subModel, Cmd.map IntroductionMsg subCmd )


stepSingle : ( DnDList.Single.Parent.Example, Cmd DnDList.Single.Parent.Msg ) -> ( Example, Cmd Msg )
stepSingle ( subModel, subCmd ) =
    ( Single subModel, Cmd.map SingleMsg subCmd )


stepGroups : ( DnDList.Groups.Parent.Example, Cmd DnDList.Groups.Parent.Msg ) -> ( Example, Cmd Msg )
stepGroups ( subModel, subCmd ) =
    ( Groups subModel, Cmd.map GroupsMsg subCmd )


stepGallery : ( Gallery.Parent.Example, Cmd Gallery.Parent.Msg ) -> ( Example, Cmd Msg )
stepGallery ( subModel, subCmd ) =
    ( Gallery subModel, Cmd.map GalleryMsg subCmd )



-- VIEW


moduleClass : WeakCss.ClassName
moduleClass =
    WeakCss.namespace "dnd"


view : Bool -> Example -> Html.Html Msg
view showSidebar model =
    Html.main_
        [ moduleClass |> WeakCss.nest "demo" ]
        [ Html.section
            [ moduleClass |> WeakCss.nestMany [ "demo", "content" ] ]
            (case model of
                Introduction mo ->
                    List.map (Html.map IntroductionMsg) (Introduction.Parent.view mo)

                Single mo ->
                    List.map (Html.map SingleMsg) (DnDList.Single.Parent.view mo)

                Groups mo ->
                    List.map (Html.map GroupsMsg) (DnDList.Groups.Parent.view mo)

                Gallery mo ->
                    List.map (Html.map GalleryMsg) (Gallery.Parent.view mo)
            )
        , Html.section
            [ moduleClass |> WeakCss.addMany [ "demo", "chapters" ] |> WeakCss.withStates [ ( "show", showSidebar ) ] ]
            [ Introduction.Parent.chapterView "demo"
            , Gallery.Parent.chapterView "demo"
            , DnDList.Single.Parent.chapterView "demo"
            , DnDList.Groups.Parent.chapterView "demo"
            ]
        ]



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
