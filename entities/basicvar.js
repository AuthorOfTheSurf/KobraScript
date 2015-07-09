function BasicVar(name) {
  this.name = name
  this.referent = undefined
}

BasicVar.prototype.toString = function () {
  return this.name
}

BasicVar.prototype.analyze = function (context) {
  this.referent = context.lookupVariable(this.name)
}

BasicVar.prototype.generateJavaScript = function (state) {
  return state.variableMaker(this)
}

module.exports = BasicVar
