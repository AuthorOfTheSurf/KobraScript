var should = require('should');
var scan = require('../scanner')
var error = require('../error')
var i = require('util').inspect

describe('The scanner', function () {
    //  hello-world.ks
    it('scans the simplest program.', function (done) {
        scan('../kobra-code/good-programs/hello-world.ks', function (tokens) {
            //tokens.length.should.equal(4)
            i(tokens[0]).should.equal(i({kind:'$',lexeme:'$',line:1,col:1}))
            i(tokens[1]).should.equal(i({kind:'ID',lexeme:'hello',line:1,col:3}))
            i(tokens[2]).should.equal(i({kind:'=',lexeme:'=',line:1,col:9}))
            i(tokens[3]).should.equal(i({kind:'"',lexeme:'"',line:1,col:11}))
            //  String token needs to be finished here.
            i(tokens[4]).should.equal(i({kind:'',lexeme:'',line:,col:}))
            //  End incomplete.
            i(tokens[5]).should.equal(i({kind:'"',lexeme:'"',line:1,col:29}))
            i(tokens[6]).should.equal(i({kind:'ID',lexeme:'say',line:2,col:1}))
            i(tokens[7]).should.equal(i({kind:'(',lexeme:'(',line:2,col:4}))
            i(tokens[8]).should.equal(i({kind:'ID',lexeme:'hello',line:2,col:5}))
            i(tokens[9]).should.equal(i({kind:')',lexeme:')',line:2,col:11}))
            i(tokens[10]).should.equal(i({kind:'EOF',lexeme:'EOF'}))
            done()
        })
    })
})