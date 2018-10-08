window.require = (function (modules) {
  var registry_URL = 'https://wizardamigos-browserify-cdn.herokuapp.com/multi'
  var require_URL = 'https://unpkg.com/npm-require'
  var nested = []
  var mypath = document.currentScript.getAttribute('src').split('#').pop()
  var basepath = window.location.href
  if (mypath) try { var basepath = new URL(mypath).href } catch (e) { }
  if (basepath === 'about:srcdoc') throw new Error(`
    when using 'srcdoc=...' you need to provide a custom url to a folder containing JS files of require(...) calls with paths.
    e.g.
    <script src="${require_URL}#https://my.custom.com/folder/for/js/and/json/files/"></script>
  `)
  require.cache = modules
  return require
  function require (name, version) {
    nested.push(basepath)
    if (name[0] === '.' || name[0] === '/' && name[1] !== '//') {
      if (name.slice(-3) !== '.js' && name.slice(-5) !== '.json') name = name + '.js'
      var _name = new URL(name, basepath).href
    } else if (name.split('//').length > 1) {
      _name = name
    }
    var realname = (_name || name)
    var module = modules[realname]
    if (module) {
      if (version) console.error(`using cached version "${module.package.version}" of "${realname}"`)
      return module.exports
    }
    version = version || 'latest'
    var modulename = `${realname}@${version}:${location.host}`
    var _module = localStorage[modulename]
    if (version === 'latest' && _module && !(require.RELOAD && _name)) {
       var module = JSON.parse(_module)[realname]
       var oldstamp = module.timestamp
       var newstamp = +new Date()
       var age = (newstamp - oldstamp) / (1000*3600)
       if (age > 24) _module = module = null // cache for one day
       else return init(realname, _module).exports
    }
    if (!_module || (require.RELOAD && _name)) {
      var module, _module
      if (_name) {
        _module = ajax(_name)
        module = { [_name]: { package: { version: '---' }, bundle: _module } }
      }
      else {
        _module = registry(JSON.stringify({ dependencies: { [name]: version } }))
        module = JSON.parse(_module)
      }
      module[realname].timestamp = +new Date()
      _module = JSON.stringify(module)
      localStorage[modulename] = _module
      if (version === 'latest') {
        version = module[realname].package.version
        modulename = `${realname}@${version}:${location.host}`
        localStorage[modulename] = _module
      }
      if (require.VERBOSE) console.log(`caching version "${version}" of "${realname}" for one day`)
    }
    return init(realname, _module).exports
  }
  function init (name, _module) {
    var se = document.createElement('script')
    var module = JSON.parse(_module)[name]
    var isJSON = (name.split('.').pop()||'').toUpperCase() === 'JSON'
    se.text = module.package.version === '---' ?
      isJSON ? `;(function (module) { module.exports = ${module.bundle} })(window.module);`
        : `;(function (module) { ${module.bundle} })(window.module);`
      : module.bundle
    if (window.module) var oldModule = window.module
    window.module = {}
    document.head.appendChild(se)
    document.head.removeChild(se)
    if (window.require !== require) { // window.require was changed
      // (e.g by loading a browserify bundle)
      module.exports = window.require(name) // use it
      window.require = require // and restore things
    } else module.exports = window.module.exports
    if (oldModule) window.module = oldModule
    else delete window.module
    basepath = nested.pop()
    return modules[name] = module
  }
  function ajax (url) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', `${url}?${Math.random()}`, false)
    xhr.send()
    basepath = xhr.responseURL.split('/').slice(0,-1).join('/') + '/'
    return xhr.responseText
  }
  function registry (json) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', registry_URL, false)
    xhr.send(json)
    return xhr.responseText
  }
})({})
