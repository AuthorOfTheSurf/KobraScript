function Token(obj) {
  this.kind = obj.kind
  this.lexeme = obj.lexeme
  this.line = obj.line
  this.col = obj.col
}

module.exports = Token