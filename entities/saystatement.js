function SayStatement(target) {
  this.target = target
}

SayStatement.prototype.toString = function () {
  return '(Say ' + this.target + ')'
}

SayStatement.prototype.analyze = function (context) {
   context.analyze(this.target)
}

module.exports = SayStatement
