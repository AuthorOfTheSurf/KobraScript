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

module.exports = ArrayLiteral
