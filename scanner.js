require("apprequire")(__dirname);
const fs = require("fs");
const byline = require("byline");

const error = appRequire("error");
const Token = appRequire("token");

const scan = function(line, linenumber, tokens) {
  if (!line) {
    return;
  }

  let start = 0;
  let pos = 0;
  const threeCharTokens = /-\*\*|:=:|\.\.\.|---|!--/;
  const twoCharTokens = /<=|==|>=|!=|\*\*|~=|&&|\|\||~\?|~!|\.\.|\+\+|--|\*=|\/=|%=|-=|\+=|->|is/;
  const oneCharTokens = /[!+\-%*?\\/(),:;=<>|${}#.[\]@]/;
  const definedTokens = new RegExp([
    "^(?:",
    "undefined|null|fn|close|return|leave|if|else|only|do|while|for",
    "|break|continue|new|case|end|say|loge|_hidden|__factorial",
    ")$",
  ].join(""));
  const bannedTokens = new RegExp([
    "^(?:",
    "var|void|with|instanceof|function|try|catch|finally|throw|switch",
    ")$",
  ].join(""));
  const numericLit = /(?:[1-9]\d*|0)(?:.\d+)?(?:[eE][+-]?\d+)?/;
  const oneCharEscapeChars = /[bfnrtv0"']/;
  const controlEscapeChars = /c[a-zA-z]/;
  const uniEscapeChars = /u[a-fA-F0-9]{4}/;
  const hexEscapeCharacters = /x[a-fA-F0-9]{2}/;
  const emit = function(kind, lexeme, isEmpty) {
    if (isEmpty) {
      tokens.push(new Token({
        kind,
        lexeme: "",
        line: linenumber,
        col: start + 1,
      }));
    } else {
      tokens.push(new Token({
        kind,
        lexeme: lexeme || kind,
        line: linenumber,
        col: start + 1,
      }));
    }
  };

  const at = function(lexeme) {
    const chunk = line.slice(pos, pos + lexeme.length);
    return chunk === lexeme;
  };

  const skipSpaces = function() {
    while (/\s/.test(line[pos])) {
      pos += 1;
    }
    start = pos;
  };

  while (true) {
    skipSpaces();
    // Nothing on the line
    if (pos >= line.length) {
      break;
    }
    // Single-line comments
    if (line[pos] === "/" && line[pos + 1] === "/") {
      break;
    }
    // Three-character tokens
    if (threeCharTokens.test(line.substring(pos, pos + 3))) {
      emit(line.substring(pos, pos + 3));
      pos += 3;
      skipSpaces();
    }
    // Check for literals that start at this position
    const atTrue = at("true");
    const atFalse = at("false");
    const atNull = at("null");
    const atUndefined = at("undefined");
    // Two-character tokens
    if (twoCharTokens.test(line.substring(pos, pos + 2))) {
      emit(line.substring(pos, pos + 2));
      pos += 2;
      while (/\s/.test(line[pos])) {
        pos += 1;
      }
      start = pos;
    } else if (/["']/.test(line[pos])) {
      // String literals
      let s = [];
      let parenCheck = true;
      const emptyString = (line[pos + 1] === "\"" || line[pos + 1] === "'");

      while (/.+/.test(line[++pos]) && pos < line.length && parenCheck) { // eslint-disable-line no-plusplus
        //  Checks for escape characters
        //  Link below helped immensely:
        //  http://mathiasbynens.be/notes/javascript-escapes
        if (line[pos] === "\\") {
          s = s.concat(line[pos]);
          if (oneCharEscapeChars.test(line.substring(pos + 1, pos + 2))) {
            s = s.concat(line.substring(pos + 1, pos + 2));
            pos += 1;
          } else if (controlEscapeChars.test(line.substring(pos + 1, pos + 3))) {
            // Convert control characters to Unicode for successful compilation.
            const controlChar = line.substring(pos + 1, pos + 3);
            // This next line will determine unicode index we need for equivalent Unicode character.
            const unicodeIndex = controlChar.charAt(1).toLowerCase().charCodeAt(0) - 96;
            const hexIndex = unicodeIndex.toString(16);
            if (unicodeIndex < 16) {
              s = s.concat(`x0${hexIndex}`);
            } else {
              s = s.concat(`x${hexIndex}`);
            }
            pos += 2; // this remains same even though we are adding extra char in target lang.
          } else if (hexEscapeCharacters.test(line.substring(pos + 1, pos + 4))) {
            s = s.concat(line.substring(pos + 1, pos + 4));
            pos += 3;
          } else if (uniEscapeChars.test(line.substring(pos + 1, pos + 6))) {
            s = s.concat(line.substring(pos + 1, pos + 6));
            pos += 5;
          } else {
            pos += 1;
          }
        } else if (emptyString) {
          parenCheck = false;
          emit("STRLIT", "", true);
        } else if (line[pos] === "\"" || line[pos] === "'") {
          parenCheck = false;
          emit("STRLIT", s.join(""));
        } else {
          s = s.concat(line[pos]);
        }
      }
    } else if (/[\d-]/.test(line[pos])) {
      // Numeric literals
      let number = [];
      if (/-/.test(line[pos])) {
        number.push(line[pos]);
        pos += 1;
      }

      while (/[\d]/.test(line[pos])) {
        number.push(line[pos]);
        pos += 1;
      }

      if (/\./.test(line[pos]) && /[\d]/.test(line[pos + 1])) {
        number.push(line[pos]);
        pos += 1;
        while (/[\d]/.test(line[pos])) {
          number.push(line[pos]);
          pos += 1;
        }
      }

      if (/[eE]/.test(line[pos]) && /[\d-]/.test(line[pos + 1])) {
        number.push(line[pos]);
        pos += 1;
        if (/-/.test(line[pos])) {
          number.push(line[pos]);
          pos += 1;
        }

        while (/[\d]/.test(line[pos])) {
          number.push(line[pos]);
          pos += 1;
        }
      }

      number = number.join("");
      if (numericLit.test(number)) {
        emit("NUMLIT", number);
      }
      //  Check for '-' if not used as part of NUMLITS.
      if (/-/.test(number) && !numericLit.test(number)) {
        emit(number, number);
      }
    } else if (oneCharTokens.test(line[pos])) {
      // One-character tokens
      emit(line[pos]);
      pos += 1;
    } else if (atTrue) {
      // Literals
      const lexeme = "true";
      emit("BOOLIT", lexeme);
      pos += lexeme.length;
    } else if (atFalse) {
      const lexeme = "false";
      emit("BOOLIT", lexeme);
      pos += lexeme.length;
    } else if (atNull) {
      const lexeme = "null";
      emit("NULLLIT", lexeme);
      pos += lexeme.length;
    } else if (atUndefined) {
      const lexeme = "undefined";
      emit("UNDEFINEDLIT", lexeme);
      pos += lexeme.length;
    } else if (/[$A-Za-z]/.test(line[pos])) {
      // Reserved words or identifiers
      while (/\w/.test(line[pos]) && pos < line.length) {
        pos += 1;
      }

      const word = line.substring(start, pos);

      if (bannedTokens.test(word)) {
        error(`Illegal token '${word}'`, { line: linenumber, col: pos + 1 });
      } else if (definedTokens.test(word)) {
        emit(word);
      } else {
        emit("ID", word);
      }
    } else {
      // All else
      error(`Illegal character: ${line[pos]}`, { line: linenumber, col: pos + 1 });
      pos += 1;
    }
  }
};

module.exports = function(filename, callback) {
  const baseStream = fs.createReadStream(filename, { encoding: "utf8" });
  baseStream.on("error", err => error(err));

  const stream = byline(baseStream, { keepEmptyLines: true });
  const tokens = [];
  let lineNumber = 0;

  stream.on("readable", () => {
    lineNumber += 1;
    scan(stream.read(), lineNumber, tokens);
  });
  stream.once("end", () => {
    tokens.push(new Token({ kind: "EOF", lexeme: "EOF" }));
    callback(tokens);
  });
};
