function Property(name, initializer) {
  this.name = name
  this.initializer = initializer
}

Property.prototype.toString = function () {
  return this.name + ': ' + this.initializer 
}

Property.prototype.analyze = function (context) {
  context.addVariable(this.name, this)
}

Property.prototype.generateJavaScript = function (state) {
  var name = this.name.generateJavaScript(state)
  var initializer = this.initializer.generateJavaScript(state)
  return name + ': ' + initializer
}

module.exports = Property
