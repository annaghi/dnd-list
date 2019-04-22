module DnDList.Utils exposing (equalGroups)


equalGroups : (a -> a -> Bool) -> Int -> Int -> List a -> Bool
equalGroups comparator dragIndex dropIndex list =
    let
        dragItem : List a
        dragItem =
            list |> List.drop dragIndex |> List.take 1

        dropItem : List a
        dropItem =
            list |> List.drop dropIndex |> List.take 1

        result : List Bool
        result =
            List.map2
                (\dragElement dropElement ->
                    comparator dragElement dropElement
                )
                dragItem
                dropItem
    in
    List.foldl (||) False result
