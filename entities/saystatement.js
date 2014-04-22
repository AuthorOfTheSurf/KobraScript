function SayStatement(target) {
  this.target = target
}

SayStatement.prototype.toString = function () {
  return '(Say ' + this.target + ')'
}

SayStatement.prototype.analyze = function (context) {
   this.target.analyze(context)
}

module.exports = SayStatement
