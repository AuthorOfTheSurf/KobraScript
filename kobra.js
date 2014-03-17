#!/usr/bin/env node

// var argv = require('minimist')(process.argv.slice(2));
var parseArgs = require('minimist')
var path = require('path')
var argv = parseArgs(process.argv.slice(2), opts={
  boolean: ['t', 'a', 'o', 'i']
})
if (argv._.length === 0) console.log("This is KobraScript compiler!\n$ node kobra.js [-t] [-a] [-o] [-i] filename\n-t scans, prints the tokens, then exits\n-a scans, parses, prints the abstract syntax tree, then exits\n-o does optimizations\n-i goes up to semantic analysis, prints the semantic graph, then exits");
var scan = require('./scanner')
var parse = require('./parser')
var generate = require('./generator')('js')
var error = require('./error')

//  File extension found using path module
var fileExtension = path.extname(argv._[0])
var validExtension = fileExtension === '.ks' || fileExtension === '.ksb'

if (validExtension) {
  scan(argv._[0], function (tokens) {
    if (error.count > 0) return;
    if (argv.t) {
      tokens.forEach(function (t) {console.log(t)})
      return
    }
    var program = parse(tokens)
    if (error.count > 0) return;
    if (argv.a) {
      if (fileExtension === '.ks') console.log(program.toString())
      if (fileExtension === '.ksb') console.log(blueprint.toString())
      return
    }
    if (argv.o) {
      program = program.optimize()
    }
    program.analyze()
    if (error.count > 0) return;
    if (argv.i) {
      program.showSemanticGraph()
      return
    }
    generate(program)
  })
} else {
  error('Invalid extension for ' + path.basename(argv._[0]) + ', expected .ks or .ksb', {path: fileExtension})
}
