#!/usr/bin/env node
var path = require('path')

var parseArgs = require('minimist')
var opts = {
  boolean: ['t', 'a', 'o', 'i']
}
var argv = parseArgs(process.argv.slice(2), opts)
var noArgs = argv._.length === 0

var error = require('./error')
var Compiler = require('./compiler').New()

if (noArgs) {
  console.log([
    'This is KobraScript compiler!',
    '$ kobrac [-t] [-a] [-o] [-i] filename',
    '-t scans, prints the tokens, then exits',
    '-a scans, parses, prints the abstract syntax tree, then exits',
    '-o does optimizations',
    '-i goes up to semantic analysis, prints the semantic graph, then exits'
  ].join('\n'));
} else {
  var fileExtension = path.extname(argv._[0])
  
  if ('.ks'.indexOf(fileExtension) < 0) {
    error('Invalid extension for ' + path.basename(argv._[0]) + ', expected .ks', { path: fileExtension })
    return
  }
  Compiler.compileAndOut(argv)
}
