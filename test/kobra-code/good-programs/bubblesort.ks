// to run:
// node kobrac.js bubblesort.ks | node

fn bubbleSort(a):
  $ found = true

  while (found):
    found = false
    for ($ i = 0; i < a["length"] - 1; i++):
      only:
        a[i] :=: a[i+1]
        found = true
      .. if (a[i] > a[i+1])
    end
  end

  return a
end

$ x = [7, 5, 3, 11, 13, 79, 23, 2],
  y = [3, 2, 1, 0, -1, -2, -3],
  z = [21, 1, 4000123, 103422, 300, 1000, 55002]


loge bubbleSort(x)
loge bubbleSort(y)
loge bubbleSort(z)
