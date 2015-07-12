$  a = 1
.. b = 2
.. c = 3

$  incr = fn (x):
  return x += 1
..
.. decr = fn (x):
  return x -= 1
..

// purposely un-clean to test parser

$ world = close{}:
  return "hello"
.. .. dir = fn():
  return "~"
end .. soup = fn(): return "good temp" end
.. marching = close{}:
  return "band"
end