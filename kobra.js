#!/usr/bin/env node

// var argv = require('minimist')(process.argv.slice(2));
var parseArgs = require('minimist')
var argv = parseArgs(process.argv.slice(2), opts={
  boolean: ['t', 'a', 'o', 'i']
})
if (argv._.length === 0) console.log("This is KobraScript compiler!\n$ node kobra.js [-t] [-a] [-o] [-i] filename\n-t scans, prints the tokens, then exits\n-a scans, parses, prints the abstract syntax tree, then exits\n-o does optimizations\n-i goes up to semantic analysis, prints the semantic graph, then exits");
var scan = require('./scanner')
var parse = require('./parser')
var generate = require('./generator')('js')
var error = require('./error')

scan(argv._[0], function (tokens) {
  if (error.count > 0) return;
  if (argv.t) {
    tokens.forEach(function (t) {console.log(t)})
    return
  }
  var program = parse(tokens)
  if (error.count > 0) return;
  if (argv.a) {
    console.log(program.toString())
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
