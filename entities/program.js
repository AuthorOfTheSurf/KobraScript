var initialContext = require('../analyzer').initialContext()
var HashMap = require('hashmap').HashMap

function Program(block) {
  this.block = block
}

Program.prototype.toString = function () {
  return '(Program ' + this.block + ')' 
}

Program.prototype.analyze = function () {
  this.block.analyze(initialContext)
}

Program.prototype.environment = function(env) {
  if (env === 'NODE') {
    this.block.addNameToEnvironment('require')
  }
}

Program.prototype.optimize = function () {
  console.log('Optimization for Program is not yet implemented')
  return this
}

Program.prototype.showSemanticGraph = function () {
  var tag = 0
  var seenEntities = new HashMap();

  function dump(ent, tag) {
    var props = {}
    for (var p in ent) {
      var value = rep(ent[p])
      if (value !== undefined) props[p] = value
    }
    console.log("%d %s %j", tag, ent.constructor.name, props)
  }

  function rep(ent) {
    if (/undefined|function/.test(typeof ent)) {
      return undefined
    } else if (/number|string|boolean/.test(typeof ent)) {
      return ent
    } else if (Array.isArray(ent)) {
      return ent.map(rep)
    } else if (ent.kind) {
      return ent.lexeme
    } else {
      if (!seenEntities.has(ent)) {
        seenEntities.set(ent, ++tag)
        dump(ent, tag)
      }
      return seenEntities.get(ent)
    }
  }
  dump(this, 0)
}

// The state of the program at runtime, this is available
// during code generation
Program.prototype.state = {
  variableMaker: (function () {
    var lastId = 0
    var map = {}

    return function (basicVar) {
      var name = basicVar.name

      if (!map[name]) {
        lastId = lastId + 1
        map[name] = lastId
      }
      return '_' + name + '_' + map[name]
    }
  }()),

  // used to decide when to output 'var'
  continuingDeclaration: false
}

Program.prototype.generateJavaScript = function () {
  var prettyPrint = require('../code-gen/js-beautifier').prettyPrint
  var js = [
    // '(function ()',
    'if (true)',
    this.block.generateJavaScript(this.state),
    // '());'
  ]
  // Gurantees we print a string, not an array
  var str = [].concat.apply([], js).join(' ')
  // Bad semicolons
  str = str.replace(new RegExp('};', 'g'), '}')
  return prettyPrint(str)
}

module.exports = Program
