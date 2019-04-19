module CustomElement exposing (elmCode, href)

import Html
import Html.Attributes
import Json.Encode


elmCode : List (Html.Attribute msg) -> List (Html.Html msg) -> Html.Html msg
elmCode attrs elems =
    Html.node "elm-code" attrs elems


href : String -> Html.Attribute msg
href url =
    Html.Attributes.property "href" (Json.Encode.string url)
