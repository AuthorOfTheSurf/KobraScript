var fs = require('fs')
var path = require('path')
var should = require('should')
var scan = require('../scanner')
var parse = require('../parser')
var error = require('../error')

error.quiet = true

var TEST_DIR = 'test/kobra-code/syntax-errors'

describe('The analyzer detects an error for', function () {
  fs.readdirSync(TEST_DIR).forEach(function (name) {
    var check = name.replace(/-/g, ' ').replace(/\.ks$|\.ksb$/, '')
    it(check, function (done) {
      var priorErrorCount = error.count
      scan(path.join(TEST_DIR, name), function (tokens) {
        error.count.should.be.above(priorErrorCount)
        done()
      })
    })
  })
})
