function Fn(fntype, params, body) {
  this.fntype = fntype
  this.params = params
  this.body = body
}

Fn.prototype.toString = function () {
  return '(' + this.fntype + ' ' + this.params.toString() + ' ' + this.body.toString() + ')'
}

Fn.prototype.analyze = function (context) {
  this.params.analyze(context)
  var localContext = context.createChildContext()
  this.body.statements.forEach(function (statement) {
  	statement.analyze(localContext)
  })
  if (this.fntype === 'proc' && this.body.contains('ReturnStatement')) {
    error('return statement found in proc')  //could be more specific
  }
}

module.exports = Fn
