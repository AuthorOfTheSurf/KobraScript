var Type = require('./type')

function ArrayLiteral(elements) {
  this.elements = elements
}

ArrayLiteral.prototype.toString = function () {
  return '(Array [' + this.elements.join(', ') + '])'
}

ArrayLiteral.prototype.analyze = function (context) {
  this.type = Type.ARRAYLIT
  this.elements.forEach(function (element) {
    element.analyze(context)
  })
}

ArrayLiteral.prototype.generateJavaScript = function (state) {
  var js = []
  js.push(this.elements.map(function (element) {
    return element.generateJavaScript(state)
  }).join(', '))
  js.unshift('[')
  js.push(']')
  return js.join('')
}

module.exports = ArrayLiteral
