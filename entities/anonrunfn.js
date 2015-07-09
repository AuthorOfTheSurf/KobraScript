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

function pushArgs(arr, args) {
  if (args) {
    arr.push('(', args.join(', '), ')')
  } else {
    arr.push('()')
  }
}

AnonRunFn.prototype.generateJavaScript = function (state) {
  var js = []
  var args = [] || this.args.map(function (arg) {
    return arg.generateJavaScript(state)
  })

  js.push('(', 'function')
  pushArgs(js, args)
  js.push(this.body.generateJavaScript(state))
  pushArgs(js, args)
  js.push(')')

  return js.join(' ')
}

module.exports = AnonRunFn
