module OperationsTest exposing (all)

import Expect
import Fuzz
import Operations
import Test


all : Test.Test
all =
    Test.describe "all"
        [ Test.test "empty FIFO contains nothing" <|
            \() ->
                Operations.insertAfter 0 10 []
                    |> Expect.equal []
        ]
