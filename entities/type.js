var error = require('../error')

// This is a list of all the types currently defined
var cache = {}

// Adding a new type if it's not there
// All instanced Type objects have access to the cache variable
function Type(name) {
  this.name = name
  cache[name] = this
}

Type.prototype.toString = function () {
  return this.name
}

// native types
exports.BOOLIT = Type.BOOLIT = new Type('BOOLIT')
exports.NUMLIT = Type.NUMLIT = new Type('NUMLIT')
exports.ARRAYLIT = Type.ARRAYLIT = new Type('ARRAYLIT')
exports.OBJLIT = Type.OBJLIT = new Type('OBJLIT')
exports.NULLLIT = Type.NULLLIT = new Type('NULLLIT')
exports.UNDEFLIT = Type.UNDEFLIT = new Type('UNDEFLIT')
exports.CLOSURE = Type.CLOSURE = new Type('CLOSURE')
