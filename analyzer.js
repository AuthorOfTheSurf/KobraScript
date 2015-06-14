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

AnalysisContext.prototype.lookupVariable = function (name) {
  var variable = this.symbolTable[name]

  if (variable) {
    return variable
  } else if (!this.parent) {
    error('Variable ' + name + ' not found')
  } else {
    return this.parent.lookupVariable(name)
  }
}

exports.initialContext = AnalysisContext.initialContext
