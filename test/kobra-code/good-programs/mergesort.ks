// to run:
// node kobrac.js mergesort.ks | node

fn merge(left, right):
  $ i = 0,
    merged = []

  while (left["length"] && right["length"]):
    if (left[0] < right[0]):
      merged[i] = left["shift"]()
    .. else:
      merged[i] = right["shift"]()
    end
    i++
  end

  while (left["length"]) -> merged[i++] = left["shift"]()
  while (right["length"]) -> merged[i++] = right["shift"]()

  return merged

end

fn mergeSort(a):
  only:
  	return a .. if (a["length"] <= 1)

  $ middle = a["length"] / 2,
    left = a["slice"](0, middle),
    right = a["slice"](middle, a["length"])

  left = mergeSort(left)
  right = mergeSort(right)

  return merge(left, right)

end



$ x = [7, 5, 3, 11, 13, 79, 23, 2],
  y = [3, 2, 1],
  z = [21, 1, 4000123, 103422, 300, 1000, 55002]

loge mergeSort(x)
loge mergeSort(y)
loge mergeSort(z)
