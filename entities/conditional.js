function Conditional(condition, body) {
  this.condition = condition
  this.body = body
}

Conditional.prototype.toString = function () {
  return '(if ' + this.condition.toString() + ' -> ' + this.body.toString()
}

Conditional.prototype.analyze = function (context) {
  this.condition.analyze(context)
  this.body.analyze(context)
}

module.exports = Conditional
