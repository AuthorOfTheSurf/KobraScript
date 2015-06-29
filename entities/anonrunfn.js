function AnonRunFn(args, body) {
  this.args = args
  this.body = body
  this.body.subroutine = true
}

AnonRunFn.prototype.toString = function () {
  return '(AnonRunFn' + ' ' + this.args.toString() + ' ' + this.body.toString() + ')'
}

AnonRunFn.prototype.analyze = function (context) {
  var localContext = context.createChildContext()
  this.args.forEach(function (arg) {
    arg.analyze(context)
  })
  this.body.analyze(localContext)
}

AnonRunFn.prototype.generateJavaScript = function (state) {
  var js = []
  js.push('(function ()')
  js.push(this.body.generateJavaScript(state))
  js.push('())')
  return js.join(' ')
}

module.exports = AnonRunFn
