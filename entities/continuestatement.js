var error = require('../error')

function ContinueStatement(target) {
  // Construct continue statement.
}

ContinueStatement.prototype.toString = function () {
  return '(Continue)'
}

ContinueStatement.prototype.analyze = function (context) {
  if (!context.looped && !context.parent.looped) {
    error('illegal continue in non-looping context')
  }
}

ContinueStatement.prototype.generateJavaScript = function (state) {
  return 'continue'
}

module.exports = ContinueStatement
