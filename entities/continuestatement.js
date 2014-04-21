function ContinueStatement(target) {
  // Construct continue statement.
}

ContinueStatement.prototype.toString = function () {
  return '(Continue)'
}

ContinueStatement.prototype.analyze = function (context) {
   context.analyze(this.target)
}

module.exports = ContinueStatement
