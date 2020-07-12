module Views exposing (..)

import Html
import Html.Attributes
import Html.Events
import Icons
import Path
import Url.Builder
import WeakCss


type alias Metadata example =
    { segment : String
    , title : String
    , description : String
    , link : String
    , initialModel : example
    }


type alias BlockMetadata =
    { title : String
    , slug : String
    , allTags : List { segment : String, title : String }
    }


type alias Info =
    { slug : String
    , title : String
    , description : String
    , link : String
    }


type alias SubInfo msg =
    { title : String
    , subView : Html.Html msg
    , link : String
    }


type alias MenuMeta example =
    { title : String
    , slug : String
    , info : example -> Info
    , initialModels : List example
    }


moduleClass : WeakCss.ClassName
moduleClass =
    WeakCss.namespace "dnd"


bodyView : msg -> Bool -> Html.Html msg -> List (Html.Html msg)
bodyView showMenu isHome mainContent =
    [ navView showMenu isHome
    , mainContent
    , footerView
    ]


navView : msg -> Bool -> Html.Html msg
navView showMenu isHome =
    Html.nav
        [ moduleClass |> WeakCss.add "nav" |> WeakCss.withStates [ ( "home", isHome ) ] ]
        [ Html.a
            [ moduleClass |> WeakCss.nestMany [ "nav", "brand" ]
            , Html.Attributes.href (Url.Builder.absolute [ Path.rootPath ] [])
            ]
            [ Html.text "annaghi/dnd-list" ]
        , Html.a
            [ moduleClass |> WeakCss.addMany [ "nav", "icon" ] |> WeakCss.withStates [ ( "github", True ) ]
            , Html.Attributes.href "https://github.com/annaghi/dnd-list"
            ]
            [ Icons.githubLogo ]
        , Html.a
            [ moduleClass |> WeakCss.addMany [ "nav", "icon" ] |> WeakCss.withStates [ ( "docs", True ) ]
            , Html.Attributes.href "https://package.elm-lang.org/packages/annaghi/dnd-list/latest"
            ]
            [ Icons.elmLogo ]
        , Html.div
            [ moduleClass |> WeakCss.addMany [ "nav", "icon" ] |> WeakCss.withStates [ ( "menu", True ) ]
            , Html.Events.onClick showMenu
            ]
            -- TODO Draw a better icon with top padding
            [ Icons.hamburger ]
        ]


footerView : Html.Html msg
footerView =
    Html.footer
        [ moduleClass |> WeakCss.nest "footer" ]
        [ Html.text "© 2019 - 2020 Anna Bansaghi" ]



-- <main> CONTENT


homeView : List (Html.Html msg) -> Html.Html msg
homeView chapters =
    Html.main_
        [ moduleClass |> WeakCss.nest "home" ]
        [ Html.section
            [ moduleClass |> WeakCss.nestMany [ "home", "intro" ] ]
            [ Html.h1
                [ moduleClass |> WeakCss.nestMany [ "home", "intro", "name" ] ]
                [ Html.text "elm dnd-list" ]
            , Html.div
                [ moduleClass |> WeakCss.nestMany [ "home", "intro", "description" ] ]
                [ Html.text "Drag and Drop for sortable lists in "
                , Html.a [ Html.Attributes.target "_blank" ] [ Html.text "elm" ]
                , Html.text " with mouse support"
                ]
            ]
        , Html.section
            [ moduleClass |> WeakCss.nestMany [ "home", "chapters" ] ]
            chapters
        ]



-- LEVEL 2 NAVIGATION


chapterView : String -> BlockMetadata -> Html.Html msg
chapterView class { title, slug, allTags } =
    Html.div
        [ moduleClass |> WeakCss.nestMany [ class, "chapters", "chapter" ] ]
        [ Html.h2
            [ moduleClass |> WeakCss.nestMany [ class, "chapters", "chapter", "title" ] ]
            [ Html.text title ]
        , allTags
            |> List.map (linkView class slug)
            |> Html.nav [ moduleClass |> WeakCss.nestMany [ class, "chapters", "chapter", "nav" ] ]
        ]


linkView : String -> String -> { segment : String, title : String } -> Html.Html msg
linkView class slug { segment, title } =
    let
        path : String
        path =
            Url.Builder.absolute [ Path.rootPath, slug, segment ] []
    in
    Html.a
        [ moduleClass |> WeakCss.nestMany [ class, "chapters", "chapter", "nav", "link" ]
        , Html.Attributes.href path
        ]
        [ Html.text title ]



-- DEMO


demoHeaderView : { title : String, description : String, link : String } -> Html.Html msg
demoHeaderView { title, description, link } =
    Html.div
        [ moduleClass |> WeakCss.nestMany [ "demo", "content", "intro" ] ]
        [ Html.div
            [ moduleClass |> WeakCss.nestMany [ "demo", "content", "intro", "title" ] ]
            [ Html.h1
                [ moduleClass |> WeakCss.nestMany [ "demo", "content", "intro", "title", "text" ] ]
                [ Html.text title ]
            , Html.a
                [ moduleClass |> WeakCss.nestMany [ "demo", "content", "intro", "title", "link" ]
                , Html.Attributes.href link
                , Html.Attributes.target "_blank"
                ]
                [ Html.span
                    [ moduleClass |> WeakCss.nestMany [ "demo", "content", "intro", "title", "link", "label" ] ]
                    [ Html.text "Get the code" ]
                , Html.span
                    [ moduleClass |> WeakCss.nestMany [ "demo", "content", "intro", "title", "link", "icon" ] ]
                    [ Icons.externalLink ]
                ]
            ]
        , Html.div
            [ moduleClass |> WeakCss.nestMany [ "demo", "content", "intro", "description" ] ]
            [ Html.text description ]
        ]


examplesView : (Int -> msg) -> (example -> SubInfo msg) -> Int -> List example -> Html.Html msg
examplesView linkClicked info currentId examples =
    examples
        |> List.indexedMap (exampleView linkClicked info currentId)
        |> Html.ul [ moduleClass |> WeakCss.nestMany [ "demo", "examples" ] ]


exampleView : (Int -> msg) -> (example -> SubInfo msg) -> Int -> Int -> example -> Html.Html msg
exampleView linkClicked info currentId id example =
    Html.li
        [ moduleClass |> WeakCss.nestMany [ "demo", "examples", "item" ] ]
        [ Html.h2
            [ moduleClass
                |> WeakCss.addMany [ "demo", "examples", "item", "title" ]
                |> WeakCss.withStates [ ( "link", True ), ( "is-active", id == currentId ) ]
            , Html.Events.onClick (linkClicked id)
            ]
            [ Html.text (info example |> .title) ]
        , info example |> .subView
        ]
