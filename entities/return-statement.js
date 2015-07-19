var error = require('../error')

function ReturnStatement(expression) {
  this.expression = expression
}

ReturnStatement.prototype.toString = function () {
  return '(Return ' + this.expression.toString() + ')'
}

ReturnStatement.prototype.analyze = function (context) {
  this.expression.analyze(context)
  
  if (!context.isSubroutine) {
    error('illegal return in non-functional context')
  }
}

ReturnStatement.prototype.generateJavaScript = function (state) {
  return 'return' + ' ' + this.expression.generateJavaScript(state)
}

module.exports = ReturnStatement
