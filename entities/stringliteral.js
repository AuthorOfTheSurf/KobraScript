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

StringLiteral.prototype.generateJavaScript = function (state) {
  return this.toString()
}

module.exports = StringLiteral
