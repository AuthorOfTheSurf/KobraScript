var Type = require('./type')
var error = require('../error')
var util = require('util')

function BinaryExpression(op, left, right) {
  this.op = op
  this.left = left
  this.right = right
}

BinaryExpression.prototype.analyze = function (context) {
  this.left.analyze(context)
  this.right.analyze(context)
}

BinaryExpression.prototype.toString = function () {
  return '(' + this.op.lexeme + ' ' + this.left + ' ' + this.right + ')'
}

BinaryExpression.prototype.generateJavaScript = function (state) {
  var lexeme = this.op.lexeme
  var left = this.left.generateJavaScript(state)
  var right = this.right.generateJavaScript(state)
  var makeOp = function (op) {
    return {
      '~?': 'typeof ',
      '==': '===',
      '!=': '!==',
      '~=': '==',
      '#': '||'
    }[op] || op
  }

  if (lexeme === '**') {
    return util.format('Math.pow(%s,%s)', left, right)
  } else if (lexeme === '-**') {
    return util.format('((1.0)/Math.pow(%s,%s))', left, right)
  } else if (lexeme === 'is') {
    return util.format('(typeof %s === typeof %s)', left, right)
  } else if (lexeme === ':=:') {
    // :^)
    return util.format('%s = [%s, %s = %s][0]', right, left, left, right)
  } else {
    return util.format('%s %s %s', left, makeOp(lexeme), right)
  }
}

module.exports = BinaryExpression
