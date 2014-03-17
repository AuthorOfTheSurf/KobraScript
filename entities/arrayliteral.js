var Type = require('./type')

function ArrayLiteral(token) {
  this.token = token
}

ArrayLiteral.prototype.toString = function () {
  return this.token.lexeme
}

ArrayLiteral.prototype.analyze = function (context) {
  this.type = Type.ARRAYLIT
}

module.exports = ArrayLiteral
