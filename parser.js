/*
 * Parser module
 *
 *   var parse = require('./parser')
 *
 *   var program = parse(tokens)
 */

var scanner              = require('./scanner'),
    error                = require('./error')

var Program              = require('./entities/program'),
    Block                = require('./entities/block'),
    Type                 = require('./entities/type'),
    FnLiteral            = require('./entities/fn-literal'),
    ClosureLiteral       = require('./entities/closure-literal'),
    Declaration          = require('./entities/declaration'),
    Property             = require('./entities/property'),
    ConditionalStatement = require('./entities/conditional-statement'),
    OnlyIfStatement      = require('./entities/only-if-statement')
    Conditional          = require('./entities/conditional'),
    ForStatement         = require('./entities/for-statement'),
    WhileStatement       = require('./entities/while-statement'),
    SayStatement         = require('./entities/say-statement'),
    ReturnStatement      = require('./entities/return-statement'),
    LeaveStatement       = require('./entities/leave-statement'),
    BreakStatement       = require('./entities/break-statement'),
    ContinueStatement    = require('./entities/continue-statement')
    Params               = require('./entities/params'),
    UnaryExpression      = require('./entities/unary-expression'),
    PostUnaryExpression  = require('./entities/post-unary-expression'),
    BinaryExpression     = require('./entities/binary-expression'),
    Name                 = require('./entities/name'),
    IndexVar             = require('./entities/index-var'),
    DottedVar            = require('./entities/dotted-var'),
    Call                 = require('./entities/call'),
    ArrayLiteral         = require('./entities/array-literal'),
    ObjectLiteral        = require('./entities/object-literal'),
    NumericLiteral       = require('./entities/numeric-literal'),
    BooleanLiteral       = require('./entities/boolean-literal'),
    StringLiteral        = require('./entities/string-literal'),
    UndefinedLiteral     = require('./entities/undefined-literal'),
    NullLiteral          = require('./entities/null-literal')

// Parser Globals
var tokens
var dirname

// Used by multiple variable declaration
var continuing = false

module.exports = function (scanner_output, filename, dir) {
  dirname = dir
  tokens = scanner_output
  var program = parseProgram()
  return program
}

function parseProgram() {
  if (at('EOF')) {
    error('KobraScript programs may not be empty')
  }

  var initialBlock = new Block(parseStatements())
  match('EOF')

  return new Program(initialBlock)
}

function parseBlock() {
  var statements = []
  if (at('->')) {
    match()
    statements.push(parseStatement())
  } else {
    match(':')
    statements = parseStatements()
    if (at(['end','..'])) {
      match()
    } else {
      error('expected end or ..')
    }
  }
  return new Block(statements)
}

function parseStatements() {
  var statements = []
  do {
    statements.push(parseStatement())
  } while (shouldParseStatement())
  return statements
}

function shouldParseStatement() {
  var statementStartingToken = [
    '$', '..', ',', 'ID', 'for', 'while', 'if', 'only', 'fn', 'close',
    '++', '--', 'return', 'leave', 'say', 'loge', 'break', 'continue'
  ]
  if (!continuing && at('..')) {
    return false
  } else {
    return at(statementStartingToken)
  }
}

function parseStatement() {
  if (at(['$',',','..'])) {
    return parseDeclaration()
  } else if (at('fn')) {
    return parseFnDeclarationStatement()
  } else if (at('while')) {
    return parseWhileStatement()
  } else if (at('if')) {
    return parseConditionalStatement()
  } else if (at('only')) {
    return parseOnlyIfStatement()
  } else if (at('for')) {
    return parseForStatement()
  } else if (at(['say','loge'])) {
    return parseSayStatement()
  } else if (at('return')) {
    return parseReturnStatement()
  } else if (at('leave')) {
    return parseLeaveStatement()
  } else if (at('break')) {
    return parseBreakStatement()
  } else if (at('continue')) {
    return parseContinueStatement()
  } else {
    return parseExpression()
  }
}

function parseDeclaration() {
  continuing = false
  if (at(['$',',','..'])) {
    match()
  }
  var name = parseName()
  if (at('=')) {
    match()
    var initializer = parseExpression()
    continuing = at([',','..'])
    return new Declaration(name, initializer)
  } else if (at([',','..'])) {
    continuing = true
    return new Declaration(name, new UndefinedLiteral())
  } else {
    continuing = false
    return new Declaration(name, new UndefinedLiteral())
  }
}

function parsePropertyStatement() {
  var name = parseName()
  match(':')
  if (at(',')) {
    return new Property(name, new UndefinedLiteral())
  } else {
    var initializer = parseExpression()
    return new Property(name, initializer)
  }
}

function parseName () {
  var name = match('ID')
  if (name) {
    return new Name(name.lexeme)
  } else {
    error('invalid token')
  }
}

function parseFnLiteral() {
  var fntype = match('fn')
  var name

  if (!at('(')) {
    name = parseName()
  }
  var params = parseParams()
  var body = parseBlock()
  return new FnLiteral(fntype, name, params, body)
}

function parseClosureLiteral() {
  match('close')
  match('{')
  var args = []

  if (at('ID')) {
    args.push(parseName())

    while (at(',')) {
      match()
      args.push(parseName())
    }
  }
  match('}')
  var body = parseBlock()
  return new ClosureLiteral(args, body)
}

function parseFnDeclarationStatement() {
  var fntype = match()
  var name = parseName()
  var params = parseParams()
  var body = parseBlock()
  return new Declaration(name, new FnLiteral(fntype, name, params, body))
}

