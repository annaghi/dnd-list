module Internal.GhostStyles exposing (baseDeclarations, translate)

import Browser.Dom
import Dict
import Html
import Html.Attributes


type Property
    = Width
    | Height
    | Position


type alias Styles msg =
    -- TODO Find a nice and simple way to use Property as key
    Dict.Dict String (List (Html.Attribute msg))


declarations : Browser.Dom.Element -> Styles msg
declarations { element } =
    Dict.fromList
        [ ( "width", [ Html.Attributes.style "width" <| px (round element.width) ] )
        , ( "height", [ Html.Attributes.style "height" <| px (round element.height) ] )
        , ( "position"
          , [ Html.Attributes.style "position" "fixed"
            , Html.Attributes.style "top" "0"
            , Html.Attributes.style "left" "0"
            ]
          )
        ]


baseDeclarations : List String -> Browser.Dom.Element -> List (Html.Attribute msg)
baseDeclarations properties element =
    Html.Attributes.style "pointer-events" "none"
        :: List.foldl (\property acc -> appendDeclarations element property ++ acc) [] properties


appendDeclarations : Browser.Dom.Element -> String -> List (Html.Attribute msg)
appendDeclarations element property =
    declarations element |> Dict.get property |> Maybe.withDefault []


translate : Int -> Int -> String
translate x y =
    "translate3d(" ++ px x ++ ", " ++ px y ++ ", 0)"


px : Int -> String
px n =
    String.fromInt n ++ "px"
