module Test.Internal.Common.Operations exposing (suite)

import Expect
import Fuzzer
import Internal.Common.Operations exposing (..)
import Test


otherHalf : ElementHalf -> ElementHalf
otherHalf half =
    case half of
        LeftHalf ->
            RightHalf

        RightHalf ->
            LeftHalf


suite : Test.Test
suite =
    Test.describe "suite"
        [ Test.test "nothing to sort in an empty list" <|
            \() ->
                Expect.all
                    ([ insertAfter 0 0 []
                     , insertBefore 0 0 []
                     , insertAround 0 0 LeftHalf []
                     , insertAround 0 0 RightHalf []
                     , rotate 0 0 []
                     , swap 0 0 []
                     ]
                        |> List.map Expect.equal
                    )
                    []
        , Test.test "nothing to sort in a one-length list" <|
            \() ->
                Expect.all
                    ([ insertAfter 0 0 [ 4 ]
                     , insertBefore 0 0 [ 4 ]
                     , insertAround 0 0 LeftHalf [ 4 ]
                     , insertAround 0 0 RightHalf [ 4 ]
                     , rotate 0 0 [ 4 ]
                     , swap 0 0 [ 4 ]
                     ]
                        |> List.map Expect.equal
                    )
                    [ 4 ]
        , Test.test "operation 0 0 [4, 8]" <|
            \() ->
                [ insertAfter 0 0 [ 4, 8 ]
                , insertBefore 0 0 [ 4, 8 ]
                , insertAround 0 0 LeftHalf [ 4, 8 ]
                , insertAround 0 0 RightHalf [ 4, 8 ]
                , rotate 0 0 [ 4, 8 ]
                , swap 0 0 [ 4, 8 ]
                ]
                    |> Expect.equalLists
                        [ [ 4, 8 ]
                        , [ 4, 8 ]
                        , [ 4, 8 ]
                        , [ 4, 8 ]
                        , [ 4, 8 ]
                        , [ 4, 8 ]
                        ]
        , Test.test "operation 1 1 [4, 8]" <|
            \() ->
                [ insertAfter 1 1 [ 4, 8 ]
                , insertBefore 1 1 [ 4, 8 ]
                , insertAround 1 1 LeftHalf [ 4, 8 ]
                , insertAround 1 1 RightHalf [ 4, 8 ]
                , rotate 1 1 [ 4, 8 ]
                , swap 1 1 [ 4, 8 ]
                ]
                    |> Expect.equalLists
                        [ [ 4, 8 ]
                        , [ 4, 8 ]
                        , [ 4, 8 ]
                        , [ 4, 8 ]
                        , [ 4, 8 ]
                        , [ 4, 8 ]
                        ]
        , Test.test "operation 0 1 [4, 8]" <|
            \() ->
                [ insertAfter 0 1 [ 4, 8 ]
                , insertBefore 0 1 [ 4, 8 ]
                , insertAround 0 1 LeftHalf [ 4, 8 ]
                , insertAround 0 1 RightHalf [ 4, 8 ]
                , rotate 0 1 [ 4, 8 ]
                , swap 0 1 [ 4, 8 ]
                ]
                    |> Expect.equalLists
                        [ [ 8, 4 ]
                        , [ 4, 8 ]
                        , [ 4, 8 ]
                        , [ 8, 4 ]
                        , [ 8, 4 ]
                        , [ 8, 4 ]
                        ]
        , Test.test "operation 1 0 [4, 8]" <|
            \() ->
                [ insertAfter 1 0 [ 4, 8 ]
                , insertBefore 1 0 [ 4, 8 ]
                , insertAround 1 0 LeftHalf [ 4, 8 ]
                , insertAround 1 0 RightHalf [ 4, 8 ]
                , rotate 1 0 [ 4, 8 ]
                , swap 1 0 [ 4, 8 ]
                ]
                    |> Expect.equalLists
                        [ [ 4, 8 ]
                        , [ 8, 4 ]
                        , [ 8, 4 ]
                        , [ 4, 8 ]
                        , [ 8, 4 ]
                        , [ 8, 4 ]
                        ]
        , Test.fuzz Fuzzer.ddlFuzzer "operation == ~operation" <|
            \{ dragIndex, dropIndex, whichHalf, list } ->
                let
                    n : Int
                    n =
                        List.length list - 1

                    theOtherHalf =
                        otherHalf whichHalf
                in
                [ insertAfter dragIndex dropIndex list
                , insertBefore dragIndex dropIndex list
                , insertAround dragIndex dropIndex whichHalf list
                , rotate dragIndex dropIndex list
                , swap dragIndex dropIndex list
                ]
                    |> Expect.equalLists
                        [ (List.reverse >> insertBefore (n - dragIndex) (n - dropIndex) >> List.reverse) list
                        , (List.reverse >> insertAfter (n - dragIndex) (n - dropIndex) >> List.reverse) list
                        , (List.reverse >> insertAround (n - dragIndex) (n - dropIndex) theOtherHalf >> List.reverse) list
                        , (List.reverse >> rotate (n - dragIndex) (n - dropIndex) >> List.reverse) list
                        , swap dropIndex dragIndex list
                        ]
        ]
