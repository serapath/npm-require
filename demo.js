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
    var foobar = require('./test/foobar')
    var bar = require('./test/bar')
    console.log(foobar)
    console.log(bar)
    var url = `${location.href}test/foobar.js`
    console.log(url)
    var foobar2 = require(url)
    console.log(foobar2)
    url = 'https://unpkg.com/bel'
    console.log(url)
    var bel = require(url)
    console.log(typeof bel)
  }
} else {
  var basepath = location.href
  var script = document.createElement('script')
  script.src = `src/npm-require.js#${basepath}`
  script.onload = start
  document.head.appendChild(script)
  function start () {
    require.RELOAD = true // don't cache modules
    require.VERBOSE = false // true: log more stuff
    var test = require('./demo')
    test('hello world')
  }
}