function parseParams() {
  match('(')
  var params = []
  if (at('ID')) {
    params.push(parseName())
  }
  while (at(',')) {
    match()
    params.push(parseName())
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

function parseArrayLiteral() {
  var elements = []
  match('[')
  if (!at(']')) {
    elements.push(parseExpression())
  }
  while (at(',')) {
    match()
    elements.push(parseExpression())
  }
  match(']')
  return new ArrayLiteral(elements)
}

function parseObjectLiteral() {
  var properties = []
  match('{')
  if (at('ID')) {
    properties.push(parsePropertyStatement())
  }
  while (at(',')) {
    match()
    properties.push(parsePropertyStatement())
  }
  match('}')
  return new ObjectLiteral(properties)
}

function parseWhileStatement() {
  match('while')
  match('(')
  var condition = parseExpression()
  match(')')
  var body = parseBlock()
  return new WhileStatement(condition, body)
}

function parseForStatement() {
  match('for')
  match('(')
  var assignments = []
  if (at('$')) {
    assignments.push(parseDeclaration())
    while (at([',','..'])) {
      continuing = true
      assignments.push(parseDeclaration())
    }
    continuing = false
  } else if (!at(';')) {
    assignments.push(parseExpression())
    while (at(',')) {
      match()
      assignments.push(parseExpression())
    }
  }
  match(';')
  var condition = parseExpression()
  match(';')
  var after = []
  after.push(parseExpression())
  while (at(',')) {
    match()
    after.push(parseExpression())
  }
  match(')')
  var body = parseBlock()
  return new ForStatement(assignments, condition, after, body)
}

function parseReturnStatement() {
  match('return')
  var expression = parseExpression()
  return new ReturnStatement(expression)
}

function parseLeaveStatement() {
  match('leave')
  return new LeaveStatement()
}

function parseSayStatement() {
  match()
  var expression = parseExpression()
  return new SayStatement(expression)
}

function parseBreakStatement() {
  match('break')
  return new BreakStatement()
}

function parseContinueStatement() {
  match('continue')
  return new ContinueStatement()
}

function parseConditionalClause() {
  match('(')
  var condition = parseExpression()
  match(')')
  var action = parseBlock()
  return new Conditional(condition, action)
}

function parseConditionalStatement() {
  var conditionals = []
  var elseBlock

  match('if')
  conditionals.push(parseConditionalClause())

  while (at('else') && next('if')) {
    match(['else','if'])
    conditionals.push(parseConditionalClause())
  }

  if (at('else')) {
    match()
    elseBlock = parseBlock()
  }
  return new ConditionalStatement(conditionals, elseBlock)
}

function parseOnlyIfStatement() {
  match(['only'])
  var action = parseBlock()
  match(['if','('])
  var condition = parseExpression()
  match(')')
  var defaultAct = null
  if (at('else')) {
    match()
    defaultAct = parseBlock()
  }
  var conditional = new Conditional(condition, action)
  return new OnlyIfStatement(conditional, defaultAct)
}

function parseExpression() {
  var left = parseExp0()
  while (at(['=','+=','-=','*=','/=','%=',':=:'])) {
    var op = match()
    var right = parseExp0()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp0() {
  if (at(['!','++','--'])) {
    var left = parseExp7()
  } else {
    var left = parseExp1()
  }
  while (at('||')) {
    var op = match()
    var right = parseExp0()
    left = new BinaryExpression(op, left, right)
  }
  if (at('#')) {
    var op = match()
    var right = parseExp0()
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
  if (at(['==', '~=', '!=', 'is'])) {
    var op = match()
    var right = parseExp3()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp3() {
  var left = parseExp4()
  if (at(['<', '<=', '!=', '>=', '>'])) {
    var op = match()
    var right = parseExp4()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp4() {
  var left = parseExp5()
  while (at(['+','-'])) {
    var op = match()
    var right = parseExp5()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp5() {
  var left = parseExp6()
  while (at(['*','/','%'])) {
    op = match()
    right = parseExp6()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp6() {
  var left = parseExp7()
  while (at(['**', '-**'])) {
    op = match()
    right = parseExp7()
    left = new BinaryExpression(op, left, right)
  }
  return left
}

function parseExp7() {
  if (at(['~!','~?'])) {
    op = match()
    operand = parseExp8()
    var left = new UnaryExpression(op, operand)
  } else {
    left = parseExp8()
  }
  return left
}

/* Prefix unary expressions */
function parseExp8() {
  if (at(['!','++','--','new'])) {
    var op = match()
    var operand = parseExp9()
    var left = new UnaryExpression(op, operand)
  } else {
    left = parseExp9()
  }
  return left
}

/* Postfix unary expressions */
function parseExp9() {
  var left = parseExpRoot()
  while (at(['.','[','('])) {
    if (at('.')) {
      match()
      left = new DottedVar(left, parseName())
    } else if (at('[')) {
      match('[')
      left = new IndexVar(left, parseExpression())
      match(']')
    } else {
      left = new Call(left, parseArgs())
    }
  }
  if (at(['++','--'])) {
    var op = match()
    left = new PostUnaryExpression(op, left)
  }
  return left
}

function parseExpRoot() {
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
    return parseName()
  } else if (at('fn')) {
    return parseFnLiteral()
  } else if (at('close')) {
    return parseClosureLiteral()
  } else if (at('[')) {
    return parseArrayLiteral()
  } else if (at('{')) {
    return parseObjectLiteral()
  } else if (at('(')) {
    match('(')
    var expression = parseExpression()
    match(')')
    return expression
  } else if (at('EOF')) {
    return
  } else {
    error('Expected expression start but found ' + JSON.stringify(tokens[0]))
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
  } else if (Array.isArray(symbol)) {
    symbol.forEach(function (token) {
      match(token)
    })
  } else if (symbol === undefined || symbol === tokens[0].kind) {
    return tokens.shift()
  } else {
    error('Expected ' + symbol + ' but found ' + tokens[0].kind, tokens[0])
  }
}
