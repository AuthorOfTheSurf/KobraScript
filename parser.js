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
var Blueprint = require('./entities/blueprint')
var Block = require('./entities/block')
var Type = require('./entities/type')
var VariableDeclaration = require('./entities/variabledeclaration')
var Fn = require('./entities/function')
var AssignmentStatement = require('./entities/assignmentstatement')
var IncrementStatement = require('./entities/incrementstatement')
var ConditionalStatement = require('./entities/conditionalstatement')
var ForStatement = require('./entities/forstatement')
var WhileStatement = require('./entities/whilestatement')
var ReturnStatement = require('./entities/returnstatement')
var Construction = require('./entities/construction')
var ExchangeStatement = require('./entities/exchangestatement')
var Params = require('./entities/params')
var UnaryExpression = require('./entities/unaryexpression')
var BinaryExpression = require('./entities/binaryexpression')
var VariableReference = require('./entities/variablereference')
var Call = require('./entities/call')
var ArrayLiteral = require('./entities/arrayliteral')
var ObjectLiteral = require('./entities/objectliteral')
var NumericLiteral = require('./entities/numericliteral')
var BooleanLiteral = require('./entities/booleanliteral')
var StringLiteral = require('./entities/stringliteral')
var UndefinedLiteral = require('./entities/undefinedliteral')
var NullLiteral = require('./entities/nullliteral')

var tokens


module.exports = function (scanner_output) {
  tokens = scanner_output
  var program = at('blueprint') ? parseBlueprint() : parseProgram()
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
  } while (at(['$','ID','for','while','if','fn','proc','++','--','return']))
  return new Block(statements)
}

function parseBlueprint() {
  match('blueprint')
  var blueid = new VariableReference(match('ID'))
  var params = new Params(parseParams())
  match(':')

  match('has')
  match(':')
  var has = []
  if (at('ID')) {
    has.push(parseAssignmentStatement(':'))
    while (at(',')) {
      match()
      has.push(parseAssignmentStatement(':'))
    }
  }

  match('does')
  match(':')
  var does = []
  if (at('ID')) {
    does.push(parseAssignmentStatement(':'))
    while (at(',')) {
      match()
      does.push(parseAssignmentStatement(':'))
    }
  }
  
  var synget = synset = []
  if (at('synget')) {
    loadSynget()
    loadSynset()
  }
  else if (at('synset')) {
    loadSynset()
    loadSynget()
  }
  match('defcc')

  function loadSynget () {
    match('synget')
    match(':')
    if (at('ID')) {
      synget.push(new VariableReference(match('ID')))
      while (at(',')) {
        match()
        synget.push(new VariableReference(match('ID')))
      }
    }
  }

  function loadSynset () {
    match('synset')
    match(':')
    if (at('ID')) {
      synget.push(new VariableReference(match('ID')))
      while (at(',')) {
        match()
        synget.push(new VariableReference(match('ID')))
      }
    }
  }
  return new Blueprint(blueid, has, does, synget, synset)
}

function parseStatement() {
  if (at('$')) {
    return parseVariableDeclaration()
  } else if (at(['fn','proc'])) {
    return parseFnDeclaration()
  } else if (at(['++','--']) || (at('ID') && next(['++','--']))) {
    return parseIncrementStatement()
  } else if (at('ID')) {
    return parseUseOfVar()
  } else if (at('while')) {
    return parseWhileStatement()
  } else if (at('if')) {
    return parseConditionalStatement()
  } else if (at('for')) {
    return parseForStatement()
  } else if (at('return')) {
    return parseReturnStatement()
  } else {
    error('Statement expected', tokens[0])
  }
}

function parseVariableDeclaration() {
  function gather () {
    if (next('=')) {
      declarations.push(parseAssignmentStatement())
    } else if (next(',')) {
      declarations.push(new AssignmentStatement(new VariableReference(match('ID')), new UndefinedLiteral()))
    }
  }

  var declarations = []
  match('$')
  gather()
  while (at(',')) {
    match()
    gather()
  }
  return new VariableDeclaration(declarations)
}

