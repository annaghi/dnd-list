module Test.Internal.Groups exposing (suite)

import Expect
import Fuzz
import Fuzzer
import Internal.Groups exposing (..)
import Test


suite : Test.Test
suite =
    Test.describe "suite"
        [ Test.describe "group updates: dragGroupUpdate, dragAndDropGroupUpdate"
            [ Test.test "nothing to update here" <|
                \() ->
                    [ dragGroupUpdate setter 0 0 []
                    , dragAndDropGroupUpdate setter 0 0 []
                    , dragGroupUpdate setter 0 0 [ 4 ]
                    , dragAndDropGroupUpdate setter 0 0 [ 4 ]
                    , dragGroupUpdate setter 0 0 [ 4, 8 ]
                    , dragAndDropGroupUpdate setter 0 0 [ 4, 8 ]
                    , dragGroupUpdate setter 1 1 [ 4, 8 ]
                    , dragAndDropGroupUpdate setter 1 1 [ 4, 8 ]
                    ]
                        |> Expect.equalLists
                            [ []
                            , []
                            , [ 4 ]
                            , [ 4 ]
                            , [ 4, 8 ]
                            , [ 4, 8 ]
                            , [ 4, 8 ]
                            , [ 4, 8 ]
                            ]
            , Test.test "update 0 1 [4, 8]" <|
                \() ->
                    [ dragGroupUpdate setter 0 1 [ 4, 8 ]
                    , dragAndDropGroupUpdate setter 0 1 [ 4, 8 ]
                    ]
                        |> Expect.equalLists
                            [ [ 8, 8 ]
                            , [ 8, 4 ]
                            ]
            , Test.test "update 1 0 [4, 8]" <|
                \() ->
                    [ dragGroupUpdate setter 1 0 [ 4, 8 ]
                    , dragAndDropGroupUpdate setter 1 0 [ 4, 8 ]
                    ]
                        |> Expect.equalLists
                            [ [ 4, 4 ]
                            , [ 8, 4 ]
                            ]
            , Test.fuzz Fuzzer.ddlFuzzer "update == ~update" <|
                \{ dragIndex, dropIndex, list } ->
                    let
                        n : Int
                        n =
                            List.length list - 1
                    in
                    [ dragGroupUpdate setter dragIndex dropIndex list
                    , dragAndDropGroupUpdate setter dragIndex dropIndex list
                    ]
                        |> Expect.equalLists
                            [ (List.reverse >> dragGroupUpdate setter (n - dragIndex) (n - dropIndex) >> List.reverse) list
                            , dragAndDropGroupUpdate setter dropIndex dragIndex list
                            ]
            ]
        , Test.describe "lowerBound, upperBound"
            [ Test.test "0 [] and 0 [ 4 ]" <|
                \() ->
                    Expect.all
                        ([ lowerBound comparator 0 []
                         , upperBound comparator 0 []
                         , lowerBound comparator 0 [ 4 ]
                         , upperBound comparator 0 [ 4 ]
                         ]
                            |> List.map Expect.equal
                        )
                        0
            , Test.test "i [ 4, 4, 4 ]" <|
                \() ->
                    [ lowerBound comparator 0 [ 4, 4, 4 ]
                    , lowerBound comparator 1 [ 4, 4, 4 ]
                    , lowerBound comparator 2 [ 4, 4, 4 ]
                    , upperBound comparator 0 [ 4, 4, 4 ]
                    , upperBound comparator 1 [ 4, 4, 4 ]
                    , upperBound comparator 2 [ 4, 4, 4 ]
                    ]
                        |> Expect.equalLists
                            [ 0
                            , 0
                            , 0
                            , 2
                            , 2
                            , 2
                            ]
            , Test.fuzz Fuzzer.ilFuzzer "lowerBound == n - upperBound" <|
                \{ index, list } ->
                    let
                        n : Int
                        n =
                            List.length list - 1
                    in
                    [ lowerBound comparator index (list |> List.sort)
                    , upperBound comparator index (list |> List.sort)
                    ]
                        |> Expect.equalLists
                            [ n - upperBound comparator (n - index) (list |> List.sort |> List.reverse)
                            , n - lowerBound comparator (n - index) (list |> List.sort |> List.reverse)
                            ]
            ]
        , Test.describe "equalGroups"
            [ Test.test "i j []" <|
                \() ->
                    Expect.all
                        ([ equalGroups comparator 0 0 []
                         , equalGroups comparator 0 1 []
                         , equalGroups comparator 1 0 []
                         , equalGroups comparator 1 1 []
                         ]
                            |> List.map Expect.equal
                        )
                        False
            , Test.test "i i [ 4 ]" <|
                \() ->
                    Expect.all
                        ([ equalGroups comparator 0 0 [ 4 ] ]
                            |> List.map Expect.equal
                        )
                        True
            , Test.test "i j [ 4, 4 ]" <|
                \() ->
                    Expect.all
                        ([ equalGroups comparator 0 0 [ 4, 4 ]
                         , equalGroups comparator 0 1 [ 4, 4 ]
                         , equalGroups comparator 1 0 [ 4, 4 ]
                         , equalGroups comparator 1 1 [ 4, 4 ]
                         ]
                            |> List.map Expect.equal
                        )
                        True
            , Test.test "i j [ 4, 8 ]" <|
                \() ->
                    [ equalGroups comparator 0 0 [ 4, 8 ]
                    , equalGroups comparator 0 1 [ 4, 8 ]
                    , equalGroups comparator 1 0 [ 4, 8 ]
                    , equalGroups comparator 1 1 [ 4, 8 ]
                    ]
                        |> Expect.equalLists
                            [ True
                            , False
                            , False
                            , True
                            ]
            , Test.fuzz Fuzzer.ddlFuzzer "equalGroups i j == equalGroups j i" <|
                \{ dragIndex, dropIndex, list } ->
                    Expect.equal
                        (equalGroups comparator dragIndex dropIndex list)
                        (equalGroups comparator dropIndex dragIndex list)
            ]
        , Test.describe "bubbleGroupRecursive"
            [ Test.test "hard to make fuzz tests" <|
                \() ->
                    [ bubbleGroupRecursive comparator setter []
                    , bubbleGroupRecursive comparator setter [ 4 ]
                    , bubbleGroupRecursive comparator setter [ 4, 8 ]
                    , bubbleGroupRecursive comparator setter [ 4, 8, 11 ]
                    , bubbleGroupRecursive comparator setter [ 4, 4, 8 ]
                    , bubbleGroupRecursive comparator setter [ 4, 8, 8 ]
                    ]
                        |> Expect.equalLists
                            [ []
                            , [ 4 ]
                            , [ 8, 4 ]
                            , [ 8, 11, 4 ]
                            , [ 4, 8, 4 ]
                            , [ 8, 8, 4 ]
                            ]
            ]
        , Test.describe "group updates: allGroupUpdate"
            [ Test.test "hard to make fuzz tests" <|
                \() ->
                    [ allGroupUpdate (bubbleGroupRecursive comparator setter) 0 0 []
                    , allGroupUpdate (bubbleGroupRecursive comparator setter) 0 0 [ 4 ]
                    , allGroupUpdate (bubbleGroupRecursive comparator setter) 0 0 [ 4, 8 ]
                    , allGroupUpdate (bubbleGroupRecursive comparator setter) 0 1 [ 4, 8 ]
                    , allGroupUpdate (bubbleGroupRecursive comparator setter) 1 0 [ 4, 8 ]
                    , allGroupUpdate (bubbleGroupRecursive comparator setter) 1 1 [ 4, 8 ]
                    ]
                        |> Expect.equalLists
                            [ []
                            , [ 4 ]
                            , [ 4, 8 ]
                            , [ 8, 4 ]
                            , [ 4, 8 ]
                            , [ 4, 8 ]
                            ]
            ]
        ]


setter : a -> a -> a
setter e1 e2 =
    e1


comparator : a -> a -> Bool
comparator =
    (==)
