var Type = require('./type')

function NullLiteral(token) {
  this.token = token || {kind: 'null', lexeme: 'null'}
}

NullLiteral.prototype.toString = function () {
  return this.token.lexeme
}

NullLiteral.prototype.analyze = function (context) {
  this.type = Type.NULLLIT
}

NullLiteral.prototype.generateJavaScript = function (state) {
  return 'null'
}

module.exports = NullLiteral
