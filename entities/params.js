function Params (params) {
  this.params = params
}

Params.prototype.toString = function () {
  return '[' + this.params.join(', ') + ']'
}

Params.prototype.toArray = function () {
	return this.params
}

Params.prototype.analyze = function (context) {
	/* If scanned and parsed successfully to this point
	   no analysis will be necessary
	*/
}

module.exports = Params
