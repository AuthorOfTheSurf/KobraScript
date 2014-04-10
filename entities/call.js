function Call(fn, args) {
  this.fn = fn
  this.args = args
}

Call.prototype.toString = function () {
  var argResult = [];
  for (var i = 0; i < this.args.length; i++) {
    argResult.push(this.args[i].toString())
  }
  return '(Call ' + this.fn + ' ' + argResult.join(' ') + ')'
}

Call.prototype.analyze = function (context) {
  this.fn.analyze(context)
  this.args.forEach(function (arg) {
    arg.analyze(context)
  })
}

module.exports = Call
