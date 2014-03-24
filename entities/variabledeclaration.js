function VariableDeclaration(declarations) {
  this.declarations = declarations
}

VariableDeclaration.prototype.toString = function () {
  var result = '($ '
  for (var i = 0; i < this.declarations.length; i++) {
    result = result.concat(this.declarations[i].toString() + ', ')
  }
  result = result.substring(0, result.length-2).concat(')')
  return result
}

VariableDeclaration.prototype.analyze = function (context) {
  context.variableMustNotBeAlreadyDeclared(this.id)
  context.addVariable(this.id.lexeme, this)
}

module.exports = VariableDeclaration
