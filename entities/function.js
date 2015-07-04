var error = require('../error')
var AnonRunFn = require('./anonrunfn')

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

Fn.prototype.generateJavaScript = function (state) {
  // We may have to break out the fntypes into separate entities
  // properly after putting this fix in for declaration statements
  if (this.fntype.lexeme === 'anon') {
    var anonRunFn = new AnonRunFn(this.params, this.body)
    return anonRunFn.generateJavaScript(state)
  }

  var js = [
    'function',
    '(',
    this.params.generateJavaScript(state),
    ')',
    this.body.generateJavaScript(state)
  ]
  return js.join(' ')
}

module.exports = Fn