/* assignment token is '=' (general) or ':' (property declaration) */
function parseAssignmentStatement(assignmentToken) {
  var target = parseVar()
  match(assignmentToken)
  var value
  if (at(['fn','proc'])) {
    value = parseFn()
  } else if (at(['{','[','construct'])) {
    value = parseValue()
  } else {
    value = parseExpression()
  }
  return new AssignmentStatement(target, value)
}

function parseUseOfVar() {
  var name = parseVar()
  if (at(':=:')) {
    match()
    var right = parseValue()
    return new ExchangeStatement(name, right)
  } else if (at('=')) {
    match()
    var value = parseValue()
    return new AssignmentStatement(name, value)
  } else {
    return name
  }
}

function parseVar(limitToId) {
  function gather () {
    if (at('.')) {
      match()
      suffixes.push(new StringLiteral(match()))
    } else if (at('[')) {
      match()
      suffixes.push(new StringLiteral(match()))
      match(']')
    } else if (at('(')) {
      suffixes.push(new Call(parseArgs()))
    } else {
      error('Illegal dereference', tokens[0])
    }
  }

  var name = match('ID')
  var suffixes = []
  while (!limitToId && at(['[','.','('])) {
    gather()
  }
  return new VariableReference(name, suffixes)
}

/*  This is anything that can be assigned to an id; RHS values */
function parseValue() {
  if (at('{')) {
    return parseObjectLiteral()
  } else if (at('[')) {
    return parseArrayLiteral()
  } else if (at('UNDEFLIT')) {
    return new UndefinedLiteral(match())
  } else if (at('NULLLIT')) {
    return new NullLiteral(match())
  } else if (at('NUMLIT')) {
    return new NumericLiteral(match())
  } else if (at('BOOLIT')) {
    return new BooleanLiteral(match())
  } else if (at('STRLIT')) {
    return new StringLiteral(match())
  } else if (at('ID')) {
    return parseVar()
  } else if (at('construct')) {
    return parseConstructValue()
  } else if (at(['fn','proc'])) {
    return parseFn()
  } else {
    return parseExpression()
  }
}

function parseFn() {
  var fntype = match()
  var params = parseParams()
  match(':')
  var body = parseBlock()
  if (at(['..','end'])) {
    match()
    return new Fn(fntype, params, body)
  } else {
    error('Illegal end of function token', tokens[0])
  }
}

function parseFnDeclaration() {
  var fntype = match()
  var name
  if (at('ID')) {
    name = parseVar(true)
  }
  var params = parseParams()
  match(':')
  var body = parseBlock()
  if (at(['..','end'])) {
    match()
    return new VariableDeclaration([new AssignmentStatement(name, new Fn(fntype, params, body))])
  } else {
    error('Illegal end of function token', tokens[0])
  }
}

function parseParams() {
  match('(')
  var params = []
  if (at('ID')) {
    var p = parseVar()
    if (p.isBasicName()) params.push(p)
    else error("Illegal parameter specification, try a basic name", tokens[0])
  }
  while (at(',')) {
    match()
    p = parseVar()
    if (p.isBasicName()) params.push(p)
    else error("Illegal parameter specification, try a basic name", tokens[0])
  }
  match(')')
  return new Params(params)
}

function parseArgs() {
  match('(')
  var args = []
  if (!at(')')) {
    args.push(parseExpression())
  }
  while (at(',')) {
    match()
    args.push(parseExpression())
  }
  match(')')
  return args
}

function parseConstructArgs() {
  match('(')
  var args = [] //of values and assignment instructions
  if (at('ID') && next('=') || at(['fn','proc'])) {
    args.push(parseAssignmentStatement('='))
  } else if (!at(')')) {
    args.push(parseExpression())
  }
  while (at(',')) {
    match()
    if (at('ID') && next('=') || at(['fn','proc'])) {
      args.push(parseAssignmentStatement('='))
    } else if (!at(')')) {
      args.push(parseExpression())
    }
  }
  match(')')
  return args
}

function parseArrayLiteral() {
  var elements = []
  match('[')
  if (!at(']')) {
    elements.push(parseValue())
  }
  while (at(',')) {
    match()
    elements.push(parseValue())
  }
  match(']')
  return new ArrayLiteral(elements)
}

