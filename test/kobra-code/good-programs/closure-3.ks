$ startingValue = 10

$ incrementer = close{startingValue}:
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

loge incrementer.increment()
loge incrementer.increment()
loge incrementer.increment()
loge incrementer.zero()