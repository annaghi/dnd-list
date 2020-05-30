module Views exposing (..)

import Html
import Html.Attributes
import Html.Events
import Icons
import Path
import Url.Builder
import WeakCss


type alias Info =
    { slug : String
    , title : String
    , description : String
    }


type alias SubInfo msg =
    { title : String
    , subView : Html.Html msg
    }


moduleClass : WeakCss.ClassName
moduleClass =
    WeakCss.namespace "dnd"



-- Main2


headerView : Html.Html msg
headerView =
    Html.div
        [ moduleClass |> WeakCss.nest "header" ]
        [ Html.div
            [ moduleClass |> WeakCss.nestMany [ "header", "shell" ] ]
            [ Html.div
                [ moduleClass |> WeakCss.nestMany [ "header", "shell", "brand" ] ]
                [ Html.a
                    [ moduleClass |> WeakCss.nestMany [ "header", "shell", "brand", "link" ]
                    , Html.Attributes.href (Url.Builder.absolute [ Path.rootPath ] [])
                    ]
                    [ Html.text "dnd-list" ]
                ]
            , Html.div
                [ moduleClass |> WeakCss.addMany [ "header", "shell", "icon" ] |> WeakCss.withStates [ ( "github", True ) ] ]
                [ Html.a
                    [ moduleClass |> WeakCss.nestMany [ "header", "shell", "icon", "link" ]
                    , Html.Attributes.href "https://github.com/annaghi/dnd-list"
                    ]
                    [ Icons.githubLogo 22 ]
                ]
            , Html.div
                [ moduleClass |> WeakCss.addMany [ "header", "shell", "icon" ] |> WeakCss.withStates [ ( "docs", True ) ] ]
                [ Html.a
                    [ moduleClass |> WeakCss.nestMany [ "header", "shell", "icon", "link" ]
                    , Html.Attributes.href "https://package.elm-lang.org/packages/annaghi/dnd-list/latest"
                    ]
                    [ Icons.elmLogo 22 ]
                ]
            , Html.div
                [ moduleClass |> WeakCss.addMany [ "header", "shell", "icon" ] |> WeakCss.withStates [ ( "menu", True ) ]

                -- , Html.Events.onClick OpenedMenu
                ]
                [ Html.div
                    [ moduleClass |> WeakCss.nestMany [ "header", "shell", "icon", "link" ] ]
                    [ Icons.hamburger 21 ]
                ]
            ]
        ]


footerView : Html.Html msg
footerView =
    Html.div
        [ moduleClass |> WeakCss.nest "footer" ]
        [ Html.div
            [ moduleClass |> WeakCss.nestMany [ "footer", "author" ] ]
            [ Html.text "© 2019 - 2020 Anna Bansaghi Site source" ]
        ]


homeView : Html.Html msg
homeView =
    Html.div
        [ moduleClass |> WeakCss.nestMany [ "content", "main" ] ]
        [ Html.div
            [ moduleClass |> WeakCss.nestMany [ "content", "main", "name" ] ]
            [ Html.text "elm dnd-list" ]
        , Html.div
            [ moduleClass |> WeakCss.nestMany [ "content", "main", "description" ] ]
            [ Html.text "Drag and Drop for sortable lists in "
            , Html.a [ Html.Attributes.target "_blank" ] [ Html.text "elm" ]
            , Html.text " with mouse support"
            ]
        ]


navigationView : String -> String -> (example -> Info) -> List example -> Html.Html msg
navigationView title slug info initialModels =
    Html.div
        [ moduleClass |> WeakCss.nestMany [ "content", "nav", "section" ] ]
        [ Html.div
            [ moduleClass |> WeakCss.nestMany [ "content", "nav", "section", "title" ] ]
            [ Html.text title ]
        , initialModels
            |> List.map (linkView slug info)
            |> Html.ul [ moduleClass |> WeakCss.nestMany [ "content", "nav", "section", "links" ] ]
        ]


linkView : String -> (example -> Info) -> example -> Html.Html msg
linkView slug info example =
    let
        path : String
        path =
            Url.Builder.absolute [ Path.rootPath, slug, info example |> .slug ] []
    in
    Html.li
        [ moduleClass |> WeakCss.nestMany [ "sidebar", "nav", "section", "links", "item" ] ]
        [ Html.a
            [ moduleClass
                |> WeakCss.addMany [ "sidebar", "nav", "section", "links", "item", "url" ]
                |> WeakCss.withStates [ ( "is-active", path == slug ) ]
            , Html.Attributes.href path
            ]
            [ Html.text (info example |> .title) ]
        ]


demoHeaderView : (example -> Info) -> example -> Html.Html msg
demoHeaderView info example =
    let
        title : String
        title =
            info example |> .title

        description : String
        description =
            info example |> .description
    in
    Html.div
        [ moduleClass |> WeakCss.nestMany [ "main", "header" ] ]
        [ Html.div
            [ moduleClass |> WeakCss.nestMany [ "main", "header", "title" ] ]
            [ Html.text title ]
        , Html.div
            [ moduleClass |> WeakCss.nestMany [ "main", "header", "description" ] ]
            [ Html.text description ]
        ]


examplesView : (Int -> msg) -> (example -> SubInfo msg) -> Int -> List example -> Html.Html msg
examplesView linkClicked info currentId examples =
    examples
        |> List.indexedMap (exampleView linkClicked info currentId)
        |> Html.ul [ moduleClass |> WeakCss.nestMany [ "main", "examples" ] ]


exampleView : (Int -> msg) -> (example -> SubInfo msg) -> Int -> Int -> example -> Html.Html msg
exampleView linkClicked info currentId id example =
    Html.li
        [ moduleClass |> WeakCss.nestMany [ "main", "examples", "item" ] ]
        [ info example |> .subView
        , Html.div
            [ moduleClass
                |> WeakCss.addMany [ "main", "examples", "item", "link" ]
                |> WeakCss.withStates [ ( "link", True ), ( "is-active", id == currentId ) ]
            , Html.Events.onClick (linkClicked id)
            ]
            [ Html.text (info example |> .title) ]
        ]
