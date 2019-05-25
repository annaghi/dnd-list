module Internal.Groups exposing
    ( allGroupUpdate
    , bubbleGroupRecursive
    , dragAndDropGroupUpdate
    , dragGroupUpdate
    , equalGroups
    , lowerBound
    , upperBound
    )


equalGroups : (a -> a -> Bool) -> Int -> Int -> List a -> Bool
equalGroups comparator dragIndex dropIndex list =
    List.map2
        (\dragItem dropItem ->
            comparator dragItem dropItem
        )
        (drags dragIndex list)
        (drops dropIndex list)
        |> List.foldl (||) False


dragGroupUpdate : (a -> a -> a) -> Int -> Int -> List a -> List a
dragGroupUpdate setter dragIndex dropIndex list =
    let
        dropItem : List a
        dropItem =
            drops dropIndex list
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == dragIndex then
                    List.map2 setter dropItem [ item ]

                else
                    [ item ]
            )
        |> List.concat


dragAndDropGroupUpdate : (a -> a -> a) -> Int -> Int -> List a -> List a
dragAndDropGroupUpdate setter dragIndex dropIndex list =
    let
        dragItem : List a
        dragItem =
            drags dragIndex list

        dropItem : List a
        dropItem =
            drops dropIndex list
    in
    list
        |> List.indexedMap
            (\index item ->
                if index == dragIndex then
                    List.map2 setter dropItem [ item ]

                else if index == dropIndex then
                    List.map2 setter dragItem [ item ]

                else
                    [ item ]
            )
        |> List.concat


allGroupUpdate : (List a -> List a) -> Int -> Int -> List a -> List a
allGroupUpdate fn i j l =
    let
        beginning : List a
        beginning =
            List.take i l

        middle : List a
        middle =
            l
                |> List.drop i
                |> List.take (j - i + 1)

        end : List a
        end =
            List.drop (j + 1) l
    in
    beginning ++ fn middle ++ end


bubbleGroupRecursive : (a -> a -> Bool) -> (a -> a -> a) -> List a -> List a
bubbleGroupRecursive comparator setter list =
    case list of
        [] ->
            []

        [ x ] ->
            [ x ]

        x :: xs ->
            let
                sublist : List a
                sublist =
                    sublistByFirstItem comparator list
            in
            if sublist /= [] then
                (sublist |> List.drop 1 |> List.reverse)
                    ++ List.map2 (\prev next -> setter next prev)
                        (List.take 1 sublist)
                        (xs |> List.drop (List.length sublist - 1) |> List.take 1)
                    ++ bubbleGroupRecursive
                        comparator
                        setter
                        (List.map2 (\prev next -> setter prev next)
                            (List.take 1 sublist)
                            (xs |> List.drop (List.length sublist - 1) |> List.take 1)
                            ++ List.drop (List.length sublist) xs
                        )

            else
                x :: xs


lowerBound : (a -> a -> Bool) -> Int -> List a -> Int
lowerBound comparator dropIndex list =
    let
        lowerBoundRecursive : Int -> List a -> Int
        lowerBoundRecursive i l =
            case l of
                [] ->
                    dropIndex

                x :: xs ->
                    if
                        List.map2
                            (\item dropItem -> comparator item dropItem)
                            [ x ]
                            (drops dropIndex list)
                            |> List.foldl (||) False
                    then
                        i

                    else
                        lowerBoundRecursive (i + 1) xs
    in
    lowerBoundRecursive 0 list


upperBound : (a -> a -> Bool) -> Int -> List a -> Int
upperBound comparator dropIndex list =
    let
        n : Int
        n =
            List.length list - 1
    in
    list |> List.reverse |> lowerBound comparator (n - dropIndex) |> (\i -> n - i)


drags : Int -> List a -> List a
drags dragIndex list =
    list |> List.drop dragIndex |> List.take 1


drops : Int -> List a -> List a
drops dropIndex list =
    list |> List.drop dropIndex |> List.take 1


sublistByFirstItem : (a -> a -> Bool) -> List a -> List a
sublistByFirstItem comparator list =
    case list of
        [] ->
            []

        x :: _ ->
            List.filter (\item -> comparator x item) list
