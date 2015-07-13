function ClosureLiteral(args, body) {
  this.args = args // will change when `as` is added in
  this.body = body
  this.body.subroutine = true
}

ClosureLiteral.prototype.toString = function() {
  var args = this.args.toString()
  var body = this.body.toString()

  return '(Closure ' + args + ' ' + body + ')'
}

ClosureLiteral.prototype.analyze = function (context) {
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

ClosureLiteral.prototype.generateJavaScript = function (state) {
  var js = []
  var args = []
  if (this.args) {
    args = this.args.map(function (arg) {
      return arg.generateJavaScript(state)
    })
  }

  js.push('(', 'function')
  pushArgs(js, args)
  js.push(this.body.generateJavaScript(state))
  pushArgs(js, args)
  js.push(')')

  return js.join(' ')
}

module.exports = ClosureLiteral
