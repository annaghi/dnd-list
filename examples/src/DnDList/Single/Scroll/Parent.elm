module DnDList.Single.Scroll.Parent exposing
    ( Model
    , Msg
    , init
    , initialModel
    , subscriptions
    , update
    , url
    , view
    )

import DnDList.Single.Scroll.Scroll
import DnDList.Single.Scroll.ScrollWithOffset
import DnDList.Single.Scroll.ScrollWithOffsetAndWall
import Html
import Views



-- MODEL


type alias Model =
    { id : Int
    , examples : List Example
    }


type Example
    = Scroll DnDList.Single.Scroll.Scroll.Model
    | ScrollWithOffset DnDList.Single.Scroll.ScrollWithOffset.Model
    | ScrollWithOffsetAndWall DnDList.Single.Scroll.ScrollWithOffsetAndWall.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ Scroll DnDList.Single.Scroll.Scroll.initialModel
        , ScrollWithOffset DnDList.Single.Scroll.ScrollWithOffset.initialModel
        , ScrollWithOffsetAndWall DnDList.Single.Scroll.ScrollWithOffsetAndWall.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/Horizontal.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/Vertical.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/Table.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | ScrollMsg DnDList.Single.Scroll.Scroll.Msg
    | ScrollWithOffsetMsg DnDList.Single.Scroll.ScrollWithOffset.Msg
    | ScrollWithOffsetAndWallMsg DnDList.Single.Scroll.ScrollWithOffsetAndWall.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        LinkClicked id ->
            ( { model | id = id }, Cmd.none )

        _ ->
            model.examples
                |> List.map
                    (\example ->
                        case ( message, example ) of
                            ( ScrollMsg msg, Scroll mo ) ->
                                stepScroll (DnDList.Single.Scroll.Scroll.update msg mo)

                            ( ScrollWithOffsetMsg msg, ScrollWithOffset mo ) ->
                                stepScrollWithOffset (DnDList.Single.Scroll.ScrollWithOffset.update msg mo)

                            ( ScrollWithOffsetAndWallMsg msg, ScrollWithOffsetAndWall mo ) ->
                                stepScrollWithOffsetAndWall (DnDList.Single.Scroll.ScrollWithOffsetAndWall.update msg mo)

                            _ ->
                                ( example, Cmd.none )
                    )
                |> List.unzip
                |> (\( examples, cmds ) -> ( { model | examples = examples }, Cmd.batch cmds ))


stepScroll : ( DnDList.Single.Scroll.Scroll.Model, Cmd DnDList.Single.Scroll.Scroll.Msg ) -> ( Example, Cmd Msg )
stepScroll ( mo, cmds ) =
    ( Scroll mo, Cmd.map ScrollMsg cmds )


stepScrollWithOffset : ( DnDList.Single.Scroll.ScrollWithOffset.Model, Cmd DnDList.Single.Scroll.ScrollWithOffset.Msg ) -> ( Example, Cmd Msg )
stepScrollWithOffset ( mo, cmds ) =
    ( ScrollWithOffset mo, Cmd.map ScrollWithOffsetMsg cmds )


stepScrollWithOffsetAndWall : ( DnDList.Single.Scroll.ScrollWithOffsetAndWall.Model, Cmd DnDList.Single.Scroll.ScrollWithOffsetAndWall.Msg ) -> ( Example, Cmd Msg )
stepScrollWithOffsetAndWall ( mo, cmds ) =
    ( ScrollWithOffsetAndWall mo, Cmd.map ScrollWithOffsetAndWallMsg cmds )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    model.examples
        |> List.map
            (\example ->
                case example of
                    Scroll mo ->
                        Sub.map ScrollMsg (DnDList.Single.Scroll.Scroll.subscriptions mo)

                    ScrollWithOffset mo ->
                        Sub.map ScrollWithOffsetMsg (DnDList.Single.Scroll.ScrollWithOffset.subscriptions mo)

                    ScrollWithOffsetAndWall mo ->
                        Sub.map ScrollWithOffsetAndWallMsg (DnDList.Single.Scroll.ScrollWithOffsetAndWall.subscriptions mo)
            )
        |> Sub.batch



-- VIEW


view : Model -> Html.Html Msg
view model =
    Views.examplesView LinkClicked info model.id model.examples


info : Example -> Views.SubInfo Msg
info example =
    case example of
        Scroll mo ->
            { title = "Simple scroll"
            , subView = Html.map ScrollMsg (DnDList.Single.Scroll.Scroll.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/Horizontal.elm"
            }

        ScrollWithOffset mo ->
            { title = "Container with offset"
            , subView = Html.map ScrollWithOffsetMsg (DnDList.Single.Scroll.ScrollWithOffset.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/Vertical.elm"
            }

        ScrollWithOffsetAndWall mo ->
            { title = "Container with offset and wall"
            , subView = Html.map ScrollWithOffsetAndWallMsg (DnDList.Single.Scroll.ScrollWithOffsetAndWall.view mo)
            , link = "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/Table.elm"
            }
