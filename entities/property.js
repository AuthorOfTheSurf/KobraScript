function Property(key, value) {
  this.key = key
  this.value = value
}

Property.prototype.toString = function () {
  return this.key + ': ' + this.value 
}

Property.prototype.analyze = function (context) {
  context.addVariable(this.key, this)
}

Property.prototype.generateJavaScript = function (state) {
  var key = this.key.generateJavaScript(state)
  var value = this.value.generateJavaScript(state)
  return key + ': ' + value
}

module.exports = Property
