function ExchangeStatement(left, right) {
  this.left = left
  this.right = right
}

ExchangeStatement.prototype.toString = function () {
    return '(Exchange ' + this.left + ' ' + this.right + ')' 
}

ExchangeStatement.prototype.analyze = function () {
    // TODO
}

module.exports = ExchangeStatement