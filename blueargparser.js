/*
 *   Specialized Parser module for getting the parameters to a blueprint
 *
 *   var blueargparser = require('./blueargparser')
 *   var args = blueargparser(blueprint_tokens)
 */

var scanner = require('./scanner')
var error = require('./error')
var BasicVar = require('./entities/basicvar')

var tokens

module.exports = function (blueprint_tokens) {
  tokens = blueprint_tokens
  match('blueprint')
  match('ID')
  var params = [];
  match('(')
  if (at('ID')) params.push(parseBasicVar())
  while (at(',')) {
    match()
    params.push(parseBasicVar())
  }
  match(')')
  match(':')
  return params
}

function parseBasicVar () {
  var name = match('ID')
  if (name) {
    return new BasicVar(name.lexeme)
  } else {
    error('invalid token')
  }
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