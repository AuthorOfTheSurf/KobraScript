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
    '~?': 'typeof ',
    '==': '===',
    '!=': '!==',
    '~=': '==',
    '#': '||'
  }[op] || op
}

var makeIntoVariable = (function () {
  // No need to synchronize because Node is single-threaded
  var lastId = 0;
  var map = new HashMap()

  return function (declaration) {
    var varname = declaration.name

    if (!map.has(varname)) {
      map.set(varname, ++lastId)
    }
    return '_v' + map.get(varname)
  }
}())

function gen(ent) {
  return generator[ent.constructor.name](ent)
}

function genExp(ent) {
  emit(generator[ent.constructor.name](ent) + ';')
}

var generator = {

  'Program': function (ent) {
    indentLevel = 0
    emit('(function () {')
    gen(ent.block)
    emit('}());')
  },

  'Blueprint': function (ent) {

    /*var parameterList = []
      ent.initializer.params.params.forEach(function (parameter) {
        parameterList.push(makeIntoVariable(parameter))
    })
    var blueprint = util.format('var %s = function(%s) {', makeIntoVariable(ent.blueid), parameterList.join(', '))
    blueprint = blueprint.concat(util.format('var %s = {};', makeIntoVariable(ent.blueid)))
    blueprint = blueprint.concat(util.format('var %s = {};', makeIntoVariable(hasVar)))
    ent.has.forEach(function (property) {
      blueprint = blueprint.concat(util.format('%s.%s = %s;', makeIntoVariable(property.name), gen(ent.initializer)))
    })
    ent.does.forEach(function (property) {
      blueprint = blueprint.concat(util.format('%s.%s = function () {', makeIntoVariable(ent.blueid), makeIntoVariable(property.name)))
      blueprint = blueprint.concat(gen(property.initializer.body))
      blueprint = blueprint.concat('};')
    }
    ent.syn.forEach(function (synGroup) {
      blueprint = blueprint.concat(util.format('%s.%s = {', makeIntoVariable(blueid), makeIntoVariable(synGroup.branch)))
      synGroup.forEach(function (property) {
        blueprint = blueprint.concat(gen(property))
      })
      blueprint = blueprint.concat('};')
    })
    return blueprint */
  },

  'Block': function (ent) {
    indentLevel++
    ent.statements.forEach(function (statement) {
      var kind = statement.constructor.name
      if (  kind === 'UnaryExpression' || kind === 'PostUnaryExpression' || kind === 'BinaryExpression'
         || kind === 'BasicVar' || kind === 'IndexVar' || kind === 'DottedVar' || kind === 'Call') {
        genExp(statement)
      } else {
        gen(statement)
      }
    })
    indentLevel--
  },

  'Declaration': function (ent) {
    if (ent.initializer.constructor.name !== 'Fn') {
      emit(util.format('var %s = %s;', makeIntoVariable(ent), gen(ent.initializer)))
    } else {
      var parameterList = []
      ent.initializer.params.params.forEach(function (parameter) {
        parameterList.push(makeIntoVariable(parameter))
      })
      emit(util.format('var %s = function (%s) {', makeIntoVariable(ent), parameterList.join(', ')))
      gen(ent.initializer.body)
      emit('};')
    }
  },

  'Property': function (ent) {
    return util.format('%s: %s', makeIntoVariable(ent), gen(ent.initializer))
  },

  'AnonRunFn': function (ent) {
    var arglist = []
    ent.args.forEach(function(arg) {
      arglist.push(gen(arg))
    })
    emit(util.format('(function (%s) {', arglist.join(', ')))
    gen(ent.body)
    emit(util.format("}(%s));", arglist.join(', ')))
  },

  'ConditionalStatement': function (ent) {
    for (var i = 0; i < ent.conditionals.length; i++) {
      if (i === 0) {
        emit(conditionalPrint('if', ent.conditionals[0]))
        gen(ent.conditionals[0].body)
        emit('}')
      }
      else {
        emit(conditionalPrint('else if', ent.conditionals[i]))
        gen(ent.conditionals[i].body)
        emit('}')
      }
    }
    if (ent.defaultAct) {
      emit(conditionalPrint('else', null))
      gen(ent.defaultAct)
      emit('}')
    }

    function conditionalPrint(kind, c) {
      var result = kind + ' '
      if (c != null) {
        result = result.concat('(' + gen(c.condition) + ') {')
      } else {
        result = result.concat('{')
      }

      return result
    }
  },

  'OnlyIfStatement': function (ent) {
    emit('if (' + gen(ent.conditional.condition) + ') {')
    gen(ent.conditional.body)
    emit('}')
    if (ent.defaultAct) {
      emit('else {')
      gen(ent.defaultAct)
      emit('}')
    }
  },

  'ForStatement': function (ent) {
    var assignments = (ent.assignments[0].constructor.name === 'Declaration') ? 'var ' : ''
    for (var i = 0; i < ent.assignments.length; i++) {
      if (!i) {
        /* If Declaration, makeIntoVariable(ent) to add it to the name map */
        if (ent.assignments[i].constructor.name === 'Declaration') {
          assignments = assignments.concat(util.format('%s = %s', makeIntoVariable(ent.assignments[i]), gen(ent.assignments[i].initializer)))
        } else {
          assignments = assignments.concat(gen(ent.assignments[i]))
        }
      } else {
        if (ent.assignments[i].constructor.name === 'Declaration') {
          assignments = assignments.concat(util.format(', %s = %s', makeIntoVariable(ent.assignments[i]), gen(ent.assignments[i].initializer)))
        } else {
          assignments = assignments.concat(', ' + gen(ent.assignments[i]))
        }
      }
    }

    var after = ''
    for (var i = 0; i < ent.after.length; i++) {
      if (!i) {
        after = after.concat(gen(ent.after[i]))
      } else {
        after = after.concat(', ' + gen(ent.after[i]))
      }
    }
    emit(util.format('for (%s; %s; %s) {',
      assignments,
      gen(ent.condition),
      after)
    )
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

  'UnaryExpression': function (ent) {
    if (ent.op.lexeme == '~!') {
      var factorialFunction = 'function __factorial(n){var f=[];function factorialHelper(value){if(value==0||value==1){return 1;}if(f[value]>0){return f[value];}return f[value]=factorial(value-1)*value;}return factorialHelper(n);}'
      emit(util.format('%s', factorialFunction))
      emit(util.format("__factorial(%s)"), gen(ent.operand))
    } else {
      return util.format('%s%s', makeOp(ent.op.lexeme), gen(ent.operand))
    }
  },

  'PostUnaryExpression': function (ent) {
    return util.format('%s%s', gen(ent.operand), makeOp(ent.op.lexeme))
  },

  'BinaryExpression': function (ent) {
    if (ent.op.lexeme === '**') {
      return util.format('Math.pow(%s,%s)', makeIntoVariable(ent.left.referent), makeIntoVariable(ent.right.referent))
    } else if (ent.op.lexeme === '-**') {
      return util.format('((1.0)/Math.pow(%s,%s))', makeIntoVariable(ent.left.referent), makeIntoVariable(ent.right.referent))
    } else if (ent.op.lexeme === 'is') {
      return util.format('(typeof %s === typeof %s)', makeIntoVariable(ent.left.referent), makeIntoVariable(ent.right.referent))
    } else if (ent.op.lexeme === ':=:') {
      // Way we do it: http://stackoverflow.com/questions/16201656/how-to-swap-two-variables-in-javascript
      var a = gen(ent.left)
      var b = gen(ent.right)
      return util.format('%s = [%s, %s = %s][0]', b, a, a, b)
    } else {
      return util.format('(%s %s %s)', gen(ent.left), makeOp(ent.op.lexeme), gen(ent.right))
    }
  },

  'BasicVar': function (ent) {
    if (ent.referent.constructor.name === 'EnvironmentEntity') {
      return ent.referent.name
    } else {
      return makeIntoVariable(ent.referent)
    }
  },

  'IndexVar': function (ent) {
    return util.format('%s[%s]', gen(ent.array), gen(ent.index))
  },

  'DottedVar': function (ent) {
    return util.format('%s.%s', gen(ent.struct), gen(ent.property))
  },

  'Call': function (ent) {
    var params = []
    ent.args.forEach(function (arg) {
      params.push(gen(arg))
    });
    return util.format('%s(%s)', gen(ent.fn), params.join(', '))
  },

  'ArrayLiteral': function (ent) {
    return util.format('[%s]', ent.elements.join(', '))
  },

  'ObjectLiteral': function (ent) {
    var result = '{\n'
    var length = ent.properties.length
    if (length) {
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
  }

}
