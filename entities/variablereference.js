function VariableReference(token, dereferences) {
  this.token = token
  this.dereferences = dereferences || []
}

VariableReference.prototype.toString = function () {
  var result = this.token.lexeme
  if (this.dereferences.length > 0) {
  	result = result.concat('.[')
  	result = result.concat(this.dereferences.toString())
  	result = result.concat(']')
  }
  return result
}

VariableReference.prototype.analyze = function (context) {
  this.referent = context.lookupVariable(this.token)
  this.type = this.referent.type
  //make sure logic checks dereferences!
}

module.exports = VariableReference
