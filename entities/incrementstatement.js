function IncrementStatement(name, increments, post) {
  this.name = name
  this.increments = increments
  this.post = post
}

IncrementStatement.prototype.toString = function () {
  if (this.increments && this.post) {
    return '(Increment [post] ' +  this.name + ')'
  } else if (!this.increments && this.post){
    return '(Decrement [post] ' + this.name + ')'
  } else if (this.increments && !this.post) {
    return '(Increment [pre] ' + this.name + ')'
  } else {
    return '(Decrement [pre] ' + this.name + ')'
  }

}

IncrementStatement.prototype.analyze = function (context) {
  // TODO
}

module.exports = IncrementStatement
