var Type = require('./type')

function BooleanLiteral(token) {
  this.token = token
}

BooleanLiteral.prototype.toString = function () {
  return this.token.lexeme
}

BooleanLiteral.prototype.analyze = function (context) {
  this.type = Type.BOOLIT
}

module.exports = BooleanLiteral