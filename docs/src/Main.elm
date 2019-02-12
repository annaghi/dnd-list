module Main exposing (main)

import Browser
import Browser.Dom
import Example.Basic
import Example.Free
import Example.Horizontal
import Example.Vertical
import Example.WithTwoLists
import Html
import Html.Attributes
import Html.Events
import Json.Encode
import Task



-- MAIN


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { key : Int
    , example : Example
    }


type Example
    = Basic Example.Basic.Model
    | Free Example.Free.Model
    | Horizontal Example.Horizontal.Model
    | Vertical Example.Vertical.Model
    | WithTwoLists Example.WithTwoLists.Model


init : () -> ( Model, Cmd Msg )
init _ =
    ( { key = 1
      , example = Free Example.Free.initialModel
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = NoOp
    | ButtonClicked Int Example
    | BasicMsg Example.Basic.Msg
    | FreeMsg Example.Free.Msg
    | HorizontalMsg Example.Horizontal.Msg
    | VerticalMsg Example.Vertical.Msg
    | WithTwoListsMsg Example.WithTwoLists.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        NoOp ->
            ( model, Cmd.none )

        ButtonClicked key example ->
            ( { model | key = key, example = example }
            , jumpToTop "main"
            )

        BasicMsg msg ->
            case model.example of
                Basic basic ->
                    stepBasic model (Example.Basic.update msg basic)

                _ ->
                    ( model, Cmd.none )

        FreeMsg msg ->
            case model.example of
                Free free ->
                    stepFree model (Example.Free.update msg free)

                _ ->
                    ( model, Cmd.none )

        HorizontalMsg msg ->
            case model.example of
                Horizontal horizontal ->
                    stepHorizontal model (Example.Horizontal.update msg horizontal)

                _ ->
                    ( model, Cmd.none )

        VerticalMsg msg ->
            case model.example of
                Vertical vertical ->
                    stepVertical model (Example.Vertical.update msg vertical)

                _ ->
                    ( model, Cmd.none )

        WithTwoListsMsg msg ->
            case model.example of
                WithTwoLists withTwoLists ->
                    stepWithTwoLists model (Example.WithTwoLists.update msg withTwoLists)

                _ ->
                    ( model, Cmd.none )


stepBasic : Model -> ( Example.Basic.Model, Cmd Example.Basic.Msg ) -> ( Model, Cmd Msg )
stepBasic model ( basic, cmds ) =
    ( { model | example = Basic basic }
    , Cmd.map BasicMsg cmds
    )


stepFree : Model -> ( Example.Free.Model, Cmd Example.Free.Msg ) -> ( Model, Cmd Msg )
stepFree model ( free, cmds ) =
    ( { model | example = Free free }
    , Cmd.map FreeMsg cmds
    )


stepHorizontal : Model -> ( Example.Horizontal.Model, Cmd Example.Horizontal.Msg ) -> ( Model, Cmd Msg )
stepHorizontal model ( horizontal, cmds ) =
    ( { model | example = Horizontal horizontal }
    , Cmd.map HorizontalMsg cmds
    )


stepVertical : Model -> ( Example.Vertical.Model, Cmd Example.Vertical.Msg ) -> ( Model, Cmd Msg )
stepVertical model ( vertical, cmds ) =
    ( { model | example = Vertical vertical }
    , Cmd.map VerticalMsg cmds
    )


stepWithTwoLists : Model -> ( Example.WithTwoLists.Model, Cmd Example.WithTwoLists.Msg ) -> ( Model, Cmd Msg )
stepWithTwoLists model ( withTwoLists, cmds ) =
    ( { model | example = WithTwoLists withTwoLists }
    , Cmd.map WithTwoListsMsg cmds
    )



-- COMMANDS


jumpToTop : String -> Cmd Msg
jumpToTop id =
    Browser.Dom.getViewportOf id
        |> Task.andThen (\_ -> Browser.Dom.setViewportOf id 0 0)
        |> Task.attempt (\_ -> NoOp)



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.example of
        Basic basic ->
            exampleSubscriptions BasicMsg (Example.Basic.subscriptions basic)

        Free free ->
            exampleSubscriptions FreeMsg (Example.Free.subscriptions free)

        Horizontal horizontal ->
            exampleSubscriptions HorizontalMsg (Example.Horizontal.subscriptions horizontal)

        Vertical vertical ->
            exampleSubscriptions VerticalMsg (Example.Vertical.subscriptions vertical)

        WithTwoLists withTwoLists ->
            exampleSubscriptions WithTwoListsMsg (Example.WithTwoLists.subscriptions withTwoLists)


exampleSubscriptions : (a -> msg) -> Sub a -> Sub msg
exampleSubscriptions toMsg details =
    Sub.map toMsg details



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "annaghi | dnd-list"
    , body =
        [ Html.nav []
            [ cardView
            , navigationView
                model.key
                [ Basic Example.Basic.initialModel
                , Free Example.Free.initialModel
                , Horizontal Example.Horizontal.initialModel
                , Vertical Example.Vertical.initialModel
                , WithTwoLists Example.WithTwoLists.initialModel
                ]
            ]
        , mainView model.example
        ]
    }


cardView : Html.Html Msg
cardView =
    Html.div []
        [ Html.h1 [] [ Html.text "dnd-list" ]
        , Html.div []
            [ Html.a
                [ Html.Attributes.href "https://github.com/annaghi/dnd-list" ]
                [ Html.text "GitHub" ]
            , Html.text " / "
            , Html.a
                [ Html.Attributes.href "https://package.elm-lang.org/packages/annaghi/dnd-list/latest" ]
                [ Html.text "Docs" ]
            ]
        , Html.p [] [ Html.text "Drag and Drop for sortable lists in Elm web apps with mouse events" ]
        ]


navigationView : Int -> List Example -> Html.Html Msg
navigationView currentKey list =
    let
        linkView : Int -> Example -> Html.Html Msg
        linkView key example =
            Html.li
                [ Html.Events.onClick (ButtonClicked key example)
                , Html.Attributes.classList [ ( "is-active", key == currentKey ) ]
                ]
                [ Html.text ((title >> .h1) example) ]
    in
    Html.div []
        [ Html.h2 [] [ Html.text "Examples" ]
        , list
            |> List.indexedMap linkView
            |> Html.ul []
        ]


mainView : Example -> Html.Html Msg
mainView example =
    let
        h2 =
            (title >> .h2) example

        h3 =
            (title >> .h3) example
    in
    case example of
        Basic basic ->
            Html.main_ [ Html.Attributes.id "main" ]
                [ exampleView h2 h3 BasicMsg (Example.Basic.view basic)
                , codeView Example.Basic.source
                ]

        Free free ->
            Html.main_ [ Html.Attributes.id "main" ]
                [ exampleView h2 h3 FreeMsg (Example.Free.view free)
                , codeView Example.Free.source
                ]

        Horizontal horizontal ->
            Html.main_ [ Html.Attributes.id "main" ]
                [ exampleView h2 h3 HorizontalMsg (Example.Horizontal.view horizontal)
                , codeView Example.Horizontal.source
                ]

        Vertical vertical ->
            Html.main_ [ Html.Attributes.id "main" ]
                [ exampleView h2 h3 VerticalMsg (Example.Vertical.view vertical)
                , codeView Example.Vertical.source
                ]

        WithTwoLists withTwoLists ->
            Html.main_ [ Html.Attributes.id "main" ]
                [ exampleView h2 h3 WithTwoListsMsg (Example.WithTwoLists.view withTwoLists)
                , codeView Example.WithTwoLists.source
                ]


exampleView : String -> String -> (a -> msg) -> Html.Html a -> Html.Html msg
exampleView h2 h3 toMsg details =
    Html.div
        [ Html.Attributes.class "elm-demo" ]
        [ Html.h2 [] [ Html.text h2 ]
        , Html.h3 [] [ Html.text h3 ]
        , Html.map toMsg details
        ]


codeView : String -> Html.Html msg
codeView source =
    Html.div
        [ Html.Attributes.class "elm-code" ]
        [ Html.h3 [] [ Html.text "Source" ]
        , elmCode [ code source ] []
        ]



-- CUSTOM ELEMENTS


elmCode : List (Html.Attribute msg) -> List (Html.Html msg) -> Html.Html msg
elmCode attrs elems =
    Html.node "elm-code" attrs elems


code : String -> Html.Attribute msg
code string =
    Html.Attributes.property "code" (Json.Encode.string string)



-- HELPERS


type alias Header =
    { h1 : String
    , h2 : String
    , h3 : String
    }


title : Example -> Header
title example =
    case example of
        Basic _ ->
            { h1 = "Basic"
            , h2 = "Basic example"
            , h3 = "Sortable list"
            }

        Free _ ->
            { h1 = "Free"
            , h2 = "Free drag movement"
            , h3 = "Example with keyed nodes"
            }

        Horizontal _ ->
            { h1 = "Horizontal"
            , h2 = "Horizontal drag only"
            , h3 = "Example with keyed nodes"
            }

        Vertical _ ->
            { h1 = "Vertical"
            , h2 = "Vertical drag only"
            , h3 = "Example with keyed nodes"
            }

        WithTwoLists _ ->
            { h1 = "Two lists"
            , h2 = "Two independent lists"
            , h3 = "Example with keyed nodes"
            }
