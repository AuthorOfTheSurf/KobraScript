$ blueprint Calculator:

has {
    pi = 3.14159265 : float,
}

does {
	$ Add = floatfn (x, y):
		return x + y
	..,
	Subtract = floatfn (x, y):
		return x - y
	..,
	Multiply = floatfn (x, y):
		return x * y
	..,
	Divide = floatfn (x : int, y : int):
		return x // y
	..,
	Divide = floatfn (x, y):
		return x / y
	..,
	IsEven = floatfn (n):
		return n % 2 == 0
	..,
	IsPositive = floatfn (n):
		return n > 0
	end;
}

.. defcc