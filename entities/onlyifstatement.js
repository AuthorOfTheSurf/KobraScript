function OnlyIfStatement(conditional, defaultAct) {
  this.conditional = conditional
  this.defaultAct = defaultAct
}

OnlyIfStatement.prototype.toString = function () {
  var string = '(Only ' + this.conditional.onlyString()
  if (this.defaultAct) {
    string = string.concat('else ' + this.defaultAct.toString())
  }
  return string + ')'
}

OnlyIfStatement.prototype.analyze = function (context) {
  this.conditional.analyze(context)
  if (this.defaultAct) {
    this.defaultAct.analyze(context)
  }
}

OnlyIfStatement.prototype.generateJavaScript = function (state) {
  var js = [
    this.conditional.generateJavaScript(state)
  ]

  if (this.defaultAct) {
    js.push('else')
    js.push(this.defaultAct.generateJavaScript(state))
  }
  return js.join(' ')
}

module.exports = OnlyIfStatement
