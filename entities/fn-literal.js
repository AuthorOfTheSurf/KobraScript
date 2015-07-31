var error = require('../error')

function FnLiteral(fntype, name, params, body) {
  this.fntype = fntype
  this.name = name
  this.params = params
  this.body = body
}

FnLiteral.prototype.toString = function () {
  this.type = Type.OBJLIT
  var lexeme = this.fntype.lexeme
  var name = (this.name) ? this.name.name : ''
  var params = this.params.toString()
  var body = this.body.toString()

  return '(' + [lexeme, name, params, body].join(' ') + ')'
}

FnLiteral.prototype.analyze = function (context) {
  if (this.name) {
    this.name.analyze(context)
  }
  this.params.analyze(context)

  var localContext = context.createChildContext()
  localContext.isSubroutine = true
  this.body.analyze(localContext)
}

FnLiteral.prototype.generateJavaScript = function (state) {
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

module.exports = FnLiteral
