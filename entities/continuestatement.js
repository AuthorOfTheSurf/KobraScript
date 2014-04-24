function ContinueStatement(target) {
  // Construct continue statement.
}

ContinueStatement.prototype.toString = function () {
  return '(Continue)'
}

ContinueStatement.prototype.analyze = function (context) {
    // TODO must be inside a loop - this is worth a LOT of your grade
}

module.exports = ContinueStatement
