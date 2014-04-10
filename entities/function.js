function Fn(fntype, params, body) {
  this.fntype = fntype
  this.params = params
  this.body = body
}

Fn.prototype.toString = function () {
  return '(' + this.fntype.lexeme + " " + this.params.toString() + ' ' + this.body.toString() + ')'
}

Fn.prototype.analyze = function(context) {
  if (this.fntype.lexeme == 'fn') {
    context.hasReturnStatement(this.body)
  }
}

module.exports = Fn
