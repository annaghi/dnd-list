module Internal.Common.Operations exposing
    ( insertAfter
    , insertBefore
    , rotate
    , swap
    )


insertAfter : Int -> Int -> List a -> List a
insertAfter dragIndex dropIndex list =
    if dragIndex < dropIndex then
        afterForward dragIndex dropIndex list

    else if dropIndex < dragIndex then
        afterBackward dragIndex dropIndex list

    else
        list


insertBefore : Int -> Int -> List a -> List a
insertBefore dragIndex dropIndex list =
    if dragIndex < dropIndex then
        beforeForward dragIndex dropIndex list

    else if dropIndex < dragIndex then
        beforeBackward dragIndex dropIndex list

    else
        list


rotate : Int -> Int -> List a -> List a
rotate dragIndex dropIndex list =
    if dragIndex < dropIndex then
        afterForward dragIndex dropIndex list

    else if dropIndex < dragIndex then
        beforeBackward dragIndex dropIndex list

    else
        list


swap : Int -> Int -> List a -> List a
swap dragIndex dropIndex list =
    if dragIndex /= dropIndex then
        swapAt dragIndex dropIndex list

    else
        list


afterBackward : Int -> Int -> List a -> List a
afterBackward i j list =
    let
        ( beginning, rest ) =
            splitAt (j + 1) list

        ( middle, end ) =
            splitAt (i - j - 1) rest

        ( head, tail ) =
            splitAt 1 end
    in
    beginning ++ head ++ middle ++ tail


afterForward : Int -> Int -> List a -> List a
afterForward i j list =
    let
        ( beginning, rest ) =
            splitAt i list

        ( middle, end ) =
            splitAt (j - i + 1) rest

        ( head, tail ) =
            splitAt 1 middle
    in
    beginning ++ tail ++ head ++ end


beforeBackward : Int -> Int -> List a -> List a
beforeBackward i j list =
    let
        ( beginning, rest ) =
            splitAt j list

        ( middle, end ) =
            splitAt (i - j) rest

        ( head, tail ) =
            splitAt 1 end
    in
    beginning ++ head ++ middle ++ tail


beforeForward : Int -> Int -> List a -> List a
beforeForward i j list =
    let
        ( beginning, rest ) =
            splitAt i list

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
