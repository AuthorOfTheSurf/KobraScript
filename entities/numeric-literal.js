var Type = require('./type')

function NumericLiteral(token) {
  this.token = token
}

NumericLiteral.prototype.toString = function () {
  return this.token.lexeme
}

NumericLiteral.prototype.analyze = function (context) {
  this.type = Type.NUMLIT
}

NumericLiteral.prototype.generateJavaScript = function (state) {
  return this.token.lexeme
}

module.exports = NumericLiteral
