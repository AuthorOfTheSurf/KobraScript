const scan = require("../scanner");
const error = require("../error");
const { inspect } = require("util");
const Token = require("../token");

error.quiet = false;

describe("The scanner", () => {
  it("scans the simplest program", (done) => {
    const expectedTokens = [
      { kind: "$", lexeme: "$", line: 1, col: 1 },
      { kind: "ID", lexeme: "hello", line: 1, col: 3 },
      { kind: "=", lexeme: "=", line: 1, col: 9 },
      { kind: "STRLIT", lexeme: "Hello, world!", line: 1, col: 11 },
      { kind: "say", lexeme: "say", line: 2, col: 1 },
      { kind: "ID", lexeme: "hello", line: 2, col: 5 },
      { kind: "EOF", lexeme: "EOF" },
    ].map(data => new Token(data));
    scan("test/kobra-code/good-programs/hello-world.ks", (tokens) => {
      tokens.forEach((token, i) => {
        inspect(token).should.equal(inspect(expectedTokens[i]));
      });
      done();
    });
  });

  it("reads the exchange statement", (done) => {
    const expectedTokens = [
      { kind: "$", lexeme: "$", line: 5, col: 1 },
      { kind: "ID", lexeme: "a", line: 5, col: 3 },
      { kind: "=", lexeme: "=", line: 5, col: 5 },
      { kind: "NUMLIT", lexeme: "10", line: 5, col: 7 },
      { kind: "..", lexeme: "..", line: 6, col: 1 },
      { kind: "ID", lexeme: "b", line: 6, col: 4 },
      { kind: "=", lexeme: "=", line: 6, col: 6 },
      { kind: "NUMLIT", lexeme: "30", line: 6, col: 8 },
      { kind: "ID", lexeme: "b", line: 8, col: 1 },
      { kind: ":=:", lexeme: ":=:", line: 8, col: 3 },
      { kind: "ID", lexeme: "a", line: 8, col: 7 },
      { kind: "loge", lexeme: "loge", line: 10, col: 1 },
      { kind: "ID", lexeme: "a", line: 10, col: 6 },
      { kind: "loge", lexeme: "loge", line: 11, col: 1 },
      { kind: "ID", lexeme: "b", line: 11, col: 6 },
      { kind: "EOF", lexeme: "EOF" },
    ].map(data => new Token(data));
    scan("test/kobra-code/good-programs/exchangestatement.ks", (tokens) => {
      tokens.forEach((token, i) => {
        inspect(token).should.equal(inspect(expectedTokens[i]));
      });
      done();
    });
  });

  it("reads vardecs and increments correctly", (done) => {
    const expectedTokens = [
      { kind: "$", lexeme: "$", line: 1, col: 1 },
      { kind: "ID", lexeme: "i", line: 1, col: 3 },
      { kind: "=", lexeme: "=", line: 1, col: 5 },
      { kind: "NUMLIT", lexeme: "0", line: 1, col: 7 },
      { kind: ",", lexeme: ",", line: 1, col: 8 },
      { kind: "ID", lexeme: "j", line: 2, col: 3 },
      { kind: "=", lexeme: "=", line: 2, col: 5 },
      { kind: "NUMLIT", lexeme: "0", line: 2, col: 7 },
      { kind: "ID", lexeme: "i", line: 4, col: 1 },
      { kind: "++", lexeme: "++", line: 4, col: 2 },
      { kind: "ID", lexeme: "i", line: 5, col: 1 },
      { kind: "--", lexeme: "--", line: 5, col: 2 },
      { kind: "ID", lexeme: "j", line: 6, col: 1 },
      { kind: "++", lexeme: "++", line: 6, col: 2 },
      { kind: "++", lexeme: "++", line: 7, col: 1 },
      { kind: "ID", lexeme: "j", line: 7, col: 3 },
      { kind: "EOF", lexeme: "EOF" },
    ].map(data => new Token(data));
    scan("test/kobra-code/good-programs/increments.ks", (tokens) => {
      tokens.forEach((token, i) => {
        inspect(token).should.equal(inspect(expectedTokens[i]));
      });
      done();
    });
  });

  it("reads our new object syntax", (done) => {
    const expectedTokens = [
      { kind: "$", lexeme: "$", line: 1, col: 1 },
      { kind: "ID", lexeme: "bicycle", line: 1, col: 3 },
      { kind: "=", lexeme: "=", line: 1, col: 11 },
      { kind: "{", lexeme: "{", line: 1, col: 13 },
      { kind: "ID", lexeme: "frame", line: 2, col: 5 },
      { kind: ":", lexeme: ":", line: 2, col: 10 },
      { kind: "STRLIT", lexeme: "aluminum", line: 2, col: 12 },
      { kind: ",", lexeme: ",", line: 2, col: 22 },
      { kind: "ID", lexeme: "year", line: 3, col: 5 },
      { kind: ":", lexeme: ":", line: 3, col: 9 },
      { kind: "NUMLIT", lexeme: "2009", line: 3, col: 11 },
      { kind: ",", lexeme: ",", line: 3, col: 15 },
      { kind: "ID", lexeme: "gears", line: 4, col: 5 },
      { kind: ":", lexeme: ":", line: 4, col: 10 },
      { kind: "NUMLIT", lexeme: "10", line: 4, col: 12 },
      { kind: ",", lexeme: ",", line: 4, col: 14 },
      { kind: "ID", lexeme: "speed", line: 5, col: 5 },
      { kind: ":", lexeme: ":", line: 5, col: 10 },
      { kind: "NUMLIT", lexeme: "12.7", line: 5, col: 12 },
      { kind: ",", lexeme: ",", line: 5, col: 16 },
      { kind: "ID", lexeme: "carbonFiber", line: 6, col: 5 },
      { kind: ":", lexeme: ":", line: 6, col: 16 },
      { kind: "BOOLIT", lexeme: "true", line: 6, col: 18 },
      { kind: ",", lexeme: ",", line: 6, col: 22 },
      { kind: "ID", lexeme: "extraParts", line: 7, col: 5 },
      { kind: ":", lexeme: ":", line: 7, col: 15 },
      { kind: "[", lexeme: "[", line: 7, col: 17 },
      { kind: "STRLIT", lexeme: "speedometer", line: 7, col: 18 },
      { kind: ",", lexeme: ",", line: 7, col: 31 },
      { kind: "STRLIT", lexeme: "light", line: 7, col: 33 },
      { kind: "]", lexeme: "]", line: 7, col: 40 },
      { kind: ",", lexeme: ",", line: 7, col: 41 },
      { kind: "ID", lexeme: "move", line: 9, col: 5 },
      { kind: ":", lexeme: ":", line: 9, col: 9 },
      { kind: "fn", lexeme: "fn", line: 9, col: 11 },
      { kind: "(", lexeme: "(", line: 9, col: 16 },
      { kind: ")", lexeme: ")", line: 9, col: 17 },
      { kind: ":", lexeme: ":", line: 9, col: 18 },
      { kind: "ID", lexeme: "Transform", line: 10, col: 9 },
      { kind: ".", lexeme: ".", line: 10, col: 18 },
      { kind: "ID", lexeme: "translate", line: 10, col: 19 },
      { kind: "(", lexeme: "(", line: 10, col: 28 },
      { kind: "ID", lexeme: "FORWARD", line: 10, col: 29 },
      { kind: "*", lexeme: "*", line: 10, col: 37 },
      { kind: "ID", lexeme: "this", line: 10, col: 39 },
      { kind: ".", lexeme: ".", line: 10, col: 43 },
      { kind: "ID", lexeme: "speed", line: 10, col: 44 },
      { kind: ")", lexeme: ")", line: 10, col: 49 },
      { kind: "end", lexeme: "end", line: 11, col: 5 },
      { kind: ",", lexeme: ",", line: 11, col: 8 },
      { kind: "ID", lexeme: "upgrade_speed", line: 12, col: 5 },
      { kind: ":", lexeme: ":", line: 12, col: 18 },
      { kind: "fn", lexeme: "fn", line: 12, col: 20 },
      { kind: "(", lexeme: "(", line: 12, col: 23 },
      { kind: ")", lexeme: ")", line: 12, col: 24 },
      { kind: ":", lexeme: ":", line: 12, col: 25 },
      { kind: "return", lexeme: "return", line: 13, col: 9 },
      { kind: "ID", lexeme: "this", line: 13, col: 16 },
      { kind: ".", lexeme: ".", line: 13, col: 20 },
      { kind: "ID", lexeme: "speed", line: 13, col: 21 },
      { kind: "*", lexeme: "*", line: 13, col: 27 },
      { kind: "NUMLIT", lexeme: "1.1", line: 13, col: 29 },
      { kind: "end", lexeme: "end", line: 14, col: 5 },
      { kind: ",", lexeme: ",", line: 14, col: 8 },
      { kind: "ID", lexeme: "get_frame", line: 15, col: 5 },
      { kind: ":", lexeme: ":", line: 15, col: 14 },
      { kind: "fn", lexeme: "fn", line: 15, col: 16 },
      { kind: "(", lexeme: "(", line: 15, col: 19 },
      { kind: ")", lexeme: ")", line: 15, col: 20 },
      { kind: ":", lexeme: ":", line: 15, col: 21 },
      { kind: "return", lexeme: "return", line: 15, col: 23 },
      { kind: "ID", lexeme: "this", line: 15, col: 30 },
      { kind: ".", lexeme: ".", line: 15, col: 34 },
      { kind: "ID", lexeme: "frame", line: 15, col: 35 },
      { kind: "end", lexeme: "end", line: 15, col: 41 },
      { kind: "}", lexeme: "}", line: 16, col: 1 },
      { kind: "EOF", lexeme: "EOF" },
    ].map(data => new Token(data));
    scan("test/kobra-code/good-programs/object.ks", (tokens) => {
      tokens.forEach((token, i) => {
        inspect(token).should.equal(inspect(expectedTokens[i]));
      });
      done();
    });
  });

  it("reads escape characters properly", (done) => {
    const expectedTokens = [
      { kind: "$", lexeme: "$", line: 1, col: 1 },
      { kind: "ID", lexeme: "a", line: 1, col: 3 },
      { kind: "=", lexeme: "=", line: 1, col: 5 },
      { kind: "STRLIT", lexeme: "derp \\u0040 herp", line: 1, col: 7 },
      { kind: "$", lexeme: "$", line: 2, col: 1 },
      { kind: "ID", lexeme: "b", line: 2, col: 3 },
      { kind: "=", lexeme: "=", line: 2, col: 5 },
      { kind: "STRLIT", lexeme: "derp \\x01 herp", line: 2, col: 7 },
      { kind: "$", lexeme: "$", line: 3, col: 1 },
      { kind: "ID", lexeme: "c", line: 3, col: 3 },
      { kind: "=", lexeme: "=", line: 3, col: 5 },
      { kind: "STRLIT", lexeme: "derp \\n herp", line: 3, col: 7 },
      { kind: "$", lexeme: "$", line: 4, col: 1 },
      { kind: "ID", lexeme: "d", line: 4, col: 3 },
      { kind: "=", lexeme: "=", line: 4, col: 5 },
      { kind: "STRLIT", lexeme: "derp \\x20 herp", line: 4, col: 7 },
      { kind: "EOF", lexeme: "EOF" },
    ].map(data => new Token(data));
    scan("test/kobra-code/good-programs/escape-characters.ks", (tokens) => {
      tokens.forEach((token, i) => {
        inspect(token).should.equal(inspect(expectedTokens[i]));
      });
      done();
    });
  });
});
