var error = require('../error')

function BreakStatement(target) {
  // Construct Break statement.
}

BreakStatement.prototype.toString = function () {
  return '(Break)'
}

BreakStatement.prototype.analyze = function (context) {
  if (!context.looped && !context.parent.looped) {
    error('illegal break in non-looping context')
  }
}

BreakStatement.prototype.generateJavaScript = function (state) {
  return 'break'
}

module.exports = BreakStatement
