function Call(fn, args) {
  this.fn = fn
  this.args = args
}

Call.prototype.toString = function () {
  return '(Call' + this.fn + ' ' + this.args.join(' ') + ')'
}

Call.prototype.analyze = function (context) {
  this.fn.analyze(context)
  this.args.forEach(function (arg) {
    arg.analyze(context)
  })
}

module.exports = Call
