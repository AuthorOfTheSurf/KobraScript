close{}:
  for ($ i = 0; i < 1000; i++):
    say i

    only:
      leave .. if (i >= 10)
  ..
end