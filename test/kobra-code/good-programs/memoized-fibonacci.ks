$ fibonacci = close{}:
  $ cache = {
    0: 0,
    1: 1
  }

  fn fib(n):
    $ value
    .. cacheValue = cache[n]

    if (cacheValue != undefined):
      value = cacheValue
    .. else:
      value = fib(n - 1) + fib(n - 2)
      cache[n] = value
    end
    return value
  end

  return fib
end

