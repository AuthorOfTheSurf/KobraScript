var error = require('../error')

function ContinueStatement(target) {
  // Construct continue statement.
}

ContinueStatement.prototype.toString = function () {
  return '(Continue)'
}

ContinueStatement.prototype.analyze = function (context) {
  if (!context.looped) {
    error('illegal continue in non-looping context')
  }
}

module.exports = ContinueStatement
