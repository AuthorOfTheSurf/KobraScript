function VariableReference(baseid, suffixes) {
  this.baseid = baseid
  this.suffixes = suffixes || []
}

VariableReference.prototype.isBasicName = function () {
  return this.suffixes.length === 0
}

VariableReference.prototype.toString = function () {
  var result = '(Var ' + this.baseid.lexeme
  for (var i = 0; i < this.suffixes.length; i++) {
    result = result.concat('>' + this.suffixes[i].toString())
  }
  result = result.concat(')')
  return result
}

VariableReference.prototype.analyze = function (context) {
  this.referent = context.lookupVariable(this.baseid)
  this.type = this.referent.type
  //make sure logic checks dereferences!
}

module.exports = VariableReference
