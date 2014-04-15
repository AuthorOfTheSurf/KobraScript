var fs = require('fs')

function Construction(blueID, complexargs) {
  this.blueID = blueID
  this.complexargs = complexargs
}

Construction.prototype.toString = function () {
  return '(Construct ' + this.blueID.baseid.lexeme + '~(' + this.complexargs.toString() + '))'
}

Construction.prototype.analyze = function () {
	var targetBlueprint = this.blueID + '.ksb'
  fs.readdir('./', function (err, files) {
  	for (file in files) {
  		if (targetBlueprint === file) return
  	}
    error('could not find ' + targetBlueprint + 'in local directory')
  })
  var isSpecificConstruction = this.complexargs[0].hasOwnProperty('isAssignment')
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
  			error('see arg ' + i + ' , no parameter to a dynamic construction may be an assigment')
  		}
  	}
  }
}

module.exports = Construction
