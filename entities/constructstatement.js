function ConstructStatement(name, params) {
  this.name = name
  this.params = params
}

ConstructStatement.prototype.toString = function () {
  return '(Construct ' + this.name.toString() + ' ' + this.params.toString() + ')'
}

module.exports = ConstructStatement
