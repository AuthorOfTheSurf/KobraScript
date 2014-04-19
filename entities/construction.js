var fs = require('fs')
var HashMap = require('hashmap').HashMap
var scan = require('../scanner')
var blueargparser = require('../blueargparser')

function Construction(blueID, complexargs) {
  this.blueID = blueID
  this.complexargs = complexargs
  this.targetBlueprint = this.blueID + '.ksb'
}

Construction.prototype.toString = function () {
  return '(Construct ' + this.blueID.baseid.lexeme + '~(' + this.complexargs.toString() + '))'
}

Construction.prototype.analyze = function () {
  fs.readdir('./', function (err, files) {
  	for (file in files) {
  		if (this.targetBlueprint === file) return
  	}
    error('could not find ' + this.targetBlueprint + 'in local directory')
  })

  if (complexargs.length === 0) return

  /* First argument sets the precedent for what kind of construction is going on */
  var isSpecificConstruction = this.complexargs[0].hasOwnProperty('isAssignment')
  /* Ensure the following arguments are consistent */
  if (isSpecificConstruction && this.complexargs.length > 1) {
  	for (var i = 1; i < this.complexargs.length; i++) {
  		if (!this.complexargs[i].hasOwnProperty('isAssignment')) {
  			error('see arg ' + i + ', all parameters to a specific construction must be assignments')
  		}
  	}
  }
  else if (!isSpecificConstruction && this.complexargs.length > 1) {
  	for (var i = 1; i < this.complexargs.length; i++) {
  		if (this.complexargs[i].hasOwnProperty('isAssignment')) {
  			error('see arg ' + i + ', no parameter to a dynamic construction may be an assigment')
  		}
  	}
  	var argObj = argumentify(this.targetBlueprint)
  	var i = argObj.args.length
  	var simpleargs = []
  	while (i--) simpleargs.push(undefined)
  	for (var i = 0; i < this.complexargs.length; i++) {
  		simpleargs[argObj.map.get(complexargs[i])] = complexargs[i].source
  	}
    /* Complex arguments now put into proper parameter slots */
    complexargs = simpleargs
  }
}

function argumentify(file) {
	var args
	var map = new HashMap()
	scan(file, function (tokens) {
	  args = blueargparser(tokens)
	})
	analyzeArguments(args)
	for (var i = 0; i < args.length; i++) {
		map.set(args[i], i)
	}
	return {map: map, args: args}
}

function analyzeArguments(arguments) {
	for (var i = 0; i < arguments.length; i++) {
		for (var j = i + 1; j < arguments.length - 1; j++) {
			if (arguments[i] === arguments[j]) {
				error('trying to build from potentially faulty blueprint, identical parameters found at ' + i + ', ' + j)
			}
		}
	}
}

module.exports = Construction
