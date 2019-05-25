module Fuzzer exposing (ddlFuzzer, fixedLFuzzer, glFuzzer, ilFuzzer)

import Fuzz
import Random
import Shrink



-- DRAGINDEX, DROPINDEX, LIST


type alias DDL =
    { dragIndex : Int
    , dropIndex : Int
    , list : List Int
    }


ddlGenerator : Random.Generator DDL
ddlGenerator =
    Random.int 1 30
        |> Random.andThen
            (\n ->
                Random.map3 DDL
                    (Random.int 0 (n - 1))
                    (Random.int 0 (n - 1))
                    (Random.list n (Random.int 0 5))
            )


ddlShrinker { dragIndex, dropIndex, list } =
    Shrink.map DDL (Shrink.int dragIndex)
        |> Shrink.andMap (Shrink.int dropIndex)
        |> Shrink.andMap (Shrink.list Shrink.int list)


ddlFuzzer : Fuzz.Fuzzer DDL
ddlFuzzer =
    Fuzz.custom ddlGenerator ddlShrinker



-- INDEX, LIST


type alias IL =
    { index : Int
    , list : List Int
    }


ilGenerator : Random.Generator IL
ilGenerator =
    Random.int 1 30
        |> Random.andThen
            (\n ->
                Random.map2 IL
                    (Random.int 0 (n - 1))
                    (Random.list n (Random.int 0 5))
            )


ilShrinker { index, list } =
    Shrink.map IL (Shrink.int index)
        |> Shrink.andMap (Shrink.list Shrink.int list)


ilFuzzer : Fuzz.Fuzzer IL
ilFuzzer =
    Fuzz.custom ilGenerator ilShrinker



-- GROUP, LIST


type alias GL =
    { group : Int
    , list : List Int
    }


glGenerator : Random.Generator GL
glGenerator =
    Random.int 1 30
        |> Random.andThen
            (\n ->
                Random.map2 GL
                    (Random.int 0 5)
                    (Random.list n (Random.int 0 5))
            )


glShrinker { group, list } =
    Shrink.map GL (Shrink.int group)
        |> Shrink.andMap (Shrink.list Shrink.int list)


glFuzzer : Fuzz.Fuzzer GL
glFuzzer =
    Fuzz.custom glGenerator glShrinker



-- LIST N


fixedLGenerator : Int -> Random.Generator (List Int)
fixedLGenerator n =
    Random.list n (Random.int 0 5)


fixedLShrinker list =
    Shrink.noShrink list


fixedLFuzzer : Int -> Fuzz.Fuzzer (List Int)
fixedLFuzzer n =
    Fuzz.custom (fixedLGenerator n) fixedLShrinker
