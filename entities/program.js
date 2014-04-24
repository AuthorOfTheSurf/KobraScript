var initialContext = require('../analyzer').initialContext
var HashMap = require('hashmap').HashMap

function Program(block) {
  this.block = block
}

Program.prototype.toString = function () {
  return '(Program ' + this.block + ')' 
}

Program.prototype.analyze = function () {
  this.block.analyze(initialContext())
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

module.exports = Program
