function ExchangeStatement(left, right) {
  this.left = left
  this.right = right
}

ExchangeStatement.prototype.toString = function () {
    return '(Exchange ' + this.left + ' ' + this.right + ')' 
}

ExchangeStatement.prototype.analyze = function (context) {
    this.left.analyze(context)
    this.right.analyze(context)
}

module.exports = ExchangeStatement