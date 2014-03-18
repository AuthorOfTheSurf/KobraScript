function ForStatement(assignments, condition, after, body) {
  this.assignments = assignments
  this.condition = condition
  this.after = after
  this.body = body
}

ForStatement.prototype.toString = function () {
  return '(For ' + this.assignments + ' ' + this.condition + ' ' + this.after + ' ' + this.body + ')'
}

ForStatement.prototype.analyze = function (context) {
  // Implemented similar setup to assignment variable.
  this.assignment.analyze(context)
  this.condition.analyze(context)
  this.condition.type.mustbeBooleanLiteral(this.condition.type, 'Boolean not found in while condition')
  this.after.analyze(context)
  this.body.analyze(context)
}

module.exports = ForStatement
