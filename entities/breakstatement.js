function BreakStatement(target) {
  // Construct Break statement.
}

BreakStatement.prototype.toString = function () {
  return '(Break)'
}

BreakStatement.prototype.analyze = function (context) {
   context.analyze(this.target)
}

module.exports = BreakStatement
