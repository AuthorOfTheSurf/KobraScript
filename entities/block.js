function Block(statements) {
  this.statements = statements
  this.looped = false
  this.subroutine = false
}

Block.prototype.toString = function () {
  return '(Block ' + this.statements.join(' ') + ')'
}

Block.prototype.analyze = function (context) {
  var localContext = context.createChildContext()
  /* Pass state into owned context */
  localContext.looped = this.looped
  localContext.subroutine = this.subroutine
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
