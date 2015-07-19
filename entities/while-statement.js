function WhileStatement(condition, body) {
  this.condition = condition
  this.body = body
}

WhileStatement.prototype.toString = function () {
  return '(While ' + this.condition + ' ' + this.body + ')'
}

WhileStatement.prototype.analyze = function (context) {
  this.condition.analyze(context)
  context.looped = true
  this.body.analyze(context)
  context.looped = false
}

WhileStatement.prototype.generateJavaScript = function (state) {
  var js = [
    'while',
    '(',
    this.condition.generateJavaScript(state),
    ')',
    this.body.generateJavaScript(state)
  ]
  return js.join(' ')
}

module.exports = WhileStatement
