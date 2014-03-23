function VariableReference(token, suffixes) {
  this.token = token
  this.suffixes = suffixes || []
}

function isBasicName() {
  return this.suffixes.length === 0
}

VariableReference.prototype.toString = function () {
  var result = '(Var ' + this.token.lexeme
  if (this.suffixes.length >= 1) {
    result = result.concat('[ ' + this.suffixes[0].toString)
  }
  for (var i = 1; i < this.suffixes.length; i++) {
    result = result.concat(', ' + this.suffixes[0].toString)
    if (i === this.suffixes.length - 1) {
      result = result.concat(']')
    }
  }
  result = result.concat(')')
  return result
}

VariableReference.prototype.analyze = function (context) {
  this.referent = context.lookupVariable(this.token)
  this.type = this.referent.type
  //make sure logic checks dereferences!
}

module.exports = VariableReference
