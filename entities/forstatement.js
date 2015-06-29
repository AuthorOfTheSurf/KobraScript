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

ForStatement.prototype.generateJavaScript = function (state) {
  var js = []
  var decMode = this.assignments[0].constructor.name === 'Declaration'

  js.push('for', '(')

  for (var i = 0; i < this.assignments.length; i++) {
    if (i > 0) {
      js.push(',')

      if (decMode) {
        state.continuingDeclaration = true
      }
    }
    js.push(this.assignments[i].generateJavaScript(state))
  }

  js.push(
    ';',
    this.condition.generateJavaScript(state),
    ';',
    this.after.generateJavaScript(state),
    ')',
    this.body.generateJavaScript(state))

  state.continuingDeclaration = false
  return js.join(' ')
}

module.exports = ForStatement
