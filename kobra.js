#!/usr/bin/env node

// var argv = require('minimist')(process.argv.slice(2));
var parseArgs = require('minimist')
var argv = parseArgs(process.argv.slice(2), opts={
  boolean: ['t', 'a', 'o', 'i']
})
console.dir(argv);

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
