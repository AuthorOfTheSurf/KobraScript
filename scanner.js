/*
 * Scanner module
 *
 *   var scan = require('./scanner')
 *
 *   scan(filename, function (tokens) {processTheTokens(tokens)})
 */

var fs = require('fs')
var byline = require('byline')
var error = require('./error')
var Token = require('./token')

module.exports = function (filename, callback) {
  var baseStream = fs.createReadStream(filename, {encoding: 'utf8'})
  baseStream.on('error', function (err) {error(err)})

  var stream = byline(baseStream, {keepEmptyLines: true})
  var tokens = []
  var linenumber = 0

  stream.on('readable', function () {
    scan(stream.read(), ++linenumber, tokens)
  })
  stream.once('end', function () {
    tokens.push(new Token({ kind: "EOF", lexeme: "EOF" }));
    callback(tokens)
  })
}

function scan(line, linenumber, tokens) {
  if (!line) return

  var start
  var pos = 0
  var threeCharTokens = /\-\*\*|:=:|\.\.\.|\-\-\-|\!\-\-/
  var twoCharTokens = /<=|==|>=|\!=|\*\*|~=|&&|\|\||~\?|~\!|\.\.|\+\+|\-\-|\*=|\/=|\%=|-=|\+=|\->|is/
  var oneCharTokens = /[\!\+\-\%\?\*\/\(\),:;=<>\|\$\{\}\#\.\[\]@]/
  var definedTokens = new RegExp([
    "^(?:",
    "undefined|null|fn|close|return|leave|if|else|only|do|while|for",
    "|break|continue|new|case|end|say|loge|_hidden|__factorial",
    ")$"].join(''))
  var bannedTokens = new RegExp([
    "^(?:",
    "var|void|with|instanceof|function|try|catch|finally|throw|switch",
    ")$"].join(''))
  var numericLit = /(?:[1-9]\d*|0)(?:.\d+)?(?:[eE][+-]?\d+)?/
  var oneCharEscapeChars = /[bfnrtv0\"\']/
  var controlEscapeChars = /c[a-zA-z]/
  var uniEscapeChars = /u[a-fA-F0-9]{4}/
  var hexEscapeCharacters = /x[a-fA-F0-9]{2}/
  var emit = function (kind, lexeme, isEmpty) {
    if (isEmpty) {
      tokens.push(new Token({
        kind: kind,
        lexeme: '',
        line: linenumber,
        col: start + 1
      }))
    } else {
      tokens.push(new Token({
        kind: kind,
        lexeme: lexeme || kind,
        line: linenumber,
        col: start + 1
      }))
    }
  }
  var at = function(lexeme) {
    var chunk = line.slice(pos, pos + lexeme.length)
    return chunk === lexeme
  }

  var skipSpaces = function () {
    while (/\s/.test(line[pos])) pos++
    start = pos
  }

  while (true) {
    skipSpaces()

    // Nothing on the line
    if (pos >= line.length) break

    // Single-line comments
    if (line[pos] === '/' && line[pos+1] === '/') break

    // Three-character tokens
    if (threeCharTokens.test(line.substring(pos, pos+3))) {
      emit(line.substring(pos, pos+3))
      pos += 3
      skipSpaces()
    }

    // Check for literals that start at this position
    var atTrue = at('true')
    var atFalse = at('false')
    var atNull = at('null')
    var atUndefined = at('undefined')

    // Two-character tokens
    if (twoCharTokens.test(line.substring(pos, pos+2))) {
      emit(line.substring(pos, pos+2))
      pos += 2
      while (/\s/.test(line[pos])) pos++
      start = pos
    }

    // String literals
    else if (/[\"\']/.test(line[pos])) {
      var s = []
      var parenCheck = true
      var emptyString = (line[pos+1] === '\"' || line[pos+1] === '\'')

      while (/.+/.test(line[++pos]) && pos < line.length && parenCheck) {

        //  Checks for escape characters
        //  Link below helped immensely:
        //  http://mathiasbynens.be/notes/javascript-escapes
        if (line[pos] === '\\') {
          s = s.concat(line[pos])
          if (oneCharEscapeChars.test(line.substring(pos+1, pos+2))) {
            s = s.concat(line.substring(pos+1, pos+2))
            pos++
          } else if (controlEscapeChars.test(line.substring(pos+1, pos+3))) {
            // Convert control characters to Unicode for successful compilation.
            var controlChar = line.substring(pos+1, pos+3)
            // This next line will determine unicode index we need for equivalent Unicode character.
            var unicodeIndex = controlChar.charAt(1).toLowerCase().charCodeAt(0) - 96
            var hexIndex = unicodeIndex.toString(16)
            if (unicodeIndex < 16) {
              s = s.concat('x0' + hexIndex)
            } else {
              s = s.concat('x' + hexIndex)
            }
            pos += 2 // this remains same even though we are adding extra char in target lang.
          } else if (hexEscapeCharacters.test(line.substring(pos+1, pos+4))) {
            s = s.concat(line.substring(pos+1, pos+4))
            pos += 3
          } else if (uniEscapeChars.test(line.substring(pos+1, pos+6))) {
            s = s.concat(line.substring(pos+1, pos+6))
            pos += 5
          } else {
            pos++
          }
        } else if (emptyString) {
          parenCheck = false;
          emit('STRLIT', "", true)
        } else if (line[pos] === '\"' || line[pos] === '\'') {
          parenCheck = false;
          emit('STRLIT', s.join(''))
        } else {
          s = s.concat(line[pos])
        }
      }
    }

    // Numeric literals
    else if (/[\d\-]/.test(line[pos])) {
      var number = []
      if (/\-/.test(line[pos])) number.push(line[pos++])
      while (/[\d]/.test(line[pos])) {
        number.push(line[pos++])
      }
      if (/\./.test(line[pos]) && /[\d]/.test(line[pos+1])) {
        number.push(line[pos++])
        while (/[\d]/.test(line[pos])) {
          number.push(line[pos++])
        }
      }
      if (/[eE]/.test(line[pos]) && /[\d\-]/.test(line[pos+1])) {
        number.push(line[pos++])
        if (/\-/.test(line[pos])) number.push(line[pos++])
        while (/[\d]/.test(line[pos])) {
          number.push(line[pos++])
        }
      }

      number = number.join('')
      if (numericLit.test(number)) {
        emit('NUMLIT', number)
      }
      //  Check for '-' if not used as part of NUMLITS.
      if (/\-/.test(number) && !numericLit.test(number)) emit(number, number)
    }

    // One-character tokens
    else if (oneCharTokens.test(line[pos])) {
      emit(line[pos++])
    }

    // Literals
    else if (atTrue) {
      var lexeme = 'true'
      emit('BOOLIT', lexeme)
      pos += lexeme.length
    }
    else if (atFalse) {
      var lexeme = 'false'
      emit('BOOLIT', lexeme)
      pos += lexeme.length
    }
    else if (atNull) {
      var lexeme = 'null'
      emit('NULLLIT', lexeme)
      pos += lexeme.length
    }
    else if (atUndefined) {
      var lexeme = 'undefined'
      emit('UNDEFINEDLIT', lexeme)
      pos += lexeme.length
    }

    // Reserved words or identifiers
    else if (/[$A-Za-z]/.test(line[pos])) {
      while (/\w/.test(line[pos]) && pos < line.length) {
        pos++
      }

      var word = line.substring(start, pos)

      if (bannedTokens.test(word)) {
        error('Illegal token \'' + word + '\'', {line: linenumber, col: pos+1})
      } else if (definedTokens.test(word)) {
        emit(word)
      } else {
        emit('ID', word)
      }
    }

    // All else
    else {
      error('Illegal character: ' + line[pos], {line: linenumber, col: pos+1})
      pos++
    }
  }
}
