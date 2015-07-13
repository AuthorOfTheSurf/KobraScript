//  To run this test make sure Mocha is installed.
//  Command (run in root directory):
//  sudo npm install -g mocha

var should = require('should');
var scan = require('../scanner')
var error = require('../error')
var i = require('util').inspect

//  Removes error messages for Mocha testing.
error.quiet = false

// Template for token checking.
// i(tokens[]).should.equal(i())

describe('The scanner', function () {
  //  hello-world.ks
  it('scans the simplest program', function (done) {
    var x = 0
    scan('test/kobra-code/good-programs/hello-world.ks', function (tokens) {
      i(tokens[x++]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'hello',line:1,col:3}))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line:1,col:9}))
      i(tokens[x++]).should.equal(i({kind:'STRLIT',lexeme:'Hello, world!',line:1,col:11}))
      i(tokens[x++]).should.equal(i({kind:'say',lexeme:'say',line:2,col:1}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'hello',line:2,col:5}))
      i(tokens[x++]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
      done()
    })
  })

  it('reads the exchange statement', function (done) {
    var x = 0
    scan('test/kobra-code/good-programs/exchangestatement.ks', function (tokens) {
      i(tokens[x++]).should.equal(i({kind:'$',lexeme:'$',line: 5, col: 1 }))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'a',line: 5, col: 3 }))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line: 5, col: 5 }))
      i(tokens[x++]).should.equal(i({kind:'NUMLIT',lexeme:'10',line: 5, col: 7 }))

      i(tokens[x++]).should.equal(i({kind:'..',lexeme:'..',line: 6, col: 1 }))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'b',line: 6, col: 4 }))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line: 6, col: 6 }))
      i(tokens[x++]).should.equal(i({kind:'NUMLIT',lexeme:'30',line: 6, col: 8 }))

      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'b',line: 8, col: 1 }))
      i(tokens[x++]).should.equal(i({kind:':=:',lexeme:':=:',line: 8, col: 3 }))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'a',line: 8, col: 7 }))


      i(tokens[x++]).should.equal(i({"kind":"loge","lexeme":"loge","line":10,"col":1}))
      i(tokens[x++]).should.equal(i({"kind":"ID","lexeme":"a","line":10,"col":6}))
      i(tokens[x++]).should.equal(i({"kind":"loge","lexeme":"loge","line":11,"col":1}))
      i(tokens[x++]).should.equal(i({"kind":"ID","lexeme":"b","line":11,"col":6}))

      i(tokens[x++]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
      done()
    })
  })

  it('reads vardecs and increments correctly', function (done) {
    var x = 0
    scan('test/kobra-code/good-programs/increments.ks', function (tokens) {
      i(tokens[x++]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'i',line:1,col:3}))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line:1,col:5}))
      i(tokens[x++]).should.equal(i({kind:'NUMLIT',lexeme:'0',line:1,col:7}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:1,col:8}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'j',line:2,col:3}))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line:2,col:5}))
      i(tokens[x++]).should.equal(i({kind:'NUMLIT',lexeme:'0',line:2,col:7}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'i',line:4,col:1}))
      i(tokens[x++]).should.equal(i({kind:'++',lexeme:'++',line:4,col:2}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'i',line:5,col:1}))
      i(tokens[x++]).should.equal(i({kind:'--',lexeme:'--',line:5,col:2}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'j',line:6,col:1}))
      i(tokens[x++]).should.equal(i({kind:'++',lexeme:'++',line:6,col:2}))
      i(tokens[x++]).should.equal(i({kind:'++',lexeme:'++',line:7,col:1}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'j',line:7,col:3}))
      i(tokens[x++]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
      done()
    })
  })

  //  object.ks
  it('reads our new object syntax', function (done) {
    var x = 0
    scan('test/kobra-code/good-programs/object.ks', function (tokens) {
      i(tokens[x++]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'bicycle',line:1,col:3}))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line:1,col:11}))
      i(tokens[x++]).should.equal(i({kind:'{',lexeme:'{',line:1,col:13}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'frame',line:2,col:5}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:2,col:10}))
      i(tokens[x++]).should.equal(i({kind:'STRLIT',lexeme:'aluminum',line:2,col:12}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:2,col:22}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'year',line:3,col:5}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:3,col:9}))
      i(tokens[x++]).should.equal(i({kind:'NUMLIT',lexeme:'2009',line:3,col:11}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:3,col:15}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'gears',line:4,col:5}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:4,col:10}))
      i(tokens[x++]).should.equal(i({kind:'NUMLIT',lexeme:'10',line:4,col:12}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:4,col:14}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'speed',line:5,col:5}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:5,col:10}))
      i(tokens[x++]).should.equal(i({kind:'NUMLIT',lexeme:'12.7',line:5,col:12}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:5,col:16}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'carbonFiber',line:6,col:5}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:6,col:16}))
      i(tokens[x++]).should.equal(i({kind:'BOOLIT',lexeme:'true',line:6,col:18}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:6,col:22}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'extraParts',line:7,col:5}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:7,col:15}))
      i(tokens[x++]).should.equal(i({kind:'[',lexeme:'[',line:7,col:17}))
      i(tokens[x++]).should.equal(i({kind:'STRLIT',lexeme:'speedometer',line:7,col:18}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:7,col:31}))
      i(tokens[x++]).should.equal(i({kind:'STRLIT',lexeme:'light',line:7,col:33}))
      i(tokens[x++]).should.equal(i({kind:']',lexeme:']',line:7,col:40}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:7,col:41}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'move',line:9,col:5}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:9,col:9}))
      i(tokens[x++]).should.equal(i({kind:'fn',lexeme:'fn',line:9,col:11}))
      i(tokens[x++]).should.equal(i({kind:'(',lexeme:'(',line:9,col:16}))
      i(tokens[x++]).should.equal(i({kind:')',lexeme:')',line:9,col:17}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:9,col:18}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'Transform',line:10,col:9}))
      i(tokens[x++]).should.equal(i({kind:'.',lexeme:'.',line:10,col:18}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'translate',line:10,col:19}))
      i(tokens[x++]).should.equal(i({kind:'(',lexeme:'(',line:10,col:28}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'FORWARD',line:10,col:29}))
      i(tokens[x++]).should.equal(i({kind:'*',lexeme:'*',line:10,col:37}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'this',line:10,col:39}))
      i(tokens[x++]).should.equal(i({kind:'.',lexeme:'.',line:10,col:43}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'speed',line:10,col:44}))
      i(tokens[x++]).should.equal(i({kind:')',lexeme:')',line:10,col:49}))
      i(tokens[x++]).should.equal(i({kind:'end',lexeme:'end',line:11,col:5}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:11,col:8}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'upgrade_speed',line:12,col:5}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:12,col:18}))
      i(tokens[x++]).should.equal(i({kind:'fn',lexeme:'fn',line:12,col:20}))
      i(tokens[x++]).should.equal(i({kind:'(',lexeme:'(',line:12,col:23}))
      i(tokens[x++]).should.equal(i({kind:')',lexeme:')',line:12,col:24}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:12,col:25}))
      i(tokens[x++]).should.equal(i({kind:'return',lexeme:'return',line:13,col:9}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'this',line:13,col:16}))
      i(tokens[x++]).should.equal(i({kind:'.',lexeme:'.',line:13,col:20}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'speed',line:13,col:21}))
      i(tokens[x++]).should.equal(i({kind:'*',lexeme:'*',line:13,col:27}))
      i(tokens[x++]).should.equal(i({kind:'NUMLIT',lexeme:'1.1',line:13,col:29}))
      i(tokens[x++]).should.equal(i({kind:'end',lexeme:'end',line:14,col:5}))
      i(tokens[x++]).should.equal(i({kind:',',lexeme:',',line:14,col:8}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'get_frame',line:15,col:5}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:15,col:14}))
      i(tokens[x++]).should.equal(i({kind:'fn',lexeme:'fn',line:15,col:16}))
      i(tokens[x++]).should.equal(i({kind:'(',lexeme:'(',line:15,col:19}))
      i(tokens[x++]).should.equal(i({kind:')',lexeme:')',line:15,col:20}))
      i(tokens[x++]).should.equal(i({kind:':',lexeme:':',line:15,col:21}))
      i(tokens[x++]).should.equal(i({kind:'return',lexeme:'return',line:15,col:23}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'this',line:15,col:30}))
      i(tokens[x++]).should.equal(i({kind:'.',lexeme:'.',line:15,col:34}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'frame',line:15,col:35}))
      i(tokens[x++]).should.equal(i({kind:'end',lexeme:'end',line:15,col:41}))
      i(tokens[x++]).should.equal(i({kind:'}',lexeme:'}',line:16,col:1}))
      i(tokens[x++]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
      done()
    })
  })

  it('reads escape characters properly', function (done) {
    var x = 0
    scan('test/kobra-code/good-programs/escape-characters.ks', function (tokens) {
      i(tokens[x++]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'a',line:1,col:3}))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line:1,col:5}))
      //  In output, an escape of escape will show.
      i(tokens[x++]).should.equal(i({kind:'STRLIT',lexeme:'derp \\u0040 herp',line:1,col:7}))
      i(tokens[x++]).should.equal(i({kind:'$',lexeme:'$',line:2,col:1}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'b',line:2,col:3}))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line:2,col:5}))
      i(tokens[x++]).should.equal(i({kind:'STRLIT',lexeme:'derp \\x01 herp',line:2,col:7}))
      i(tokens[x++]).should.equal(i({kind:'$',lexeme:'$',line:3,col:1}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'c',line:3,col:3}))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line:3,col:5}))
      i(tokens[x++]).should.equal(i({kind:'STRLIT',lexeme:'derp \\n herp',line:3,col:7}))
      i(tokens[x++]).should.equal(i({kind:'$',lexeme:'$',line:4,col:1}))
      i(tokens[x++]).should.equal(i({kind:'ID',lexeme:'d',line:4,col:3}))
      i(tokens[x++]).should.equal(i({kind:'=',lexeme:'=',line:4,col:5}))
      i(tokens[x++]).should.equal(i({kind:'STRLIT',lexeme:'derp \\x20 herp',line:4,col:7}))
      i(tokens[x++]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
      done()
    })
  })

})
