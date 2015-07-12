$ startingValue = 10

$ incrementer = closure(startingValue):
  $ x = startingValue

  return {
    increment: fn():
      return x += 1
    ..,
    decrement: fn():
      return x -= 1
    ..,
    zero: fn():
      return x = 0
    ..
  }
end

$ incrementer = close ||
  -> return fn()
    -> return x += 1

$ incrementer = close{}:
  return fn():
    return x += 1
  ..
end