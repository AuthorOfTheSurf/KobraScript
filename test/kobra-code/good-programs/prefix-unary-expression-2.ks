// Currently there is a bug that doesn't allow the parser
// to parse all the binary expressions following the parsing
// of a prefix-unary expression.
// This test provides assurance that binary/other expressions
// correctly get parsed into an expression following a
// prefix-unary expression.

$ x = 1

!x && x
++x / x
--x * 10