strfn removeChar (s, char):
	$ a = s.split('') : char[]
	$ result = ""
	for ($ i = 0; i < a.length; i++):
		result = result.concat(char) if (a[i] != char)
	end
	return result
end
