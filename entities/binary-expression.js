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
  var js = ''
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
    js = util.format('Math.pow(%s,%s)', left, right)
  } else if (lexeme === '-**') {
    js = util.format('((1.0)/Math.pow(%s,%s))', left, right)
  } else if (lexeme === 'is') {
    js = util.format('(typeof %s === %s)', left, right)
  } else if (lexeme === ':=:') {
    // Returns the value `a` in `a :=: b`, the new value for `b`
    js = util.format('%s = [%s, %s = %s][0]', right, left, left, right)
  } else {
    js = util.format('%s %s %s', left, makeOp(lexeme), right)
  }

  if (this.wrappedByParens) {
    return '(' + js + ')'
  }
  return js
}

module.exports = BinaryExpression
