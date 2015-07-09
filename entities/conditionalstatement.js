function ConditionalStatement(conditionals, elseBlock) {
  this.conditionals = conditionals
  this.elseBlock = elseBlock
}

ConditionalStatement.prototype.toString = function () {
  var result = '(ConditionalStatement '
  result = result.concat(this.conditionals[0].toString())

  for (var i = 1; i < this.conditionals.length; i++) {
  	result = result.concat(', ' + this.conditionals[i].toString())
  }

  if (this.elseBlock) {
  	return result + ', (else -> ' + this.elseBlock.toString() + '))'
  } else {
  	return result + ')'
  }
}

ConditionalStatement.prototype.analyze = function (context) {
  this.conditionals.forEach(function (c) {
    c.analyze(context)
  })

  if (this.elseBlock) {
    this.elseBlock.analyze(context)
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

  if (this.elseBlock) {
    js.push(
      'else',
      this.elseBlock.generateJavaScript(state))
  }
  return js.join(' ')
}

module.exports = ConditionalStatement
