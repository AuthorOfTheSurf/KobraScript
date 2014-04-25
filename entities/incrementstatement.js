function IncrementStatement(target, isIncrement, post) {
  this.target = target
  this.isIncrement = isIncrement
  this.post = post
}

IncrementStatement.prototype.toString = function () {
  if (this.isIncrement && this.post) {
    return '(Increment [post] ' +  this.target + ')'
  } else if (!this.isIncrement && this.post){
    return '(Decrement [post] ' + this.target + ')'
  } else if (this.isIncrement && !this.post) {
    return '(Increment [pre] ' + this.target + ')'
  } else {
    return '(Decrement [pre] ' + this.target + ')'
  }

}

IncrementStatement.prototype.analyze = function (context) {
  context.lookupVariable(this.target)
}

module.exports = IncrementStatement
