module Home exposing (view)

import DnDList.Groups.Parent
import DnDList.Single.Parent
import Html
import Views


view : Html.Html msg
view =
    Views.homeView
        [ DnDList.Single.Parent.chapterView "home"
        , DnDList.Groups.Parent.chapterView "home"
        ]
