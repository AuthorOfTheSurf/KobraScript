var error = require('../error')

function Fn(fntype, name, params, body) {
  this.fntype = fntype
  this.name = name
  this.params = params
  this.body = body
  this.body.subroutine = true
}

Fn.prototype.toString = function () {
  var lexeme = this.fntype.lexeme
  var name = (this.name) ? this.name.name : ''
  var params = this.params.toString()
  var body = this.body.toString()

  return '(' + [lexeme, name, params, body].join(' ') + ')'
}

Fn.prototype.analyze = function (context) {
  // this.name.analyze(context)
  this.params.analyze(context)

  var localContext = context.createChildContext()
  this.body.analyze(localContext)
}

Fn.prototype.generateJavaScript = function (state) {
  var js = [
    'function',
    (this.name) ? this.name : '',
    '(',
    this.params.generateJavaScript(state),
    ')',
    this.body.generateJavaScript(state)
  ]
  return js.join(' ')
}

module.exports = Fn
