/*var should = require('should')
var scan = require('../scanner')
var parse = require('../parser')
var error = require('../error')

//  Kobrascript File Parse Checking

function checkForParseErrors(check, baseFilename) {
  it(check, function (done) {
    scan('test/kobra-code/bad-programs/' + baseFilename + '.ks', function (tokens) {
      var priorErrorCount = error.count
      parse(tokens);
      (error.count-priorErrorCount).should.be.above(0)
      done()
    })
  })
}

function checkForParseSuccess(check, baseFilename) {
  it(check, function (done) {
    scan('test/kobra-code/good-programs/' + baseFilename + '.ks', function (tokens) {
      var priorErrorCount = error.count
      parse(tokens);
      (error.count-priorErrorCount).should.equal(0)
      done()
    })
  })
}

//  Kobrascript Blueprint Parse Checking

function checkForParseBlueprintErrors(check, baseFilename) {
  it(check, function (done) {
    scan('test/kobra-code/bad-programs/' + baseFilename + '.ksb', function (tokens) {
      var priorErrorCount = error.count
      parse(tokens);
      (error.count-priorErrorCount).should.be.above(0)
      done()
    })
  })
}

function checkForParseBlueprintSuccess(check, baseFilename) {
  it(check, function (done) {
    scan('test/kobra-code/good-programs/' + baseFilename + '.ksb', function (tokens) {
      var priorErrorCount = error.count
      parse(tokens);
      (error.count-priorErrorCount).should.equal(0)
      done()
    })
  })
}

describe('The parser', function () {

  //  Checks that bad programs fail.
  var checksForFail = {
    'detects error at empty program': 'empty',
    'detects errors at start of statement': 'bad-statement',
    'detects incorrect variable declarations': 'vardecwithoutcommas',
    'detected bad expressions in assignments': 'bad-expr-in-assignment',
    'detects a missing end keyword': 'missing-end',
    'detects missing semicolons in for-loops': 'missing-semicolon-in-for',
    'detects unnecessary semicolons': 'semicolon',
    'detects unbalanced parentheses': 'unbalanced-parens',
    'detects multiple relational operators without parentheses': 'multiple-relationals'
  };

  for (var badCheck in checksForFail) {
    if (checksForFail.hasOwnProperty(badCheck)) {
      checkForParseErrors(badCheck, checksForFail[badCheck])
    }
  }

  //  Checks that good programs succeed.
  var checksForSuccess = {
    'detects and parses the most basic thing': 'hello-world',
    'detects an exchange statement': 'exchangestatement',
    'detects a construct statement properly': 'construct',
    'detects escape characters properly': 'escapecharacters',
    'detects functions': 'function',
    'detects and parses an object literal': 'object',
    'removes characters in a classic script': 'remove-char'
  };

  for (var successCheck in checksForSuccess) {
    if (checksForSuccess.hasOwnProperty(successCheck)) {
      checkForParseSuccess(successCheck, checksForSuccess[successCheck])
    }
  }

  //  Checks that bad blueprints fail.
  var checksForBlueprintFail = {
    'detects lack of has': 'NoHas'
  }

  for (var blueprintFailCheck in checksForBlueprintFail) {
    if (checksForBlueprintFail.hasOwnProperty(blueprintFailCheck)) {
      checkForParseBlueprintErrors(blueprintFailCheck, checksForBlueprintFail[blueprintFailCheck])
    }
  }

  //  Checks that good blueprints succeed.
  var checksForBlueprintSuccess = {
    'correctly parses a Blueprint': 'Person'
  }

  for (var blueprintSuccessCheck in checksForBlueprintSuccess) {
    if (checksForBlueprintSuccess.hasOwnProperty(blueprintSuccessCheck)) {
      checkForParseBlueprintSuccess(blueprintSuccessCheck, checksForBlueprintSuccess[blueprintSuccessCheck])
    }
  }

}) */
