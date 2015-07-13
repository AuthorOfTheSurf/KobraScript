function SayStatement(stmt) {
  this.stmt = stmt
}

SayStatement.prototype.toString = function () {
  return '(Say ' + this.stmt + ')'
}

SayStatement.prototype.analyze = function (context) {
  this.stmt.analyze(context)
}

SayStatement.prototype.generateJavaScript = function (state) {
  return 'console.log(' + this.stmt.generateJavaScript(state) + ')'
}

module.exports = SayStatement
