var scan = require('./scanner')
var parse = require('./parser')

var Compiler = module.exports = function() {

}

Compiler.prototype.compile = function (argv) {
  // TODO: replace all direct console logging in
  // the scan callback to instead return strings

  scan(argv._[0], function (tokens) {
    if (error.count > 0) { return }
    if (argv.t) {
      logTokens(tokens)
      return
    }
    var program = parse(tokens)
    if (error.count > 0) { return }
    if (argv.a) {
      console.log(program.toString())
      return
    }
    if (argv.o) {
      program.optimize()
    }
    program.analyze()
    if (error.count > 0) { return }
    if (argv.i) {
      program.showSemanticGraph()
      return
    }
    return program.generateJavaScript()
  })
}

