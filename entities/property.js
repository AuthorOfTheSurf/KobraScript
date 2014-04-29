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

module.exports = Property
