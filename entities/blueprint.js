var initialContext = require('../analyzer').initialContext
var HashMap = require('hashmap').HashMap
var error = require('../error')
var util = require('util')

function Blueprint (blueid, params, has, does, syn, filename) {
  this.blueid = blueid
  this.params = params
  this.has = has
  this.does = does
  this.syn = syn
  this.filename = filename
}

Blueprint.prototype.toString = function () {
  var result = this.blueid.toString()
  result = result.concat(this.params.toString())
  result = result.concat('(Has ')
  for (var i = 0; i < this.has.length; i++) {
    result = result.concat(this.has[i].toString())
  }
  result = result.concat (')(Does ')
  for (var i = 0; i < this.does.length; i++) {
    result = result.concat(this.does[i].toString())
  }
  result = result.concat(')')
  this.syn.forEach(function (synGroup) {
    var synStr = '(Syn:' + synGroup.branch + ' ';
    synGroup.leaf.forEach( function (leaf) {
      synStr = synStr.concat(leaf.toString())
    })
    result = result.concat(synStr + ')')
  })
  
  return '(Blueprint ' + result + ')'
}

Blueprint.prototype.analyze = function (context) {
  if (this.blueid.name !== this.filename) {
    error(util.format('Blueprint id: %s must match filename: %s', this.blueid, this.filename))
  }
  this.blueid.analyze(context)
  var blueprintContext = context.createChildContext()
  this.params.analyze(blueprintContext)
  var hasContext = blueprintContext.createChildContext()
  this.has.forEach(function (property) {
    property.analyze(hasContext)
  })
  var doesContext = hasContext.createChildContext()
  this.does.forEach(function (property) {
    property.analyze(doesContext)
  })
  var synContexts = []
  this.syn.forEach(function (synGroup) {
    var synContext = hasContext.createChildContext()
    synGroup.forEach(function (property) {
      property.analyze(synContext)
    })
    synContexts.push(synContext)
  })
}

Blueprint.prototype.optimize = function () {
  console.log('Optimization for blueprints is not yet implemented')
  return this
}

Blueprint.prototype.showSemanticGraph = function () {

  //  Commented out for now, needed for semantic analyzer.

  var tag = 0
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

  dump(this, 0)
}

module.exports = Blueprint
