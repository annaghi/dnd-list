module OperationsTest exposing (suite)

import Expect
import Fuzz
import Operations
import Random
import Shrink
import Test


suite : Test.Test
suite =
    Test.describe "suite"
        [ Test.test "nowhere to insert after on an empty list" <|
            \() ->
                Operations.insertAfter 5 10 []
                    |> Expect.equal []
        , Test.test "nowhere to insert before on an empty list" <|
            \() ->
                Operations.insertBefore 5 10 []
                    |> Expect.equal []
        , Test.test "nothing to rotate on an empty list" <|
            \() ->
                Operations.rotate 5 10 []
                    |> Expect.equal []
        , Test.test "nothing to swap on an empty list" <|
            \() ->
                Operations.swap 5 10 []
                    |> Expect.equal []
        , Test.fuzz triple "insertAfter == inverse insertBefore" <|
            \{ list, dragIndex, dropIndex } ->
                let
                    n : Int
                    n =
                        List.length list - 1
                in
                Operations.insertAfter dragIndex dropIndex list
                    |> Expect.equal ((List.reverse >> Operations.insertBefore (n - dragIndex) (n - dropIndex) >> List.reverse) list)
        , Test.fuzz triple "insertBefore == inverse insertAfter" <|
            \{ list, dragIndex, dropIndex } ->
                let
                    n : Int
                    n =
                        List.length list - 1
                in
                Operations.insertBefore dragIndex dropIndex list
                    |> Expect.equal ((List.reverse >> Operations.insertAfter (n - dragIndex) (n - dropIndex) >> List.reverse) list)
        , Test.fuzz triple "rotate == inverse rotate" <|
            \{ list, dragIndex, dropIndex } ->
                let
                    n : Int
                    n =
                        List.length list - 1
                in
                Operations.rotate dragIndex dropIndex list
                    |> Expect.equal ((List.reverse >> Operations.rotate (n - dragIndex) (n - dropIndex) >> List.reverse) list)
        , Test.fuzz triple "swap i j == swap j i" <|
            \{ list, dragIndex, dropIndex } ->
                Operations.swap dragIndex dropIndex list
                    |> Expect.equal (Operations.swap dropIndex dragIndex list)
        ]


type alias Triple =
    { list : List Int
    , dragIndex : Int
    , dropIndex : Int
    }


tripleGenerator : Random.Generator Triple
tripleGenerator =
    Random.int 0 30
        |> Random.andThen
            (\n ->
                Random.map3 Triple
                    (Random.list n (Random.int 0 9))
                    (Random.int 0 (n - 1))
                    (Random.int 0 (n - 1))
            )



-- tripleShrinker : Triple -> Lazy.List.LazyList Triple


tripleShrinker { list, dragIndex, dropIndex } =
    Shrink.map Triple (Shrink.noShrink list)
        |> Shrink.andMap (Shrink.int dragIndex)
        |> Shrink.andMap (Shrink.int dropIndex)


triple : Fuzz.Fuzzer Triple
triple =
    Fuzz.custom tripleGenerator tripleShrinker
