function Block(statements) {
  this.statements = statements
}

Block.prototype.toString = function () {
  return '(Block ' + this.statements.join(' ') + ')'
}

Block.prototype.analyze = function (context) {
  var localContext = context.createChildContext()
  this.statements.forEach(function (statement) {
    statement.analyze(localContext)
  })
}

Block.prototype.contains = function (Ent) {
  this.statements.forEach(function (statement) {
    if (statement.constructor.name === Ent) {
      return true
    }
  })
  return false
}
module.exports = Block
