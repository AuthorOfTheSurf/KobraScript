function Name(value) {
  this.value = value
  this.referent = undefined
}

Name.prototype.toString = function () {
  return this.value
}

Name.prototype.analyze = function (context) {
  this.referent = context.addVariable(this.value)
}

Name.prototype.generateJavaScript = function (state) {
  return this.toString()
}

module.exports = Name
