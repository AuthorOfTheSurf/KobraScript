$ Promise = require('bluebird')
$ request = Promise.promisify(require('request'))
Promise.promisifyAll(request)

request.getAsync('http://ip-api.com/json/google.com')
  .then(fn(res) -> say res[0].body)
