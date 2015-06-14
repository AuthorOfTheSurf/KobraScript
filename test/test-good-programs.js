var fs = require('fs')
var path = require('path')
var should = require('should')
var scan = require('../scanner')
var parse = require('../parser')
var error = require('../error')

var TEST_DIR = 'test/kobra-code/good-programs'

describe('The compiler', function () {
  fs.readdirSync(TEST_DIR).forEach(function (name) {
    it('should compile ' + name + ' without errors', function (done) {
      scan(path.join(TEST_DIR, name), function (tokens) {
        var priorErrorCount = error.count
        var program = parse(tokens)

        program.environment('NODE')
        program.analyze()
        
        error.count.should.equal(priorErrorCount)
        done()
      })
    })
  })
})