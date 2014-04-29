function TernaryExpression(condition, left, right) {
  this.condition = condition
  this.left = left
  this.right = right
}

TernaryExpression.prototype.toString = function () {
  return
}

TernaryExpression.prototype.analyze = function (context) {
  
}

module.exports = TernaryExpression
