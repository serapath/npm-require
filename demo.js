if (typeof module === 'object') {
  module.exports = function (text) {
    var domconsole = require('dom-console')
    var opts = { lineLength: 60 } // default
    var api = /*element*/ domconsole(/*opts*/).api
    api.toggle()

    var x = { leaf: 'leaf' }
    x['circular1'] = x
    x.y = {}
    x.y.circular2 = x.y
    console.log(x)

    console.log(text)
  }
} else {
  var basepath = location.href
  var script = document.createElement('script')
  script.src = `src/npm-require.js#${basepath}`
  script.onload = start
  document.head.appendChild(script)
  function start () {
    var test = require('./demo')
    test('hello world')
  }
}
