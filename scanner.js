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

module.exports = function (filename, callback) {
    var baseStream = fs.createReadStream(filename, {encoding: 'utf8'})
    baseStream.on('error', function (err) {error(err)})

    var stream = byline(baseStream, {keepEmptyLines: true}),
        tokens = [],
        linenumber = 0;

    stream.on('readable', function () {
        scan(stream.read(), ++linenumber, tokens)
    })
    stream.once('end', function () {
        tokens.push({kind: 'EOF', lexeme: 'EOF'})
        callback(tokens)
    })
}

var multiLine = false

function scan(line, linenumber, tokens) {
    if (!line) return

    var start, 
        pos = 0,
        threeCharTokens = /\-\*\*|:=:|\.\.\.|\-\-\-|\!\-\-/,
        twoCharTokens = /<=|==|>=|\!=|\*\*|~=|is|&&|\|\||~\?|~\!|\.\.|\+\+|\-\-|\*=|\/=|-=|\+=/,
        oneCharTokens = /[\!\+\-\%\?\*\/\(\),:;=<>\|\$\{\}\#\.\[\]@]/,
        definedTokens = /^(?:bit|int|float|bool|str|undefined|null|fn|return|construct|blueprint|has|does|syn|defcc|if|else|do|while|for|switch|break|continue|case|try|catch|finally|throw|function|instanceof|var|void|with|end|proc|say|loge)$/,
        numericLit = /(?:[1-9]\d*|0)(?:.\d+)?(?:[eE][+-]?\d+)?/,
        booleanLit = /^(?:true|false)$/,
        oneCharEscapeChars = /[bfnrtv0\"\']/,
        controlEscapeChars = /c[a-zA-z]/,
        uniEscapeChars = /u[a-fA-F0-9]{4}/,
        hexEscapeCharacters = /x[a-fA-F0-9]{2}/,

        emit = function (kind, lexeme, isEmpty) {
            if (isEmpty) {
                tokens.push({kind: kind, lexeme: '', line: linenumber, col: start+1})
            } else {
                tokens.push({kind: kind, lexeme: lexeme || kind, line: linenumber, col: start+1})
            }
        },

        skipSpaces = function () {
            while (/\s/.test(line[pos])) pos++
            start = pos
        }


    while (true) {

        skipSpaces()

        // Nothing on the line
        if (pos >= line.length) break

        // Single-line comments
        if (line[pos] === '>' && line[pos+1] === '>') break
        
        // Multi-line comments
        if (line[pos] === '>' && line[pos+1] === '|' && !multiLine) {
            multiLine = true
            break
        }
        if (line[pos] === '|' && line[pos+1] === '<' && multiLine) {
            multiLine = false
            break
        } else if (line[line.length-2] === '|' && line[line.length-1] === '<' && multiLine) {
            multiLine = false
            break
        }
        if (multiLine) {
            break
        }


        // Three-character tokens
        if (threeCharTokens.test(line.substring(pos, pos+3))) {
            emit(line.substring(pos, pos+3))
            pos += 3
            skipSpaces()
        }

        //  Capture for Boolean literals
        var trueTest = line.slice(pos, pos + 4)
        var falseTest = line.slice(pos, pos + 5)

        // Two-character tokens
        if (twoCharTokens.test(line.substring(pos, pos+2))) {
            emit(line.substring(pos, pos+2))
            pos += 2
            while (/\s/.test(line[pos])) pos++
            start = pos
        }

        // String literals
        else if (/[\"\']/.test(line[pos])) {
            var s = [],
                parenCheck = true,
                emptyString = (line[pos+1] === '\"' || line[pos+1] === '\'')
                //  Line continuation? Someday we might.
            //  old regex, needed improvement + refactor
            //  var stringRegex = /[A-Za-z0-9_,.;:\(\)\!\@\#\$\%\^\&\*\<\>\\\?\x20\'\"]/
            //  implemented /.+/ instead
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

        // Boolean literals
        else if (booleanLit.test(trueTest) || booleanLit.test(falseTest)) {
            if (booleanLit.test(trueTest)) {
                emit('BOOLIT', trueTest)
                pos += 4
            } else {
                emit('BOOLIT', falseTest)
                pos += 5
            }
        }

        // Reserved words or identifiers
        else if (/[$A-Za-z]/.test(line[pos])) {
            while (/\w/.test(line[pos]) && pos < line.length) pos++
            var word = line.substring(start, pos)
            if (definedTokens.test(word)) {
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