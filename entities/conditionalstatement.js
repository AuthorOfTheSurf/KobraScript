function ConditionalStatement(conditionals, defaultAct) {
  this.conditionals = conditionals
  this.defaultAct = defaultAct
}

ConditionalStatement.prototype.toString = function () {
  var result = '(Conditional '
  for (var c in this.conditionals) {
  	result = result.concat(c.toString())
  }
  return result + 'else' + defaultAct.toString() + ')'
}

ConditionalStatement.prototype.analyze = function (context) {
  this.target.analyze(context)
  this.source.analyze(context)
  this.source.type.mustBeCompatibleWith(this.target.type, 'Type mismatch in conditional')
}

module.exports = ConditionalStatement
