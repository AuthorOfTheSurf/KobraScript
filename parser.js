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
var Fn = require('./entities/function')
var Declaration = require('./entities/declaration')
var Property = require('./entities/property')
var AssignmentStatement = require('./entities/assignmentstatement')
var IncrementStatement = require('./entities/incrementstatement')
var ConditionalStatement = require('./entities/conditionalstatement')
var Conditional = require('./entities/conditional')
var ForStatement = require('./entities/forstatement')
var WhileStatement = require('./entities/whilestatement')
var SayStatement = require('./entities/saystatement')
var ReturnStatement = require('./entities/returnstatement')
var BreakStatement = require('./entities/breakstatement')
var ContinueStatement = require('./entities/continuestatement')
var Construction = require('./entities/construction')
var ExchangeStatement = require('./entities/exchangestatement')
var Params = require('./entities/params')
var UnaryExpression = require('./entities/unaryexpression')
var BinaryExpression = require('./entities/binaryexpression')
var BasicVar = require('./entities/basicvar')
var IndexVar = require('./entities/indexvar')
var DottedVar = require('./entities/dottedvar')
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
  } while (at(['$',',','ID','for','while','if','fn','proc','++','--','return','say','break','continue']))
  return new Block(statements)
}

function parseBlueprint() {
  var has = [],
      does = [],
      syn = [];

  match('blueprint')
  var blueid = parseBasicVar()
  var params = parseParams()
  match(':')

  match(['@','has'])
  if (at('ID')) {
    has.push(parsePropertyStatement())
    while (at(',')) {
      match()
      has.push(parsePropertyStatement())
    }
  }

  match(['@','does'])
  if (at('ID')) {
    does.push(parsePropertyStatement())
    while (at(',')) {
      match()
      does.push(parsePropertyStatement())
    }
  }
  
  while(at('@')) synergize()
  
  match('defcc')

  function synergize () {
    match(['@','syn',':'])
    var synthesis = {}
        synthesis.branch = match('ID').lexeme
        synthesis.leaf = []
    if (at('ID')) {
      synthesis.leaf.push(parsePropertyStatement())
      while (at(',')) {
        match()
        synthesis.leaf.push(parsePropertyStatement())
      }
    }
    syn.push(synthesis)
  }

  return new Blueprint(blueid, params, has, does, syn)
}

function parseStatement() {
  if (at(['$',','])) {
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
  } else if(at('say')) {
    return parseSayStatement()
  } else if (at('return')) {
    return parseReturnStatement()
  } else if (at('break')) {
    return parseBreakStatement()
  } else if (at('continue')) {
    return parseContinueStatement()
  } else {
    error('Statement expected', tokens[0])
  }
}

function parseVariableDeclaration() {
  if (at(['$',','])) match()
  var name = parseBasicVar()
  if (at('=')) {
    match()
    var initializer
    if (at(['fn','proc'])) {
      initializer = parseFn()
    } else if (at(['{','[','construct'])) {
      initializer = parseValue()
    } else {
      initializer = parseExpression()
    }
    return new Declaration(name, initializer)
  } else if (at(',')) {
    return new Declaration(name, new UndefinedLiteral())
  }
}

function parseAssignmentStatement() {
  var target = parseVar()
  match('=')
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

function parsePropertyStatement() {
  var name = parseBasicVar()
  match(':')
  var initializer
  if (at(',')) {
    return new Property(name, new UndefinedLiteral())
  } else if (at(['fn','proc'])) {
    initializer = parseFn()
  } else if (at(['{','[','construct'])) {
    initializer = parseValue()
  } else {
    initializer = parseExpression()
  }
  return new Property(name, initializer)
  
}

function parseUseOfVar() {
  var name = parseVar()
  if (at(':=:')) {
    match()
    var right = parseValue()
    return new ExchangeStatement(name, right)
  } else if (at('=')) {
    match()
    var value = parseExpression()
    return new AssignmentStatement(name, value)
  } else {
    return name
  }
}

function parseBasicVar () {
  return new BasicVar(match('ID').lexeme)
}

function parseDottedVar (struct) {
  match('.')
  return new DottedVar(struct.name, match('ID').lexeme)
}

function parseIndexVar (array) {
  match('[')
  var indexVar = new IndexVar(array.name, parseExpression())
  match(']')
  return indexVar
}

function parseFnCall (fn) {
  return new Call(fn.name, parseArgs())
}

function parseVar() {
  function gather (base) {
    if (at('.')) {
      return parseDottedVar(base)
    } else if (at('[')) {
      return parseIndexVar(base)
    } else if (at('(')) {
      return parseFnCall(base)
    }
  }

  var result = parseBasicVar()
  while (at(['[','.','('])) {
    result = gather(result)
  }
  return result
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
    name = parseBasicVar()
  }
  var params = parseParams()
  match(':')
  var body = parseBlock()
  if (at(['..','end'])) {
    match()
    return new Declaration(name, new Fn(fntype, params, body))
  } else {
    error('Illegal end of function token', tokens[0])
  }
}

function parseParams() {
  match('(')
  var params = []
  if (at('ID')) {
    params.push(parseBasicVar().toString())
  }
  while (at(',')) {
    match()
    params.push(parseBasicVar().toString())
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
    properties.push(parsePropertyStatement())
  }
  while (at(',')) {
    match()
    properties.push(parsePropertyStatement())
  }
  match('}')
  console.log(new ObjectLiteral(properties).toString())
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
    assignments.push(parseAssignmentStatement('='))    
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
  var target,
    increments,
    post = true

  if (at(['++', '--'])) {
    post = false
    increments = at('++')
    match()
    target = parseVar()
  } else {
    target = parseVar()
    increments = at('++')
    match()
  }
  return new IncrementStatement(target, increments, post)
}

function parseReturnStatement() {
  match('return')
  return new ReturnStatement(parseExpression())
}

function parseSayStatement() {
  match('say')
  return new SayStatement(parseExpression())
}

function parseBreakStatement() {
  match('break')
  return new BreakStatement()
}

function parseContinueStatement() {
  match('continue')
  return new ContinueStatement()
}

function parseConstructValue() {
  match('construct')
  var name = match('ID').lexeme
  var args = parseConstructArgs()
  return new Construction(name, args)
}

function parseConditionalStatement() {
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
  while (at(['*','/','%'])) {
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
  }
  return parseExp7()
}

function parseExp7() {
  if (at(['!'])) {
    op = match()
    operand = parseExp8()
    return new UnaryExpression(op, operand)
  }
  return parseExp8()
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