function parseObjectLiteral() {
  var properties = []
  match('{')
  if (at('ID')) {
    properties.push(parseAssignmentStatement(':'))
  }
  while (at(',')) {
    match()
    properties.push(parseAssignmentStatement(':'))
  }
  match('}')
  return new ObjectLiteral(properties)
}

function parseWhileStatement() {
  match('while')
  match('(')
  var condition = parseExpression()
  match(')')
  match(':')
  var body = parseBlock()
  if (at('..')) {
    match('..')
  } else {
    match('end')
  }
  return new WhileStatement(condition, body)
}  

function parseForStatement() {
  match('for')
  match('(')
  var assignments = []
  assignments.push(parseVariableDeclaration())
  while (at(',')) {
    match()
    assignments.push(parseAssignmentStatement())    
  }
  match(';')
  var condition = parseExpression()
  match(';')
  var after = []
  after.push(parseStatement())
  while (at(',')) {
    match()
    assignments.push(parseStatement()) 
  }
  match(')')
  match(':')
  var body = parseBlock()
  if (at('..')) {
    match('..')
  } else {
    match('end')
  }
  return new ForStatement(assignments, condition, after, body)
}

function parseIncrementStatement() {
  var name,
    increments,
    post = true

  if (at(['++', '--'])) {
    post = false
    increments = at('++')
    match()
    name = parseVar()
  } else {
    name = parseVar()
    increments = at('++')
    match()
  }
  return new IncrementStatement(name, increments, post)
}

function parseReturnStatement() {
  match('return')
  return new ReturnStatement(parseExpression())
}

function parseConstructValue() {
  match('construct')
  var name = parseVar(true)
  var args = parseConstructArgs()
  return new Construction(name, args)
}

function parseConditionalExpression() {
  var conditionals = [],
      defaultAct,
      elseEncountered = false

  conditionals.push(parseIfThen())
  while(at('..') && !elseEncountered) {
    match()
    match('else')
    if (at('if')) {
      conditionals.push(parseIfThen())
    } else if (at(':')) {
      match()
      defaultAct = parseBlock()
      elseEncountered = true
    } else {
      error('Illegal token in conditional statement', tokens[0])
    }
  }
  match('end')
  return new ConditionalStatement(conditionals, defaultAct)

  function parseIfThen() {
    match('if')
    match('(')
    var condition = parseExpression()
    match(')')
    match(':')
    var action = parseBlock()
    return new Conditional(condition, action)
  }
}

function parseExpression() {
  var left = parseExp1()
  while (at('||')) {
    var op = match()
    var right = parseExp1()
    left = new BinaryExpression(op, left, right)
  }
  if (at('#')) {
    var op = match()
    var right = parseExp1()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp1() {
  var left = parseExp2()
  while (at('&&')) {
    var op = match()
    var right = parseExp2()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp2() {
  var left = parseExp3()
  if (at(['<', '<=', '==', '~=', '!=', '>=', '>', 'is'])) {
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
  while (at(['*','/', '%'])) {
    op = match()
    right = parseExp5()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp5() {
  var left = parseExp6()
  while (at(['**', '-**'])) {
    op = match()
    right = parseExp6()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp6() {
  if (at(['~!','~?'])) {
    op = match()
    operand = parseExp7()
    return new UnaryExpression(op, operand)
  } else {
    return parseExp7()
  }
}

function parseExp7() {
  if (at(['!'])) {
    op = match()
    operand = parseExp8()
    return new UnaryExpression(op, operand)
  } else {
    return parseExp8()
  }
}

function parseExp8() {
  if (at('undefined')) {
    return new UndefinedLiteral(match())
  } else if (at('null')) {
    return new NullLiteral(match())
  } else if (at('BOOLIT')) {
    return new BooleanLiteral(match())
  } else if (at('STRLIT')) {
    return new StringLiteral(match())
  } else if (at('NUMLIT')) {
    return new NumericLiteral(match())
  } else if (at('ID')) {
    return parseVar()
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

function next(symbol) {
  if (tokens.length === 1) {
    return false
  } else if (Array.isArray(symbol)) {
    return symbol.some(function (s) {return next(s)})
  } else {
    return symbol === tokens[1].kind
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