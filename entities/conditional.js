function Conditional(condition, block) {
  this.conditionals = condition
  this.block = block
}

Conditional.prototype.toString = function () {
  return "if" + condition.toString() + "->" + block.toString
}

Conditional.prototype.analyze = function (context) {
  this.target.analyze(context)
  this.source.analyze(context)
  this.source.type.mustBeCompatibleWith(this.target.type, 'Type mismatch in conditional')
}

module.exports = Conditional
