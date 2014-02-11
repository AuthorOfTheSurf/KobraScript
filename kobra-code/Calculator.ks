$ blueprint Calculator:

$ has {
    pi = 3.14159265 : float,
}

$ does {
	floatfn Add (x, y):
		return x + y
	..,
	floatfn Subtract (x, y):
		return x - y
	..,
	floatfn Multiply (x, y):
		return x * y
	..,
	intfn Divide (x : int, y : int):
		return x // y
	..,
	floatfn Divide (x, y):
		return x / y
	..,
	boolfn IsEven (n):
		return n % 2 == 0
	..,
	boolfn IsPositive (n):
		return n > 0
	end
}

.. defcc