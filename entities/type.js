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
exports.BOOL = Type.BOOL = new Type('bool')
exports.INT = Type.INT = new Type('int')

//returns undefined if the type doesn't exist or just the stringy type
exports.forName = function (name) {return cache[name]}

Type.prototype.mustBeInteger = function (message, location) {
  if (this !== Type.INT) {
    error(message, location)
  }
}

Type.prototype.mustBeBoolean = function (message, location) {
  if (this !== Type.BOOL) {
    error(message, location)
  }
}

//so like floats and ints being added
Type.prototype.isCompatibleWith = function (otherType) {
  // In more sophisticated languages, comapatibility would be more complex
  return this == otherType;  
}

Type.prototype.mustBeCompatibleWith = function (otherType, message, location) {
  if (! this.isCompatibleWith(otherType)) {
    error(message, location)
  }
}
