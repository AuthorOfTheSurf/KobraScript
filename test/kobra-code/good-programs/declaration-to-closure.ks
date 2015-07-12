$ closed = close{}:
  $ a = 10
  .. b = 20

  return fn():
    return a + b
  end
end

loge closed()