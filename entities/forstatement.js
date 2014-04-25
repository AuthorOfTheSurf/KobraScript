var error = require('../error')

function ForStatement(assignments, condition, after, body) {
  this.assignments = assignments
  this.condition = condition
  this.after = after
  this.body = body
  this.body.looped = true
}

ForStatement.prototype.toString = function () {
  return '(For ' + this.assignments + ' ' + this.condition + ' ' + this.after + ' ' + this.body + ')'
}

ForStatement.prototype.analyze = function (context) {
  var a = this.assignment.constructor.name
  if (a === 'Declaration' || a === 'AssignmentStatement') {
    this.assignment.analyze(context)
  } else {
    error('expected declaration or assignment in for statement')
  }
  this.condition.analyze(context)
  this.after.analyze(context)
  this.body.analyze(context)
}

module.exports = ForStatement
