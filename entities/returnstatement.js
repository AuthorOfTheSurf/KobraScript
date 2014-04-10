function ReturnStatement(expression) {
  this.expression = expression
}

ReturnStatement.prototype.toString = function () {
  return '(Return ' + this.expression.toString() + ')'
}

ReturnStatement.protoype.isReturnStatement = function() {
  return true
}

module.exports = ReturnStatement
