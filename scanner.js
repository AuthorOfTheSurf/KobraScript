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
        threeCharTokens = /\-\*\*|:=:|\.\.\.|\-\-\-|\!\-\-/,
        twoCharTokens = /<=|==|>=|\!=|\/\/|\*\*|~=|is|in|&&|\|\||~\?|~\!|\.\./,
        oneCharTokens = /[\!\+\-\*\/\(\),:;=<>\|\$\{\}\#]/,
        definedTokens = /^(?:bit|int|float|bool|str|undefined|null|true|false|fn|bitfn|intfn|floatfn|boolfn|strfn|return|blueprint|has|does|synget|synset|defcc|this|if|else|do|while|for|switch|break|case|try|catch|finally|throw|function|instanceof|var|void|with|end|proc|say)$/,
        numericLit = /-?([1-9]\d*|0)(\.\d+)?([eE][+-]?\d+)?/,

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

        // Three-character tokens
        if (threeCharTokens.test(line.substring(pos, pos+3))) {
            emit(line.substring(pos, pos+3))
            pos += 3
        }

        // Two-character tokens
        if (twoCharTokens.test(line.substring(pos, pos+2))) {
            emit(line.substring(pos, pos+2))
            pos += 2
            while (/\s/.test(line[pos])) pos++
            start = pos
        }


        // String literals
        if (/[\"\']/.test(line[pos])) {
            var s = [],
                parenCheck = true;
            //  regex below needs improvement + refactor
            while (/[A-Za-z0-9_,.;:\(\)\!\@\#\$\%\^\&\*\<\>\\\?\x20\'\"]/.test(line[++pos]) && pos < line.length && parenCheck) {     
                if (line[pos] !== '\"' || line[pos] !== '\'') {
                    s = s.concat(line[pos])
                }
                if (line[pos] === '\"' || line[pos] === '\'') {
                    s.pop();
                    parenCheck = false;
                    emit('STRLIT', s.join(''))
                }
            }
        }

        // Numeric literals (are not working.)
        else if (numericLit.test(line[pos]) || /\-/.test(line[pos])) {
            if (/\-/.test(line[pos])) pos++
            while (numericLit.test(line[pos])) pos++
            emit('NUMLIT', line.substring(start, pos))
        }

        // One-character tokens
        else if (oneCharTokens.test(line[pos])) {
            emit(line[pos++])
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