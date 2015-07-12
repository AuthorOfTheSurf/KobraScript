function Name(value) {
  this.value = value
  this.referent = undefined
}

Name.prototype.toString = function () {
  return this.value
}

Name.prototype.analyze = function (context) {
  this.referent = context.lookupVariable(this.value)
}

Name.prototype.generateJavaScript = function (state) {
  return state.variableMaker(this)
}

module.exports = Name
