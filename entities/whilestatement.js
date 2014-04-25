function WhileStatement(condition, body) {
  this.condition = condition
  this.body = body
  this.body.looped = true
}

WhileStatement.prototype.toString = function () {
  return '(While ' + this.condition + ' ' + this.body + ')'
}

WhileStatement.prototype.analyze = function (context) {
  this.condition.analyze(context)
  this.body.analyze(context)
}

module.exports = WhileStatement
