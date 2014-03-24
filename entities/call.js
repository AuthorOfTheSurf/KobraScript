/* Very similar to arguments at this time, this is ok. */

function Call(args) {
  this.args = args
}

Call.prototype.toString = function () {
  var result = '(Call:(' 
	for (var i = 0; i < this.args.length; i++) {
		if (i >= 1) result = result.concat(', ')
		result = result.concat(this.args[i].toString())
	}
	result = result.concat(')')
  return result
}


module.exports = Call
