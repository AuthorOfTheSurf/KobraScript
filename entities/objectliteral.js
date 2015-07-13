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
  var propText = []

  js.push('{')

  this.properties.forEach(function (p) {
    var name = p.name.generateJavaScript(state)
    var initializer = p.initializer.generateJavaScript(state)

    propText.push(name + ':' + initializer)
  })

  if (propText) {
    js.push(propText.join(', '))
  }

  js.push('}')

  return js.join('')
}

module.exports = ObjectLiteral
