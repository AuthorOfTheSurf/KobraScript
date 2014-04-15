function Params (params) {
  this.params = params
}

Params.prototype.toString = function () {
  return '[' + this.params.join(', ') + ']'
}

/*  No analysis necessary, these are all basicVars.
 *  Could be changed in future (i.e. to disallow certain
 * 	parameter names) 
 */
Params.prototype.analyze = 1 

module.exports = Params
