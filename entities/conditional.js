function Conditional(condition, body) {
  this.condition = condition
  this.body = body
}

Conditional.prototype.toString = function () {
  return '(if ' + this.condition.toString() + ' -> ' + this.body.toString()
}

Conditional.prototype.onlyString = function () {
  return this.body.toString() + 'if ' + this.condition.toString()
}

Conditional.prototype.analyze = function (context) {
  this.condition.analyze(context)
  this.body.analyze(context)
}

Conditional.prototype.generateJavaScript = function (state) {
  var js = [
    'if',
    '(',
    this.condition.generateJavaScript(state),
    ')',
    this.body.generateJavaScript(state)
  ]
  return js.join(' ')
}

module.exports = Conditional
