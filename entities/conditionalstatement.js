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
  this.conditionals.forEach(function (c) {
    c.analyze(context)
  })
  if (this.defaultAct) {
    this.defaultAct.analyze(context)
  }
}

ConditionalStatement.prototype.generateJavaScript = function (state) {
  var js = []
  
  for (var i = 0; i < this.conditionals.length; i++) {
    var conditional = this.conditionals[i]
    var condition   = conditional.condition.generateJavaScript(state)
    var body        = conditional.body.generateJavaScript(state)

    if (i === 0) {
      js.push('if')
    } else {
      js.push('else','if')
    }
    js.push('(', condition, ')', body)
  }
  return js.join(' ')
}

module.exports = ConditionalStatement
