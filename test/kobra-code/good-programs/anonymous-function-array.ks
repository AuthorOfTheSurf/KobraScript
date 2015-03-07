$ x = [1, 2, 3]

anon(x):
  for ($i = 0; i < x["length"]; i++):
    loge x[i]
  end
end

anon:
  for ($i = 0; i < x["length"]; i++):
    loge x[i] + 3
  end
end
