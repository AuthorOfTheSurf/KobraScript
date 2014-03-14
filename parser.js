/*
 * Parser module
 *
 *   var parse = require('./parser')
 *
 *   var program = parse(tokens)
 */

var scanner = require('./scanner')
var error = require('./error')

var Program = require('./entities/program')
var Block = require('./entities/block')
var Type = require('./entities/type')
var VariableDeclaration = require('./entities/variabledeclaration')
var AssignmentStatement = require('./entities/assignmentstatement')
var WhileStatement = require('./entities/whilestatement')
var IntegerLiteral = require('./entities/integerliteral')
var BooleanLiteral = require('./entities/booleanliteral')
var VariableReference = require('./entities/variablereference')
var BinaryExpression = require('./entities/binaryexpression')
var UnaryExpression = require('./entities/unaryexpression')

var Blueprint = require('./entities/blueprintdeclaration')
var Params = require('./entities/parameters')
var Fn = require('./entities/function')
var ConditionalStatement = require('./entities/conditionalstatement')
var ForStatement = require('./entities/forstatement')

var tokens

module.exports = function (scanner_output) {
  tokens = scanner_output
  var program = (at('blueprint')) ? parseBlueprint() : parseProgram()
  match('EOF')
  return program
}

function parseProgram() {
  return new Program(parseBlock())
}

function parseBlock() {
  var statements = []
  do {
    statements.push(parseStatement())
  } while (at(['$','ID','for','while','if']))
  return new Block(statements)
}

function parseBlueprint() {
  match('blueprint')
  var blueid = new VariableReference(match('ID'))
  var params = new parseParams()
  match(':')

  match('has')
  match(':')
  var has = []
  while (at('ID')) {
    has.push(parseAssignmentStatement())
    if (at(',')) match()
  }

  match('does')
  match(':')
  var does = []
  while (at('ID')) {
    does.push(parseFnDeclaration())
    if (at(',')) match()
  }
  
  var synget = [],
      synset = []

  if (at('synget')) {
    loadSynget()
    loadSynset()
  }
  if (at('synset')) {
    loadSynset()
    loadSynget()
  }

  function loadSynget () {
    if (!at('synget')) return
    match('synget')
    match(':')
    while (at('ID')) {
      synget.push(new VariableReference(match('ID')))
      if (at(',')) match()
    }
  }

  function loadSynset () {
    if (!at('synset')) return
    match('synset')
    match(':')
    while (at('ID')) {
      synget.push(new VariableReference(match('ID')))
      if (at(',')) match()
    }
  }

  return new Blueprint(blueid, has, does, synget, synset)
}

function parseStatement() {
  if (at('$')) {
    return parseVariableDeclaration()
  } else if (at('ID')) {
    return parseAssignmentStatement()
  } else if (at('while')) {
    return parseWhileStatement()
  } else if (at('if')) {
    return parseConditionalStatement()
  } else if (at('for')) {
    return parseForStatement()
  } else {
    error('Statement expected', tokens[0])
  }
}

function parseVariableDeclaration() {
  match('$')
  var declarations = []
  do {
    declaration.push(parseAssignmentStatement())
    if (at(',')) match()
  } while (at('ID'))
  return new VariableDeclaration(declarations)
}

function parseFnDeclaration() {
  var id = match('ID')
  match('=')
  var fntype
  if (at(['fn', 'proc'])) {
    fntype = match()
  }
  var params = parseParams()
  return new Fn(id, params, body)
}

function parseReference() {
  /** 
   * needs to correctly parse an id as a variable reference
   * or a function call (i.e. including params and whatnot)
   */
}

function parseValue() {
  //still has type-sensitivity at the syntax level
  if (at(['int','bool'])) {
    return Type.forName(match().lexeme)
  } else {
    error('Type expected', tokens[0])
  }
}

function parseParams() {
  match('(')
  var params = []
  while (at('ID')) {
    params.push(new VariableReference(match('ID'))
    if (at(',')) match()
  }
  match(')')
  return params
}

function parseAssignmentStatement() {
  var target = new VariableReference(match('ID'))
  match('=')
  var source = parseExpression()
  return new AssignmentStatement(target, source)
}

function parseWhileStatement() {
  match('while')
  var condition = parseExpression()
  match('loop')
  var body = parseBlock()
  match('end')
  return new WhileStatement(condition, body)
}  

function parseForStatement() {
  //
}

function parseExpression() {
  var left = parseExp1()
  while (at('or')) {
    var op = match()
    var right = parseExp1()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp1() {
  var left = parseExp2()
  while (at('and')) {
    var op = match()
    var right = parseExp2()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp2() {
  var left = parseExp3()
  if (at(['<','<=','==','!=','>=','>'])) {
    var op = match()
    var right = parseExp3()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp3() {
  var left = parseExp4()
  while (at(['+','-'])) {
    var op = match()
    var right = parseExp4()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp4() {
  var left = parseExp5()
  while (at(['*','/'])) {
    op = match()
    right = parseExp5()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp5() {
  if (at(['-','not'])) {
    op = match()
    operand = parseExp6()
    return new UnaryExpression(op, operand)
  } else {
    return parseExp6()
  }
}

function parseExp6() {
  if (at(['true','false'])) {
    return new BooleanLiteral.forName(match().lexeme)
  } else if (at('INTLIT')) {
    return new IntegerLiteral(match())
  } else if (at('ID')) {
    return new VariableReference(match())
  } else if (at('(')) {
    match()
    var expression = parseExpression()
    match(')')
    return expression
  } else {
    error('Illegal start of expression', tokens[0])
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