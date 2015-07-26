var scan = require('./scanner')
var parse = require('./parser')
var error = require('./error')

function Compiler() {

}

Compiler.New = function() {
  return new Compiler()
}

Compiler.prototype.compileAndOut = function (argv) {
  // TODO: replace all direct console logging in
  // the scan callback to instead return strings
  var self = this

  scan(argv._[0], function (tokens) {
    if (!error.ok) {
      return
    }

    if (argv.t) {
      self.logTokens(tokens)
      return
    }
    var program = parse(tokens)

    if (!error.ok) {
      return
    }

    if (argv.a) {
      console.log(program.toString())
      return
    }

    if (argv.o) {
      program.optimize()
    }
    program.analyze()

    if (!error.ok) {
      return
    }

    if (argv.i) {
      program.showSemanticGraph()
      return
    }
    console.log(program.generateJavaScript())
  })
}

Compiler.prototype.logTokens = function(tokens) {
  var tokenIndex = 0
  tokens.forEach(function (t) {
      console.log(++tokenIndex + " - " + JSON.stringify(t))
  })
}

module.exports = Compiler
