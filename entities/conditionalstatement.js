function ConditionalStatement(conditionals, defaultAct) {
  this.conditionals = target
  this.defaultAct = source
}

ConditionalStatement.prototype.toString = function () {
  return '(= ' + this.target + ' ' + this.source + ')'
}

ConditionalStatement.prototype.analyze = function (context) {
  this.target.analyze(context)
  this.source.analyze(context)
  this.source.type.mustBeCompatibleWith(this.target.type, 'Type mismatch in conditional')
}

module.exports = ConditionalStatement
