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
  // don't analyse name yet.
  // Will only cause issues if the name is a reserved keyword
  // in JavaScript, logic which hasn't been written yet.
  // this.name.analyze(context)
  this.params.analyze(context)

  var localContext = context.createChildContext()
  this.body.analyze(localContext)
}

Fn.prototype.generateJavaScript = function (state) {
  // We may have to break out the fntypes into separate entities
  // properly after putting this fix in for declaration statements
  // -- yes.
  if (this.fntype.lexeme === 'anon') {
    var anonRunFn = new AnonRunFn(this.params, this.body)
    return anonRunFn.generateJavaScript(state)
  }

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
