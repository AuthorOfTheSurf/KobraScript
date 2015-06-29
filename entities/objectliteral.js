var Type = require('./type')

function ObjectLiteral(properties) {
  this.properties = properties
}

ObjectLiteral.prototype.toString = function () {
  return '(Obj ' + this.properties.join(', ') + ')'
}

ObjectLiteral.prototype.analyze = function (context) {
  var localContext = context.createChildContext()
  this.type = Type.OBJLIT
  this.properties.forEach(function (p) {
  	p.analyze(localContext)
  })
}

ObjectLiteral.prototype.generateJavaScript = function (state) {
  var js = []
  js.push(
    '{',
    this.properties.map(function (p) {
      js.push(
        p.name.generateJavaScript(state),
        ':',
        p.initializer.generateJavaScript(state))
    }).join(', '),
    '}')
  return js.join()
}

module.exports = ObjectLiteral
