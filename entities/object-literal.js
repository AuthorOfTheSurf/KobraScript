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
  var props = []
  js.push('{')

  this.properties.forEach(function (p) {
    props.push(p.generateJavaScript(state))
  })

  if (props) {
    js.push(props.join(', '))
  }

  js.push('}')
  return js.join('')
}

module.exports = ObjectLiteral
