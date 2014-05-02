function AnonRunFn(params, body) {
  this.params = params
  this.body = body
  this.body.subroutine = true
}

AnonRunFn.prototype.toString = function () {
  return '(AnonRunFn' + ' ' + this.params.toString() + ' ' + this.body.toString() + ')'
}

AnonRunFn.prototype.analyze = function (context) {
  this.params.analyze(context)
  var localContext = context.createChildContext()
  this.body.analyze(localContext)
}

module.exports = AnonRunFn
