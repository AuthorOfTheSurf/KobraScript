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
  this.assignments.forEach(function (assignment) {
    assignment.analyze(context)
  })
  this.condition.analyze(context)
  this.after.forEach(function (after) {
    after.analyze(context)
  })
  this.body.analyze(context)
}

module.exports = ForStatement
