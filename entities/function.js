var error = require('../error')

function Fn(fntype, params, body) {
  this.fntype = fntype
  this.params = params
  this.body = body
  this.body.subroutine = true
}

Fn.prototype.toString = function () {
  return '(' + this.fntype.lexeme + ' ' + this.params.toString() + ' ' + this.body.toString() + ')'
}

Fn.prototype.analyze = function (context) {
  this.params.analyze(context)
  var localContext = context.createChildContext()
  if (this.fntype.lexeme === 'proc' && this.body.contains('ReturnStatement')) {
    error('proceedure calls cannot return')
  }
  this.body.analyze(localContext)
}

module.exports = Fn
