/* Very similar to arguments at this time, this is ok. */

function Call(args) {
  this.args = args
}

Call.prototype.toString = function () {
  return '(Call ' + this.args.toString() + ')'
}

module.exports = Call
