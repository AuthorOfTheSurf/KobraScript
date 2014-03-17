function AssignmentStatement(target, value) {
  this.target = target
  this.value = value
}

AssignmentStatement.prototype.toString = function () {
  return '(' + this.target.toString() + ' <- ' + this.value.toString() + ')'
}

AssignmentStatement.prototype.analyze = function (context) {
  this.target.analyze(context)
  this.source.analyze(context)
  this.source.type.mustBeCompatibleWith(this.target.type, 'Type mismatch in assignment')
}

module.exports = AssignmentStatement
