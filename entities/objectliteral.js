var Type = require('./type')

function ObjectLiteral(properties) {
  this.properties = properties
}

ObjectLiteral.prototype.toString = function () {
  return '(ObjProperties: ' + this.statements.join(', ') + ')'
}

ObjectLiteral.prototype.analyze = function (context) {
  this.type = Type.OBJLIT
}

module.exports = ObjectLiteral
