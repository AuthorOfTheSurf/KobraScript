fn removeChar (s, char):
    $ a = s.split('')
    $ result = ""
    for ($ i = 0; i < a.length; i++):
        result = result.concat(char) # (a[i] != char)
    end
    return result
end
