function Construction(name, complexargs) {
  this.name = name
  this.complexargs = complexargs
}

Construction.prototype.toString = function () {
  return '(Construct ' + this.name.baseid.lexeme + '~(' + this.complexargs.toString() + '))'
}

module.exports = Construction
