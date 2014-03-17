var error = require('../error')

//This is a list of all the types currently defined
var cache = {}

//Adding a new type if it's not there
//All instanced Type objects have access to the cache variable
function Type(name) {
  this.name = name
  cache[name] = this
}

Type.prototype.toString = function () {
  return this.name
}

//native types
exports.BOOLIT = Type.BOOLIT = new Type('BOOLIT')
exports.NUMLIT = Type.NUMLIT = new Type('NUMLIT')
exports.ARRAYLIT = Type.ARRAYLIT = new Type('ARRAYLIT')
exports.OBJLIT = Type.OBJLIT = new Type('OBJLIT')
exports.NULLLIT = Type.NULLLIT = new Type('NULLLIT')
exports.UNDEFLIT = Type.UNDEFLIT = new Type('UNDEFLIT')

//returns undefined if the type doesn't exist or just the stringy type
exports.forName = function (name) {return cache[name]}

Type.prototype.mustBeNumericLit = function (message, location) {
  if (this !== Type.NUMLIT) {
    error(message, location)
  }
}

Type.prototype.mustBeBooleanLit = function (message, location) {
  if (this !== Type.BOOLIT) {
    error(message, location)
  }
}

Type.prototype.mustBeArrayLit = function (message, location) {
  if (this !== Type.ARRAYLIT) {
    error(message, location)
  }
}

Type.prototype.mustBeObjectLit = function (message, location) {
  if (this !== Type.OBJLIT) {
    error(message, location)
  }
}

Type.prototype.mustBeNullLit = function (message, location) {
  if (this !== Type.NULLLIT) {
    error(message, location)
  }
}

Type.prototype.mustBeUndefLit = function (message, location) {
  if (this !== Type.UNDEFLIT) {
    error(message, location)
  }
}

//so like floats and ints being added
Type.prototype.isCompatibleWith = function (otherType) {
  // In more sophisticated languages, comapatibility would be more complex
  return this == otherType;  
}

Type.prototype.mustBeCompatibleWith = function (otherType, message, location) {
  if (!this.isCompatibleWith(otherType)) {
    error(message, location)
  }
}
