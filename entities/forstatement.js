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
    var a = assignment.constructor.name
    if (a === 'Declaration' || a === 'AssignmentStatement') {
      assignment.analyze(context)
    } else {
      error('expected declaration or assignment in for statement')
    }
  })
  this.condition.analyze(context)
  this.after.forEach(function (after) {
    var Ent = after.constructor.name
    if (Ent === 'MathChangeAssignment' || Ent === 'IncrementStatement') {
      after.analyze(context)
    } else {
      error('expected after to be Increment or MathChangeAssignment')
    }
  })
  this.body.analyze(context)
}

module.exports = ForStatement
