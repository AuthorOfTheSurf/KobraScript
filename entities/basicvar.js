function BasicVar(name) {
  this.name = name
}

BasicVar.prototype.toString = function () {
  return this.name
}

BasicVar.prototype.analyze = function (context) {
  this.referent = context.lookupVariable(this.name)
}

module.exports = BasicVar
