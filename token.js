const Token = function(data) {
  this.kind = data.kind;
  this.lexeme = data.lexeme;
  this.line = data.line;
  this.col = data.col;
};

module.exports = Token;
