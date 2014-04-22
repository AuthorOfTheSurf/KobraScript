function DottedVar(struct, property) {
  this.struct = struct
  this.property = property
}

DottedVar.prototype.toString = function () {
  return '(dereference ' + this.struct + ' -> ' + this.property + ')'
}

DottedVar.prototype.analyze = function (context) {
  this.struct.lookUpVariable(this.property)
}

module.exports = DottedVar
