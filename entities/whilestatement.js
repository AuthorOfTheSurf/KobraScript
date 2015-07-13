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
