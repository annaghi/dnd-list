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
import DnDList.Single.Scroll.ScrollWithOffsetAndArea
import DnDList.Single.Scroll.ScrollWithOffsetAndFence
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
    | ScrollWithOffsetAndFence DnDList.Single.Scroll.ScrollWithOffsetAndFence.Model
    | ScrollWithOffsetAndArea DnDList.Single.Scroll.ScrollWithOffsetAndArea.Model


initialModel : Model
initialModel =
    { id = 0
    , examples =
        [ Scroll DnDList.Single.Scroll.Scroll.initialModel
        , ScrollWithOffset DnDList.Single.Scroll.ScrollWithOffset.initialModel
        , ScrollWithOffsetAndFence DnDList.Single.Scroll.ScrollWithOffsetAndFence.initialModel
        , ScrollWithOffsetAndArea DnDList.Single.Scroll.ScrollWithOffsetAndArea.initialModel
        ]
    }


init : () -> ( Model, Cmd Msg )
init () =
    ( initialModel, Cmd.none )


url : Int -> String
url id =
    case id of
        0 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/Scroll.elm"

        1 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/ScrollWithOffset.elm"

        2 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/ScrollWithOffsetAndFence.elm"

        3 ->
            "https://raw.githubusercontent.com/annaghi/dnd-list/master/examples/src/DnDList/Single/Scroll/ScrollWithOffsetAndArea.elm"

        _ ->
            ""



-- UPDATE


type Msg
    = LinkClicked Int
    | ScrollMsg DnDList.Single.Scroll.Scroll.Msg
    | ScrollWithOffsetMsg DnDList.Single.Scroll.ScrollWithOffset.Msg
    | ScrollWithOffsetAndFenceMsg DnDList.Single.Scroll.ScrollWithOffsetAndFence.Msg
    | ScrollWithOffsetAndAreaMsg DnDList.Single.Scroll.ScrollWithOffsetAndArea.Msg


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

                            ( ScrollWithOffsetAndFenceMsg msg, ScrollWithOffsetAndFence mo ) ->
                                stepScrollWithOffsetAndFence (DnDList.Single.Scroll.ScrollWithOffsetAndFence.update msg mo)

                            ( ScrollWithOffsetAndAreaMsg msg, ScrollWithOffsetAndArea mo ) ->
                                stepScrollWithOffsetAndArea (DnDList.Single.Scroll.ScrollWithOffsetAndArea.update msg mo)

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


stepScrollWithOffsetAndFence : ( DnDList.Single.Scroll.ScrollWithOffsetAndFence.Model, Cmd DnDList.Single.Scroll.ScrollWithOffsetAndFence.Msg ) -> ( Example, Cmd Msg )
stepScrollWithOffsetAndFence ( mo, cmds ) =
    ( ScrollWithOffsetAndFence mo, Cmd.map ScrollWithOffsetAndFenceMsg cmds )


stepScrollWithOffsetAndArea : ( DnDList.Single.Scroll.ScrollWithOffsetAndArea.Model, Cmd DnDList.Single.Scroll.ScrollWithOffsetAndArea.Msg ) -> ( Example, Cmd Msg )
stepScrollWithOffsetAndArea ( mo, cmds ) =
    ( ScrollWithOffsetAndArea mo, Cmd.map ScrollWithOffsetAndAreaMsg cmds )



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

                    ScrollWithOffsetAndFence mo ->
                        Sub.map ScrollWithOffsetAndFenceMsg (DnDList.Single.Scroll.ScrollWithOffsetAndFence.subscriptions mo)

                    ScrollWithOffsetAndArea mo ->
                        Sub.map ScrollWithOffsetAndAreaMsg (DnDList.Single.Scroll.ScrollWithOffsetAndArea.subscriptions mo)
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
            }

        ScrollWithOffset mo ->
            { title = "Container with offset"
            , subView = Html.map ScrollWithOffsetMsg (DnDList.Single.Scroll.ScrollWithOffset.view mo)
            }

        ScrollWithOffsetAndFence mo ->
            { title = "Container with offset and fence"
            , subView = Html.map ScrollWithOffsetAndFenceMsg (DnDList.Single.Scroll.ScrollWithOffsetAndFence.view mo)
            }

        ScrollWithOffsetAndArea mo ->
            { title = "Container with scrollable area"
            , subView = Html.map ScrollWithOffsetAndAreaMsg (DnDList.Single.Scroll.ScrollWithOffsetAndArea.view mo)
            }
