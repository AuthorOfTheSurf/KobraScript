var error = require('./error')

function AnalysisContext(parent) {
  this.parent = parent
  this.symbolTable = {}
}

AnalysisContext.initialContext = function () {
  return new AnalysisContext(null)
}

AnalysisContext.prototype.createChildContext = function () {
  return new AnalysisContext(this)
}

AnalysisContext.prototype.addVariable = function (name, entity) {
  this.symbolTable[name] = entity
}

AnalysisContext.prototype.hasReturnStatement = function (block) {
  for (stmt in block) {
    if (stmt.hasOwnProperty('isReturnStatement')) return true
  }
  return false
}

AnalysisContext.prototype.lookupVariable = function (token) {
  var variable = this.symbolTable[token.lexeme]
  if (variable) {
    return variable
  } else if (!this.parent) {
    error('Variable ' + token.lexeme + ' not found', token)
  } else {
    return this.parent.lookupVariable(token)
  }
}

exports.initialContext = AnalysisContext.initialContext
