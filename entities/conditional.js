function Conditional(condition, block) {
  this.condition = condition
  this.block = block
}

Conditional.prototype.toString = function () {
  return '(if' + this.condition.toString() + ' -> ' + this.block.toString()
}

Conditional.prototype.analyze = function (context) {
  this.condition.analyze(context)
  this.block.analyze(context)
}

module.exports = Conditional
