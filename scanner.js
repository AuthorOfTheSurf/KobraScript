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

function scan(line, linenumber, tokens) {
    if (!line) return

    var start, 
        pos = 0,
        threeCharTokens = /-**|:=:|end|---|!---/,
        twoCharTokens = /<=|==|>=|!=|\/\/|**
                        |~=|is|in|&&|\|\||~?
                        |~!|\.\./,
        oneCharTokens = /[!+-*\/(),:;=<>]/,
        definedTokens = /^(?:bit|int|float|bool|str|undefined|null|true|false
                        |fn|bitfn|intfn|floatfn|boolfn|strfn|return|
                        |blueprint|has|does|synget|synset|defcc|this
                        |$|if|else if|else|do|while|for|switch|break|case|try|catch|finally|throw
                        |function|instanceof|var|void|with)$/,
        emit = function (kind, lexeme) {
            tokens.push({kind: kind, lexeme: lexeme || kind, line: linenumber, col: start+1})
        };


    while (true) {
        // Skip spaces
        while (/\s/.test(line[pos])) pos++
        start = pos

        // Nothing on the line
        if (pos >= line.length) break

        // Comment
        if (line[pos] == '-' && line[pos+1] == '-') break

        // three-character tokens
        if (threeCharTokens.test(line.substring(pos, pos+3))) {
            emit(line.substring(pos, pos+3))
            pos += 3s
        }

        // Two-character tokens
        if (twoCharTokens.test(line.substring(pos, pos+2))) {
            emit(line.substring(pos, pos+2))
            pos += 2
        }

        // One-character tokens
        else if (oneCharTokens.test(line[pos])) {
           emit(line[pos++])
        }

        // Reserved words or identifiers
        else if (/[A-Za-z]/.test(line[pos])) {
            while (/\w/.test(line[pos]) && pos < line.length) pos++
            var word = line.substring(start, pos)
            if (definedTokens.test(word)) {
                emit(word)
            } else {
                emit('ID', word)
            }
        }

        // Numeric literals
        else if (/\d/.test(line[pos])) {
          while (/\d/.test(line[pos])) pos++
          emit('INTLIT', line.substring(start, pos))
        }
        
        // All else
        else {
          error('Illegal character: ' + line[pos], {line: linenumber, col: pos+1})
          pos++
        }
    }
}
