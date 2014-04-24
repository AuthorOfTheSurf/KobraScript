var Type = require('./type')

function StringLiteral(token) {
  this.token = token
}

StringLiteral.prototype.toString = function () {
  return '"' + this.token.lexeme + '"'
}

StringLiteral.prototype.analyze = function (context) {
  this.type = Type.STRLIT
}

module.exports = StringLiteral
