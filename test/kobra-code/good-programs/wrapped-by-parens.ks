// An error will be thrown by this program if one of these
// entities incorrectly disallows being wrapped by parens

$ a = ([1,2,3])
$ b = (2 * 3)
$ c = (true)

$ x = {
  go: fn():
    return "run!"
  end
}

$ d = (x.go())
$ e = (x.go)
$ f = (x["go"])

$ y = {}

$ g = (x :=: y)
$ h = (y)
$ i = (null)
$ j = (12)
$ k = ({})

$ z = 0

$ l = (z++)
$ m = ("hello")
$ n = (++z)
$ o = (undefined)
