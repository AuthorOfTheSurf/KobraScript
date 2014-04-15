function ConditionalStatement(conditionals, defaultAct) {
  this.conditionals = conditionals
  this.defaultAct = defaultAct
}

ConditionalStatement.prototype.toString = function () {
  var result = '(Conditional '
  result = result.concat(this.conditionals[0].toString())
  for (var i = 1; i < this.conditionals.length; i++) {
  	result = result.concat(', ' + this.conditionals[i].toString())
  }
  if (this.defaultAct) {
  	return result + ', (else -> ' + this.defaultAct.toString() + '))'
  } else {
  	return result + ')'
  }
}

ConditionalStatement.prototype.analyze = function (context) {
  for (c in this.conditionals) {
    c.analyze(context)
  }
  this.defaultAct.analyze(context)
}

module.exports = ConditionalStatement
