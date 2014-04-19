function AssignmentStatement(target, source) {
  this.target = target
  this.source = source
  this.isAssignmentStatement = true
}

AssignmentStatement.prototype.toString = function () {
  return '(' + this.target.toString() + ' <- ' + this.source.toString() + ')'
}

AssignmentStatement.prototype.analyze = function (context) {
  this.target.analyze(context)
  this.source.analyze(context)
}

module.exports = AssignmentStatement
