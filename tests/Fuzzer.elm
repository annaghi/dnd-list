module Fuzzer exposing (ddlFuzzer, fixedLFuzzer, glFuzzer, ilFuzzer)

import Fuzz
import Internal.Common.Operations
import Random
import Shrink



-- DRAGINDEX, DROPINDEX, LIST


type alias DDL =
    { dragIndex : Int
    , dropIndex : Int
    , list : List Int
    , whichHalf : Internal.Common.Operations.ElementHalf
    }


ddlGenerator : Random.Generator DDL
ddlGenerator =
    Random.int 1 30
        |> Random.andThen
            (\n ->
                Random.map4 DDL
                    (Random.int 0 (n - 1))
                    (Random.int 0 (n - 1))
                    (Random.list n (Random.int 0 5))
                    (Random.uniform
                        Internal.Common.Operations.LeftHalf
                        [ Internal.Common.Operations.RightHalf ]
                    )
            )


ddlShrinker { dragIndex, dropIndex, list, whichHalf } =
    Shrink.map DDL (Shrink.int dragIndex)
        |> Shrink.andMap (Shrink.int dropIndex)
        |> Shrink.andMap (Shrink.list Shrink.int list)
        |> Shrink.andMap (elementHalfShrinker whichHalf)


elementHalfShrinker : Shrink.Shrinker Internal.Common.Operations.ElementHalf
elementHalfShrinker =
    Shrink.convert
        elementHalfFromBool
        elementHalfToBool
        Shrink.bool


elementHalfToBool : Internal.Common.Operations.ElementHalf -> Bool
elementHalfToBool half =
    case half of
        Internal.Common.Operations.LeftHalf ->
            False

        Internal.Common.Operations.RightHalf ->
            True


elementHalfFromBool : Bool -> Internal.Common.Operations.ElementHalf
elementHalfFromBool bool =
    case bool of
        False ->
            Internal.Common.Operations.LeftHalf

        True ->
            Internal.Common.Operations.RightHalf


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
