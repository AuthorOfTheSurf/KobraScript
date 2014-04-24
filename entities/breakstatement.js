function BreakStatement(target) {
  // Construct Break statement.
}

BreakStatement.prototype.toString = function () {
  return '(Break)'
}

BreakStatement.prototype.analyze = function (context) {
    // TODO must be inside a loop - this is worth a LOT of your grade
}

module.exports = BreakStatement
