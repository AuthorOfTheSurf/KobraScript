function Block(statements) {
  this.statements = statements
  this.looped = false
  this.subroutine = false
}

Block.prototype.toString = function () {
  return '(Block ' + this.statements.join(' ') + ')'
}

Block.prototype.analyze = function (context) {
  this.statements.forEach(function (statement) {
    statement.analyze(context)
  })
}

Block.prototype.contains = function (Ent) {
  for (var i = 0; i < this.statements.length; i++) {
    if (this.statements[i].constructor.name === Ent) {
      return true
    }
  }
  return false
}

Block.prototype.generateJavaScript = function (state) {
  var js = [
    '{',
    this.statements.map(function (s) {
      return s.generateJavaScript(state) + ';'
    }).join(''),
    '}'
  ]
  return js.join(' ')
}

module.exports = Block
