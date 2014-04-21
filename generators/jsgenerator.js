var util = require('util')
var HashMap = require('hashmap').HashMap

module.exports = function (program) {
  gen(program)  
}

var indentPadding = 4
var indentLevel = 0

function emit(line) {
  var pad = indentPadding * indentLevel;
  console.log(Array(pad+1).join(' ') + line)
}

function makeOp(op) {
  //return {not: '!', and: '&&', or: '||'}[op] || op
  return {'~?': 'typeof'}[op] || op
}

function factorial(n) {
  var f = []
  function factorialHelper (value) {
    if (value == 0 || value == 1) {
      return 1
    }
    if (f[value] > 0) {
      return f[value]
    }
    return f[value] = factorial(value-1) * value
  }
  return factorialHelper(n)
}

var makeVariable = (function () {
  // No need to synchronize because Node is single-threaded
  var lastId = 0;
  var map = new HashMap()
  return function (v) {
    if (!map.has(v)) map.set(v, ++lastId)
    return '_v' + map.get(v)
  }
}())

function gen(e) {
  return generator[e.constructor.name](e)
}

var generator = {

  'Program': function (program) {
    indentLevel = 0
    emit('(function () {')
    gen(program.block)
    emit('}());')
  },

  'Block': function (block) {
    indentLevel++
    block.statements.forEach(function (statement) {
      gen(statement)
    })
    indentLevel--
  },

  'VariableDeclaration': function (v) {
    var initializer = {'int': '0', 'bool': 'false'}[v.type];
    emit(util.format('var %s = %s;', makeVariable(v), initializer))
  },

  'AssignmentStatement': function (s) {
    emit(util.format('%s = %s;', gen(s.target), gen(s.source)))
  },

  'ExchangeStatement': function (s) {
    var a = gen(s.left)
    var b = get(s.right)
    emit(util.format('(function() {var _ = %s; var %s = %s; var %s = _}())', a, a, b, b))
  }

  'ReadStatement': function (s) {
    s.varrefs.forEach(function (v) {
      emit(util.format('%s = prompt();', makeVariable(v.referent)))
    })
  },

  'WriteStatement': function (s) {
    s.expressions.forEach(function (e) {
      emit(util.format('alert(%s);', gen(e)))
    })
  },

  'WhileStatement': function (s) {
    emit('while (' + gen(s.condition) + ') {')
    gen(s.body);
    emit('}');
  },

  'IntegerLiteral': function (literal) {
    return literal.toString()
  },

  'BooleanLiteral': function (literal) {
    return literal.toString()
  },

  'VariableReference': function (v) {
    return makeVariable(v.referent)
  },

  'UnaryExpression': function (e) {
    if (e.op.lexeme == '~!') {
      //Do factorial here
    } else {
      return util.format('(%s %s)', makeOp(e.op.lexeme), gen(e.operand))
    }
  },

  'BinaryExpression': function (e) {
    return util.format('(%s %s %s)', gen(e.left), makeOp(e.op.lexeme), gen(e.right))
  }
}
