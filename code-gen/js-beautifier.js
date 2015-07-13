var beautify = require('js-beautify').js_beautify

var options = {
  'indent_size': 4,
  'space_after_anon_function': false,
}

module.exports = {

  prettyPrint: function (source) {
    return beautify(source, {
      'options': options
    })
  }

}
