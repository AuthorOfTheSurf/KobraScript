$ fullness = "",
  optimistic = false

only:
  fullness = "half-full"
.. if (optimistic) else:
  fullness = "twice a large as it needs to be"
end

say "the glass is " + fullness

