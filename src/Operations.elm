module Operations exposing (insertAfter, insertBefore, rotateIn, rotateOut, swap, unaltered)


insertAfter : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
insertAfter beforeUpdate dragIndex dropIndex list =
    if dragIndex < dropIndex then
        afterForward beforeUpdate dragIndex dropIndex list

    else if dragIndex > dropIndex then
        afterBackward beforeUpdate dragIndex dropIndex list

    else
        list


insertBefore : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
insertBefore beforeUpdate dragIndex dropIndex list =
    if dragIndex < dropIndex then
        beforeForward beforeUpdate dragIndex dropIndex list

    else if dragIndex > dropIndex then
        beforeBackward beforeUpdate dragIndex dropIndex list

    else
        list


rotateIn : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
rotateIn beforeUpdate dragIndex dropIndex list =
    if dragIndex < dropIndex then
        beforeForward beforeUpdate dragIndex dropIndex list

    else if dragIndex > dropIndex then
        afterBackward beforeUpdate dragIndex dropIndex list

    else
        list


rotateOut : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
rotateOut beforeUpdate dragIndex dropIndex list =
    if dragIndex < dropIndex then
        afterForward beforeUpdate dragIndex dropIndex list

    else if dragIndex > dropIndex then
        beforeBackward beforeUpdate dragIndex dropIndex list

    else
        list


swap : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
swap beforeUpdate dragIndex dropIndex list =
    if dragIndex /= dropIndex then
        list |> beforeUpdate dragIndex dropIndex |> swapAt dragIndex dropIndex

    else
        list


unaltered : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
unaltered beforeUpdate dragIndex dropIndex list =
    if dragIndex /= dropIndex then
        beforeUpdate dragIndex dropIndex list

    else
        list


afterBackward : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
afterBackward fn i j list =
    let
        ( beginning, rest ) =
            list |> fn i j |> splitAt (j + 1)

        ( middle, end ) =
            splitAt (i - j - 1) rest

        ( head, tail ) =
            splitAt 1 end
    in
    beginning ++ head ++ middle ++ tail


afterForward : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
afterForward fn i j list =
    let
        ( beginning, rest ) =
            list |> fn i j |> splitAt i

        ( middle, end ) =
            splitAt (j - i + 1) rest

        ( head, tail ) =
            splitAt 1 middle
    in
    beginning ++ tail ++ head ++ end


beforeBackward : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
beforeBackward fn i j list =
    let
        ( beginning, rest ) =
            list |> fn i j |> splitAt j

        ( middle, end ) =
            splitAt (i - j) rest

        ( head, tail ) =
            splitAt 1 end
    in
    beginning ++ head ++ middle ++ tail


beforeForward : (Int -> Int -> List a -> List a) -> Int -> Int -> List a -> List a
beforeForward fn i j list =
    let
        ( beginning, rest ) =
            list |> fn i j |> splitAt i

        ( middle, end ) =
            splitAt (j - i) rest

        ( head, tail ) =
            splitAt 1 middle
    in
    beginning ++ tail ++ head ++ end


splitAt : Int -> List a -> ( List a, List a )
splitAt i list =
    ( List.take i list, List.drop i list )


swapAt : Int -> Int -> List a -> List a
swapAt i j list =
    let
        item_i : List a
        item_i =
            list |> List.drop i |> List.take 1

        item_j : List a
        item_j =
            list |> List.drop j |> List.take 1
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == i then
                    item_j

                else if index == j then
                    item_i

                else
                    [ item ]
            )
        |> List.concat
