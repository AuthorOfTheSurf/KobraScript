var error = require('../error')

function ReturnStatement(expression) {
  this.expression = expression
  this.isReturn = true
}

ReturnStatement.prototype.toString = function () {
  return '(Return ' + this.expression.toString() + ')'
}

ReturnStatement.prototype.analyze = function (context) {
  if (!context.subroutine) {
    error('illegal return from non-function context')
  }
}

module.exports = ReturnStatement
