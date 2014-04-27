var util = require('util')
var HashMap = require('hashmap').HashMap

module.exports = function (program) {
  gen(program)  
}

var indentPadding = 4
var indentLevel = 0

function emit (line) {
  console.log(pad(line))
}

function pad (line) {
  return Array(((indentPadding * indentLevel)+1)).join(' ') + line
}

function padExtra (line) {
  return Array(((indentPadding * (indentLevel + 1))+1)).join(' ') + line
}

function makeOp(op) {
  return {
    '~?': 'typeof', 
    '==': '===',
    '!=': '!==',
    '~=': '==',
    '#': '||'
  }[op] || op
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

function gen(ent) {
  return generator[ent.constructor.name](ent)
}

var generator = {

  'Program': function (ent) {
    indentLevel = 0
    emit('(function () {')
    gen(ent.block)
    emit('}());')
  },

  'Blueprint': function (ent) {
    // TODO
  },

  'Block': function (ent) {
    indentLevel++
    ent.statements.forEach(function (statement) {
      gen(statement)
    })
    indentLevel--
  },

  'Declaration': function (ent) {
    if (ent.initializer.constructor.name !== 'Fn') {
      emit(util.format('var %s = %s;', makeVariable(ent), gen(ent.initializer)))
    } else {
      var parameterList = []
      ent.initializer.params.params.forEach(function (parameter) {
        parameterList.push(makeVariable(parameter))
      })
      emit(util.format('var %s = function (%s) {', makeVariable(ent), parameterList.join(', ')))
      gen(ent.initializer.body)
      emit('};')
    }
  },

  'Property': function (ent) {
    return util.format('%s: %s', makeVariable(ent), gen(ent.initializer))
  },

  'AssignmentStatement': function (ent) {
    emit(util.format('%s = %s;', gen(ent.target), gen(ent.source)))
  },

  'MathChangeAssignment': function (ent) {
    emit(util.format('%s %s %s', gen(ent.target), ent.op.lexeme, ent.magnitude.lexeme))
  },

  'IncrementStatement': function (ent) {
    if (ent.isIncrement && ent.post) {
      return ent.target + '++'
    } else if (!ent.isIncrement && ent.post){
      return ent.target + '--'
    } else if (ent.isIncrement && !ent.post) {
      return '++' + ent.target
    } else {
      return '--' + ent.target
    }
  },

  'ConditionalStatement': function (ent) {
    for (var i = 0; i < ent.conditionals.length; i++) {
      if (i === 0) {
        emit(conditionalPrint('if', ent.conditionals[0]))
      }
      else {
        emit(conditionalPrint('else if', ent.conditionals[i]))
      }
    }
    if (ent.defaultAct) {
      emit(conditionalPrint('else', ent.defaultAct))
    }

    function conditionalPrint(kind, c) {
      var result = kind + ' '
      result = result.concat('(' + gen(c.condition) + ') {\n')
      result = result.concat(gen(c.body))
      result = result.concat('\n}')
      return result
    }
  },

  'ForStatement': function (ent) {
    emit(util.format('for (%s; %s; %s) {',
      gen(ent.assignments),
      gen(ent.condition),
      gen(ent.after)))
    gen(ent.body)
    emit('}')
  },

  'WhileStatement': function (ent) {
    emit('while (' + gen(ent.condition) + ') {')
    gen(ent.body)
    emit('}')
  },

  'SayStatement': function (ent) {
    emit(util.format('console.log(%s);', gen(ent.target)))
  },

  'ReturnStatement': function (ent) {
    emit('return ' + gen(ent.expression) + ';')
  },

  'BreakStatement': function (ent) {
    emit('break;')
  },

  'ContinueStatement': function(ent) {
    emit('continue;')
  },

  'Construction': function(ent) {
    emit(util.format('var %s = new %s(%s);', makeVariable(ent.blueid), ent.join(', ')))
  },

  'ExchangeStatement': function (ent) {
    // Way we do it: http://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript
    var a = makeVariable(ent.left.referent)
    var b = makeVariable(ent.right.referent)
    emit(util.format('%s = [%s, %s = %s][0];', b, a, a, b))
  },

  'UnaryExpression': function (ent) {
    if (ent.op.lexeme == '~!') {
      var factorialFunction = 'function __factorial(n){var f=[];function factorialHelper(value){if(value==0||value==1){return 1;}if(f[value]>0){return f[value];}return f[value]=factorial(value-1)*value;}return factorialHelper(n);}'
      emit(util.format('%s', factorialFunction))
      emit(util.format("__factorial(%s)"), gen(ent.operand))
    } else {
      emit(util.format('(%s %s)', makeOp(ent.op.lexeme), gen(ent.operand)))
    }
  },

  'BinaryExpression': function (ent) {
    if (ent.op.lexeme === '**') {
      return util.format('Math.pow(%s,%s)', makeVariable(ent.left.referent), makeVariable(ent.right.referent))
    } else if (ent.op.lexeme === '-**') {
      return util.format('((1.0)/Math.pow(%s,%s))', makeVariable(ent.left.referent), makeVariable(ent.right.referent))
    } else if (ent.op.lexeme === 'is') {
      return util.format('(typeof %s === typeof %s)', makeVariable(ent.left.referent), makeVariable(ent.right.referent))
    } else {
      return util.format('(%s %s %s)', gen(ent.left), makeOp(ent.op.lexeme), gen(ent.right))
    }
  },

  'BasicVar': function (ent) {
    emit(util.format('%s', makeVariable(ent.name)))
  },

  'IndexVar': function (ent) {
    emit(util.format('[%s]', ent.index))
  },

  'DottedVar': function (ent) {
    emit(util.format('.%s', ent.property))
  },

  'Call': function (ent) {
    emit('(%s)', ent.args.join(', '))
  },

  'ArrayLiteral': function (ent) {
    emit(util.format('[%s];', ent.elements.join(', ')))
  },

  'ObjectLiteral': function (ent) {
    var result = '{\n'
    var length = ent.properties.length
    if (ent.properties) {
      result = result.concat(padExtra(gen(ent.properties[0])))
      if (length > 1) {
        for (var i = 1; i < length; i++) {
          result = result.concat(',\n' + padExtra(gen(ent.properties[i])))
        }
      }
    }
    return result + '\n    }'
  },

  'NumericLiteral': function (ent) {
    return ent.toString()
  },

  'BooleanLiteral': function (ent) {
    return ent.toString()
  },

  'StringLiteral': function (ent) {
    return ent.toString()
  },

  'UndefinedLiteral': function(ent) {
    return ent.toString()
  },

  'NullLiteral': function(ent) {
    return ent.toString()
  },

  'BasicVar': function (ent) {
    return makeVariable(ent.referent)
  }
}
