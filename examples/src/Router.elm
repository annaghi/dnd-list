module Router exposing (Route(..), route)

import Path
import Url
import Url.Builder
import Url.Parser exposing ((</>))


type Route
    = Home
    | Demo String String
    | NotFound


routes : Url.Parser.Parser (Route -> a) a
routes =
    Url.Parser.oneOf
        [ Url.Parser.map Home Url.Parser.top
        , Url.Parser.map Home (Url.Parser.s Path.rootPath)

        --  Url.Parser.map Demo (Url.Parser.top </> Url.Parser.string </> Url.Parser.string)
        --, Url.Parser.map Demo (Url.Parser.s Path.rootPath </> Url.Parser.string </> Url.Parser.string)
        --, Url.Parser.map Demo (Url.Parser.s Path.rootPath </> Url.Parser.string </> Url.Parser.string)
        , Url.Parser.map Demo (Url.Parser.s Path.rootPath </> Url.Parser.string </> Url.Parser.string)
        ]


route : Url.Url -> Route
route url =
    --if (url.path == "/") || (url.path == "/" ++ Path.rootPath) || (url.path == "/" ++ Path.rootPath ++ "/") then
    --    Demo "introduction" "basic"
    --
    --else
    (Url.Parser.parse routes >> Maybe.withDefault NotFound) url
