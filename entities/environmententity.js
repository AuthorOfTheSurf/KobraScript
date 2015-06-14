function EnvironmentEntity(name) {
  // A token value for a environment variable
  // Environment variables are normal except they do not refer
  // to anything in the KobraScript AST but rather the environment
  // the target language will be run in e.g. 'require' in Node
  this.name = name
}

EnvironmentEntity.prototype.toString = function () {
  // never printed
  return util.format('{ name: %s }', this.name) 
}

EnvironmentEntity.prototype.analyze = function (context) {
  // No analysis, EnvironmentEntity is not a value, but a placeholder
  // for a value that will exist in the runtime environment
}

module.exports = EnvironmentEntity