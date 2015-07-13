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

exports.initialContext = AnalysisContext.initialContext
