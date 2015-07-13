var error = require('../error')

function ReturnStatement(expression) {
  this.expression = expression
  // I don't like this
  this.isReturn = true
}

ReturnStatement.prototype.toString = function () {
  return '(Return ' + this.expression.toString() + ')'
}

ReturnStatement.prototype.analyze = function (context) {
  this.expression.analyze(context)
  if (!context.subroutine && !context.parent.subroutine) {
    error('illegal return from non-function context')
  }
}

ReturnStatement.prototype.generateJavaScript = function (state) {
  if (this.expression) {
    return 'return' + ' ' + this.expression.generateJavaScript(state)
  } else {
    return 'return'
  }
}

module.exports = ReturnStatement
