function Fn(fntype, params, body) {
  this.fntype = fntype
  this.params = params
  this.body = body
}

Fn.prototype.toString = function () {
  return '(' + this.fntype.lexeme + " " + this.params.toString() + ' ' + this.body.toString() + ')'
}

module.exports = Fn
