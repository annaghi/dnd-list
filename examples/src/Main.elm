module Main exposing (main)

import Advanced.FreeRotateOnDrag
import Advanced.FreeRotateOnDrop
import Advanced.FreeSwapOnDrag
import Advanced.FreeSwapOnDrop
import Basic.Basic
import Basic.BasicElmUI
import Basic.Free
import Basic.Horizontal
import Basic.Vertical
import Basic.WithTwoLists
import Browser
import Browser.Dom
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
    = Basic Basic.Basic.Model
    | BasicElmUI Basic.BasicElmUI.Model
    | Free Basic.Free.Model
    | Horizontal Basic.Horizontal.Model
    | Vertical Basic.Vertical.Model
    | WithTwoLists Basic.WithTwoLists.Model
      -- Advanced
    | FreeRotateOnDrag Advanced.FreeRotateOnDrag.Model
    | FreeRotateOnDrop Advanced.FreeRotateOnDrop.Model
    | FreeSwapOnDrag Advanced.FreeSwapOnDrag.Model
    | FreeSwapOnDrop Advanced.FreeSwapOnDrop.Model


init : () -> ( Model, Cmd Msg )
init _ =
    ( { key = 2
      , example = Free Basic.Free.initialModel
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = NoOp
    | LinkClicked Int Example
    | BasicMsg Basic.Basic.Msg
    | BasicElmUIMsg Basic.BasicElmUI.Msg
    | FreeMsg Basic.Free.Msg
    | HorizontalMsg Basic.Horizontal.Msg
    | VerticalMsg Basic.Vertical.Msg
    | WithTwoListsMsg Basic.WithTwoLists.Msg
      -- Advanced
    | FreeRotateOnDragMsg Advanced.FreeRotateOnDrag.Msg
    | FreeRotateOnDropMsg Advanced.FreeRotateOnDrop.Msg
    | FreeSwapOnDragMsg Advanced.FreeSwapOnDrag.Msg
    | FreeSwapOnDropMsg Advanced.FreeSwapOnDrop.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        NoOp ->
            ( model, Cmd.none )

        LinkClicked key example ->
            ( { model | key = key, example = example }
            , jumpToTop "main"
            )

        BasicMsg msg ->
            case model.example of
                Basic basic ->
                    stepBasic model (Basic.Basic.update msg basic)

                _ ->
                    ( model, Cmd.none )

        BasicElmUIMsg msg ->
            case model.example of
                BasicElmUI basicElmUI ->
                    stepBasicElmUI model (Basic.BasicElmUI.update msg basicElmUI)

                _ ->
                    ( model, Cmd.none )

        FreeMsg msg ->
            case model.example of
                Free free ->
                    stepFree model (Basic.Free.update msg free)

                _ ->
                    ( model, Cmd.none )

        HorizontalMsg msg ->
            case model.example of
                Horizontal horizontal ->
                    stepHorizontal model (Basic.Horizontal.update msg horizontal)

                _ ->
                    ( model, Cmd.none )

        VerticalMsg msg ->
            case model.example of
                Vertical vertical ->
                    stepVertical model (Basic.Vertical.update msg vertical)

                _ ->
                    ( model, Cmd.none )

        WithTwoListsMsg msg ->
            case model.example of
                WithTwoLists withTwoLists ->
                    stepWithTwoLists model (Basic.WithTwoLists.update msg withTwoLists)

                _ ->
                    ( model, Cmd.none )

        -- Advanced
        FreeRotateOnDragMsg msg ->
            case model.example of
                FreeRotateOnDrag freeRotateOnDrag ->
                    stepFreeRotateOnDrag model (Advanced.FreeRotateOnDrag.update msg freeRotateOnDrag)

                _ ->
                    ( model, Cmd.none )

        FreeRotateOnDropMsg msg ->
            case model.example of
                FreeRotateOnDrop freeRotateOnDrop ->
                    stepFreeRotateOnDrop model (Advanced.FreeRotateOnDrop.update msg freeRotateOnDrop)

                _ ->
                    ( model, Cmd.none )

        FreeSwapOnDragMsg msg ->
            case model.example of
                FreeSwapOnDrag freeSwapOnDrag ->
                    stepFreeSwapOnDrag model (Advanced.FreeSwapOnDrag.update msg freeSwapOnDrag)

                _ ->
                    ( model, Cmd.none )

        FreeSwapOnDropMsg msg ->
            case model.example of
                FreeSwapOnDrop freeSwapOnDrop ->
                    stepFreeSwapOnDrop model (Advanced.FreeSwapOnDrop.update msg freeSwapOnDrop)

                _ ->
                    ( model, Cmd.none )


stepBasic : Model -> ( Basic.Basic.Model, Cmd Basic.Basic.Msg ) -> ( Model, Cmd Msg )
stepBasic model ( basic, cmds ) =
    ( { model | example = Basic basic }
    , Cmd.map BasicMsg cmds
    )


stepBasicElmUI : Model -> ( Basic.BasicElmUI.Model, Cmd Basic.BasicElmUI.Msg ) -> ( Model, Cmd Msg )
stepBasicElmUI model ( basicElmUI, cmds ) =
    ( { model | example = BasicElmUI basicElmUI }
    , Cmd.map BasicElmUIMsg cmds
    )


stepFree : Model -> ( Basic.Free.Model, Cmd Basic.Free.Msg ) -> ( Model, Cmd Msg )
stepFree model ( free, cmds ) =
    ( { model | example = Free free }
    , Cmd.map FreeMsg cmds
    )


stepHorizontal : Model -> ( Basic.Horizontal.Model, Cmd Basic.Horizontal.Msg ) -> ( Model, Cmd Msg )
stepHorizontal model ( horizontal, cmds ) =
    ( { model | example = Horizontal horizontal }
    , Cmd.map HorizontalMsg cmds
    )


stepVertical : Model -> ( Basic.Vertical.Model, Cmd Basic.Vertical.Msg ) -> ( Model, Cmd Msg )
stepVertical model ( vertical, cmds ) =
    ( { model | example = Vertical vertical }
    , Cmd.map VerticalMsg cmds
    )


stepWithTwoLists : Model -> ( Basic.WithTwoLists.Model, Cmd Basic.WithTwoLists.Msg ) -> ( Model, Cmd Msg )
stepWithTwoLists model ( withTwoLists, cmds ) =
    ( { model | example = WithTwoLists withTwoLists }
    , Cmd.map WithTwoListsMsg cmds
    )



-- Advanced


stepFreeRotateOnDrag : Model -> ( Advanced.FreeRotateOnDrag.Model, Cmd Advanced.FreeRotateOnDrag.Msg ) -> ( Model, Cmd Msg )
stepFreeRotateOnDrag model ( freeRotateOnDrag, cmds ) =
    ( { model | example = FreeRotateOnDrag freeRotateOnDrag }
    , Cmd.map FreeRotateOnDragMsg cmds
    )


stepFreeRotateOnDrop : Model -> ( Advanced.FreeRotateOnDrop.Model, Cmd Advanced.FreeRotateOnDrop.Msg ) -> ( Model, Cmd Msg )
stepFreeRotateOnDrop model ( freeRotateOnDrop, cmds ) =
    ( { model | example = FreeRotateOnDrop freeRotateOnDrop }
    , Cmd.map FreeRotateOnDropMsg cmds
    )


stepFreeSwapOnDrag : Model -> ( Advanced.FreeSwapOnDrag.Model, Cmd Advanced.FreeSwapOnDrag.Msg ) -> ( Model, Cmd Msg )
stepFreeSwapOnDrag model ( freeSwapOnDrag, cmds ) =
    ( { model | example = FreeSwapOnDrag freeSwapOnDrag }
    , Cmd.map FreeSwapOnDragMsg cmds
    )


stepFreeSwapOnDrop : Model -> ( Advanced.FreeSwapOnDrop.Model, Cmd Advanced.FreeSwapOnDrop.Msg ) -> ( Model, Cmd Msg )
stepFreeSwapOnDrop model ( freeSwapOnDrop, cmds ) =
    ( { model | example = FreeSwapOnDrop freeSwapOnDrop }
    , Cmd.map FreeSwapOnDropMsg cmds
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
            exampleSubscriptions BasicMsg (Basic.Basic.subscriptions basic)

        BasicElmUI basicElmUI ->
            exampleSubscriptions BasicElmUIMsg (Basic.BasicElmUI.subscriptions basicElmUI)

        Free free ->
            exampleSubscriptions FreeMsg (Basic.Free.subscriptions free)

        Horizontal horizontal ->
            exampleSubscriptions HorizontalMsg (Basic.Horizontal.subscriptions horizontal)

        Vertical vertical ->
            exampleSubscriptions VerticalMsg (Basic.Vertical.subscriptions vertical)

        WithTwoLists withTwoLists ->
            exampleSubscriptions WithTwoListsMsg (Basic.WithTwoLists.subscriptions withTwoLists)

        -- Advanced
        FreeRotateOnDrag freeRotateOnDrag ->
            exampleSubscriptions FreeRotateOnDragMsg (Advanced.FreeRotateOnDrag.subscriptions freeRotateOnDrag)

        FreeRotateOnDrop freeRotateOnDrop ->
            exampleSubscriptions FreeRotateOnDropMsg (Advanced.FreeRotateOnDrop.subscriptions freeRotateOnDrop)

        FreeSwapOnDrag freeSwapOnDrag ->
            exampleSubscriptions FreeSwapOnDragMsg (Advanced.FreeSwapOnDrag.subscriptions freeSwapOnDrag)

        FreeSwapOnDrop freeSwapOnDrop ->
            exampleSubscriptions FreeSwapOnDropMsg (Advanced.FreeSwapOnDrop.subscriptions freeSwapOnDrop)


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
                [ Basic Basic.Basic.initialModel
                , BasicElmUI Basic.BasicElmUI.initialModel
                , Free Basic.Free.initialModel
                , Horizontal Basic.Horizontal.initialModel
                , Vertical Basic.Vertical.initialModel
                , WithTwoLists Basic.WithTwoLists.initialModel
                ]
                [ FreeRotateOnDrag Advanced.FreeRotateOnDrag.initialModel
                , FreeRotateOnDrop Advanced.FreeRotateOnDrop.initialModel
                , FreeSwapOnDrag Advanced.FreeSwapOnDrag.initialModel
                , FreeSwapOnDrop Advanced.FreeSwapOnDrop.initialModel
                ]
            ]
        , Html.main_
            [ Html.Attributes.id "main" ]
            (mainView model.example)
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
        , Html.p [] [ Html.text "Drag and Drop for sortable lists in Elm web apps with mouse support" ]
        ]


navigationView : Int -> List Example -> List Example -> Html.Html Msg
navigationView currentKey basic advanced =
    let
        linkView : Int -> Example -> Html.Html Msg
        linkView key example =
            Html.li
                [ Html.Events.onClick (LinkClicked key example)
                , Html.Attributes.classList [ ( "is-active", key == currentKey ) ]
                ]
                [ Html.text ((info >> .title) example) ]
    in
    Html.div []
        [ Html.h2 [] [ Html.text "Basic Examples" ]
        , basic
            |> List.indexedMap linkView
            |> Html.ul []
        , Html.h2 [] [ Html.text "Advanced Examples" ]
        , advanced
            |> List.indexedMap (\i -> linkView (i + List.length basic))
            |> Html.ul []
        ]


mainView : Example -> List (Html.Html Msg)
mainView example =
    let
        subtitle : String
        subtitle =
            (info >> .subtitle) example

        description : String
        description =
            (info >> .description) example
    in
    case example of
        Basic basic ->
            [ demoView subtitle description BasicMsg (Basic.Basic.view basic)
            , sourceView Basic.Basic.source
            ]

        BasicElmUI basicElmUI ->
            [ demoView subtitle description BasicElmUIMsg (Basic.BasicElmUI.view basicElmUI)
            , sourceView Basic.BasicElmUI.source
            ]

        Free free ->
            [ demoView subtitle description FreeMsg (Basic.Free.view free)
            , sourceView Basic.Free.source
            ]

        Horizontal horizontal ->
            [ demoView subtitle description HorizontalMsg (Basic.Horizontal.view horizontal)
            , sourceView Basic.Horizontal.source
            ]

        Vertical vertical ->
            [ demoView subtitle description VerticalMsg (Basic.Vertical.view vertical)
            , sourceView Basic.Vertical.source
            ]

        WithTwoLists withTwoLists ->
            [ demoView subtitle description WithTwoListsMsg (Basic.WithTwoLists.view withTwoLists)
            , sourceView Basic.WithTwoLists.source
            ]

        -- Advanced
        FreeRotateOnDrag freeRotateOnDrag ->
            [ demoView subtitle description FreeRotateOnDragMsg (Advanced.FreeRotateOnDrag.view freeRotateOnDrag)
            , sourceView Advanced.FreeRotateOnDrag.source
            ]

        FreeRotateOnDrop freeRotateOnDrop ->
            [ demoView subtitle description FreeRotateOnDropMsg (Advanced.FreeRotateOnDrop.view freeRotateOnDrop)
            , sourceView Advanced.FreeRotateOnDrop.source
            ]

        FreeSwapOnDrag freeSwapOnDrag ->
            [ demoView subtitle description FreeSwapOnDragMsg (Advanced.FreeSwapOnDrag.view freeSwapOnDrag)
            , sourceView Advanced.FreeSwapOnDrag.source
            ]

        FreeSwapOnDrop freeSwapOnDrop ->
            [ demoView subtitle description FreeSwapOnDropMsg (Advanced.FreeSwapOnDrop.view freeSwapOnDrop)
            , sourceView Advanced.FreeSwapOnDrop.source
            ]


demoView : String -> String -> (a -> msg) -> Html.Html a -> Html.Html msg
demoView subtitle description toMsg demo =
    Html.div
        [ Html.Attributes.class "elm-demo" ]
        [ Html.h2 [] [ Html.text subtitle ]
        , Html.p [] [ Html.text description ]
        , Html.map toMsg demo
        ]


sourceView : String -> Html.Html msg
sourceView source =
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



-- EXAMPLE INFO


type alias Info =
    { title : String
    , subtitle : String
    , description : String
    }


info : Example -> Info
info example =
    case example of
        Basic _ ->
            { title = "Basic"
            , subtitle = "Basic example"
            , description = "Sortable list"
            }

        BasicElmUI _ ->
            { title = "Basic + Elm UI"
            , subtitle = "Basic example"
            , description = "Designed with mdgriffith/elm-ui"
            }

        Free _ ->
            { title = "Free"
            , subtitle = "Free drag movement"
            , description = "Example with keyed nodes"
            }

        Horizontal _ ->
            { title = "Horizontal"
            , subtitle = "Horizontal drag only"
            , description = "Example with keyed nodes"
            }

        Vertical _ ->
            { title = "Vertical"
            , subtitle = "Vertical drag only"
            , description = "Example with keyed nodes"
            }

        WithTwoLists _ ->
            { title = "Two lists"
            , subtitle = "Two independent lists"
            , description = "Without thinking: duplicate everything"
            }

        -- Advanced
        FreeRotateOnDrag _ ->
            { title = "Free Rotate OnDrag"
            , subtitle = "Free drag movement - Rotate OnDrag"
            , description = "The items between the dragged and the drop target elements are rotated, and the list is updated each time when dragging over a drop target."
            }

        FreeRotateOnDrop _ ->
            { title = "Free Rotate OnDrop"
            , subtitle = "Free drag movement - Rotate OnDrop"
            , description = "The items between the dragged and the drop target elements are rotated, and the list is updated only once when the dragged item was dropped on the drop target."
            }

        FreeSwapOnDrag _ ->
            { title = "Free Swap OnDrag"
            , subtitle = "Free drag movement - Swap OnDrag"
            , description = "The dragged and the drop target elements are swapped, and the list is updated each time when dragging over a drop target."
            }

        FreeSwapOnDrop _ ->
            { title = "Free Swap OnDrop"
            , subtitle = "Free drag movement - Swap OnDrop"
            , description = "The dragged and the drop target elements are swapped, and the list is updated only once when the dragged item was dropped on the drop target."
            }
