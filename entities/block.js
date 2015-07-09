var EnvironmentEntity = require('./environmententity')

function Block(statements) {
  this.statements = statements
  this.looped = false
  this.subroutine = false
  this.environment = []
}

Block.prototype.toString = function () {
  return '(Block ' + this.statements.join(' ') + ')'
}

// Add a variable to the Block's namespace,
// should match a (runtime) environment variable
// These variables can be overwritten by non-environment
// variables
Block.prototype.addNameToEnvironment = function(name) {
  this.environment.push(name)
}

Block.prototype.analyze = function (context) {
  var localContext = context.createChildContext()
  
  // Pass Block's state into context
  localContext.looped = this.looped
  localContext.subroutine = this.subroutine
  
  // environment variables
  this.environment.forEach(function(v) {
    localContext.addVariable(v, new EnvironmentEntity(v))  
  })

  this.statements.forEach(function (statement) {
    statement.analyze(localContext)
  })
}

Block.prototype.contains = function (Ent) {
  for (var i = 0; i < this.statements.length; i++) {
    if (this.statements[i].constructor.name === Ent) {
      return true
    }
  }
  return false
}

Block.prototype.generateJavaScript = function (state) {
  var js = [
    '{',
    this.statements.map(function (s) {
      return s.generateJavaScript(state) + ';'
    }).join(''),
    '}'
  ]
  return js.join(' ')
}

module.exports = Block
