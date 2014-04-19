/*
 * Specialized Parser module
 *
 *   var arguments = require('./blueargparser')
 *
 *   var program = parse(tokens)
 */

var scanner = require('./scanner')
var error = require('./error')

var tokens

module.exports = function (scanner_output) {
  tokens = scanner_output
  match('blueprint')
  match('ID')
  var params = [];
  match('(')
  if (at('ID')) params.push(match('ID').lexeme)
  while (at(',')) {
    match()
    params.push(match('ID').lexeme)
  }
  match(')')
  match(':')
  return params
}

function at(symbol) {
  if (tokens.length === 0) {
    return false
  } else if (Array.isArray(symbol)) {
    return symbol.some(function (s) {return at(s)})
  } else {
    return symbol === tokens[0].kind
  }  
}

function match(symbol) {
  if (tokens.length === 0) {
    error('Unexpected end of input')
  } else if (symbol === undefined || symbol === tokens[0].kind) {
    return tokens.shift()
  } else {
    error('Expected ' + symbol + ' but found ' + tokens[0].kind, tokens[0])
  }
}