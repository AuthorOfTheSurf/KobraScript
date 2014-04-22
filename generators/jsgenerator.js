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
  return {'~?': 'typeof', '==': '===', }[op] || op
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

  'Blueprint': function (blueprint) {
    // TODO
  },

  'Block': function (block) {
    indentLevel++
    block.statements.forEach(function (statement) {
      gen(statement)
    })
    indentLevel--
  },

  'Fn': function (f) {
    emit('function (' + f.params.join(', ') + ') {')
    gen(f.body)
    emit('};')
  },

  'VariableDeclaration': function (v) {
    emit(util.format('var %s = %s;', makeVariable(v), initializer))
  },

  'AssignmentStatement': function (s) {
    emit(util.format('%s = %s;', gen(s.target), gen(s.source)))
  },

  'IncrementStatement': function (inc) {
    if (inc.isIncrement && inc.post) {
      return inc.target + '++'
    } else if (!inc.isIncrement && inc.post){
      return inc.target + '--'
    } else if (inc.isIncrement && !inc.post) {
      return '++' + inc.target
    } else {
      return '--' + inc.target
    }
  },

  'ConditionalStatement': function (conditional) {
    for (var i = 0; i < conditional.conditionals.length; i++) {
      if (i === 0) {
        emit(conditionalPrint('if', conditional.conditionals[0]))
      }
      else {
        emit(conditionalPrint('else if', conditional.conditionals[i]))
      }
    }
    if (conditional.defaultAct) {
      emit(conditionalPrint('else', condtitional.defaultAct))
    }

    function conditionalPrint(variant, conditional) {
      var result = ''
      result = result.concat(variant + ' ')
      result = result.concat('(' + gen(conditional.condition) + ') {\n')
      result = result.concat(gen(conditional.block))
      result = result.concat('\n}')
      return result
    }
  },

  'ForStatement': function (s) {
    emit(util.format('for (%s; %s; %s) {', gen(s.assignments), gen(s.condition), gen(s.after)))
    gen(s.body)
    emit('}')
  },

  'WhileStatement': function (s) {
    emit('while (' + gen(s.condition) + ') {')
    gen(s.body)
    emit('}')
  },

  'SayStatement': function (s) {
    emit(util.format('console.log(%s);', gen(s)))
  },

  'ReturnStatement': function (s) {
    // Double check.
    return "return"
  },

  'ContinueStatement': function(s) {
    return "continue;"
  },

  'Construction': function() {
    // TODO
  },

  'ExchangeStatement': function (s) {
    var a = gen(s.left)
    var b = get(s.right)
    emit(util.format('(function() {var _ = %s; var %s = %s; var %s = _}())', a, a, b, b))
  },

  'UnaryExpression': function (e) {
    // So sick. Need to text
    if (e.op.lexeme == '~!') {
      var factorialFunction = 'function __factorial(n){var f=[];function factorialHelper(value){if(value==0||value==1){return 1;}if(f[value]>0){return f[value];}return f[value]=factorial(value-1)*value;}return factorialHelper(n);}'
     emit(util.format('%s', factorialFunction))
     emit(util.format("__factorial(%s)"), gen(e.operand))
    } else {
      return util.format('(%s %s)', makeOp(e.op.lexeme), gen(e.operand))
    }
  },

  'BinaryExpression': function (e) {
    return util.format('(%s %s %s)', gen(e.left), makeOp(e.op.lexeme), gen(e.right))
  },

  'BasicVar': function (variable) {
    // TODO
  },

  'IndexVar': function (variable) {
    // TODO
  },

  'DottedVar': function (variable) {
    // TODO
  },

  'Call': function (call) {
    // TODO
  },

  'ArrayLiteral': function (array) {
    emit(util.format('[%s];', array.join(', ')))
  },

  'ObjectLiteral': function (object) {
    var result = '{'
    var length = object.properties.length
    if (object.properties) {
      result = result.concat(object.properties[0])
      if (length > 1) {
        for (var i = 0; i < length; i++) {
          result = result.concat(',\n' + object.properties[i])
        }
      }
    }
    return result + '\n}'
  },

  'NumericLiteral': function (literal) {
    return literal.toString()
  },

  'BooleanLiteral': function (literal) {
    return literal.toString()
  },

  'StringLiteral': function (literal) {
    return literal.toString()
  },

  'UndefinedLiteral': function(literal) {
    return literal.toString()
  },

  'NullLiteral': function(literal) {
    return literal.toString()
  },

  'VariableReference': function (v) {
    return makeVariable(v.referent)
  }
}
