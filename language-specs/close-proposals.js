$ startingValue = 10

$ incrementer = closure:
  $ x = included startingValue

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

|this| -> fnWithSideEffects(this)
