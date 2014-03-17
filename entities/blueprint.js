var initialContext = require('../analyzer').initialContext
var HashMap = require('hashmap').HashMap

function Blueprint (blueid, has, does, synget, synset) {
  this.blueid = blueid
  this.has = has
  this.does = does
  this.synget = synget
  this.synset = synset
}

Blueprint.prototype.toString = function () {
  var result = ''
  result = result.concat(this.blueid.toString())
  result = result.concat(' (Has ')
  for (var i = 0; i < this.has.length; i++) {
    result = result.concat(this.has[i].toString())
  }
  result = result.concat (') (Does ')
  for (var i = 0; i < this.does.length; i++) {
    result = result.concat(this.does[i].toString())
  }
  result = result.concat(')')
  if (this.synget.length > 0) result = result.concat(' (Synget [' + this.synget.toString() + '])')
  if (this.synset.length > 0) result = result.concat(' (Synset [' + this.synset[i].toString() + '])')
  return '(Blueprint ' + result + ')'
}

Blueprint.prototype.analyze = function () {
  this.block.analyze(initialContext())
}

Blueprint.prototype.optimize = function () {
  console.log('Optimization is not yet implemented')
  return this
}

Blueprint.prototype.showSemanticGraph = function () {

  //  Commented out for now, needed for semantic analyzer.

  /*var tag = 0
  var seenEntities = new HashMap();

  function dump(e, tag) {
    var props = {}
    for (var p in e) {
      var value = rep(e[p])
      if (value !== undefined) props[p] = value
    }
    console.log("%d %s %j", tag, e.constructor.name, props)
  }

  function rep(e) {
    if (/undefined|function/.test(typeof e)) {
      return undefined
    } else if (/number|string|boolean/.test(typeof e)) {
      return e
    } else if (Array.isArray(e)) {
      return e.map(rep)
    } else if (e.kind) {
      return e.lexeme
    } else {
      if (!seenEntities.has(e)) {
        seenEntities.set(e, ++tag)
        dump(e, tag)
      }
      return seenEntities.get(e)
    }
  }

  dump(this, 0)*/
}

module.exports = Blueprint
