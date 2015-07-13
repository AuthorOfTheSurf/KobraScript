$ x = [1, 2, 3]

close{x}:
  for ($i = 0; i < x["length"]; i++):
    loge x[i]
  end
end

close{}:
  for ($i = 0; i < x["length"]; i++):
    loge x[i] + 3
  end
end
