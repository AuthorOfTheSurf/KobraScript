var error = require('../error')

function LeaveStatement() {
  // Construct Leave statement.
}

LeaveStatement.prototype.toString = function () {
  return '(Leave)'
}

LeaveStatement.prototype.analyze = function (context) {
  if (!context.isSubroutine) {
    error('illegal leave in non-functional context')
  }
}

LeaveStatement.prototype.generateJavaScript = function (state) {
  return 'return'
}

module.exports = LeaveStatement