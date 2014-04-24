function Declaration(name, initializer) {
  this.name = name
  this.initializer = initializer
}

Declaration.prototype.toString = function () {
  return '(Declare ' + this.name + ' ' + this.initializer + ')'
}

Declaration.prototype.analyze = function (context) {
  context.addVariable(this.name, this)
}

module.exports = Declaration
