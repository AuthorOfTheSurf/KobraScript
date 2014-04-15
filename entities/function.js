function Fn(fntype, params, body) {
  this.fntype = fntype
  this.params = params
  this.body = body
}

Fn.prototype.toString = function () {
  return '(' + this.fntype.lexeme + ' ' + this.params.toString() + ' ' + this.body.toString() + ')'
}

Fn.prototype.analyze = function(context) {
  this.params.analyze(context)
  this.body.analyze(context)
  if (this.fntype.lexeme == 'proc' && context.hasReturnStatement(this.body)) {
  	error('proc definitions may not have return statements')
  }
}

module.exports = Fn
