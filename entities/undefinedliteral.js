var Type = require('./type')

function UndefinedLiteral(token) {
  this.token = token || {kind: 'undefined', lexeme: 'undefined'}
}

UndefinedLiteral.prototype.toString = function () {
  return this.token.lexeme
}

UndefinedLiteral.prototype.analyze = function (context) {
  this.type = Type.UNDEFLIT
}

module.exports = UndefinedLiteral
