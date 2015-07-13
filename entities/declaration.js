function Declaration(name, initializer) {
  this.name = name
  this.initializer = initializer
}

Declaration.prototype.toString = function () {
  return '(Declare ' + this.name + ' ' + this.initializer + ')'
}

Declaration.prototype.analyze = function (context) {
  context.addVariable(this.name, this)
  this.initializer.analyze(context)
}

Declaration.prototype.generateJavaScript = function (state) {
  var js = []
  if (!state.continuingDeclaration) {
    js.push('var')
  }
  js.push(
    this.name.generateJavaScript(state),
    '=',
    this.initializer.generateJavaScript(state))
  return js.join(' ')
}

module.exports = Declaration
