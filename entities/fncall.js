function FnCall(name, params) {
  this.name = name
  this.params = params
}

FnCall.prototype.toString = function () {
  return '(Call ' + this.name.toString() + ' ' + this.params.toString() + ')'
}

module.exports = FnCall
