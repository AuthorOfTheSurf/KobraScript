function Conditional(conditionals, defaultAct) {
  this.conditionals = target
  this.defaultAct = source
}

Conditional.prototype.toString = function () {
  // needs work...
  // return '(= ' + this.target + ' ' + this.source + ')'
}

Conditional.prototype.analyze = function (context) {
  this.target.analyze(context)
  this.source.analyze(context)
  this.source.type.mustBeCompatibleWith(this.target.type, 'Type mismatch in conditional')
}

module.exports = Conditional
