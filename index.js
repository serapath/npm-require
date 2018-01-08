window.require = (function (modules) {
  var wzrd_URL = 'https://wizardamigos-browserify-cdn.herokuapp.com/multi'
  function init (name, _module) {
    var se = document.createElement('script')
    var module = JSON.parse(_module)[name]
    var isJSON = (name.split('.').pop()||'').toUpperCase() === 'JSON'
    if (module.package.version === '---') {
      if (isJSON) {
        se.text = `;(function (module) { module.exports = ${module.bundle} })(window.module);`
      } else {
        se.text = `;(function (module) { ${module.bundle} })(window.module);`
      }
    } else {
      se.text = module.bundle
    }
    if (window.module) var oldModule = window.module
    window.module = {}
    document.head.appendChild(se)
    document.head.removeChild(se)
    if (window.require !== require) {
      module.exports = window.require(name)
      window.require = require
    } else {
      module.exports = window.module.exports
    }
    if (oldModule) window.module = oldModule
    else delete window.module
    return modules[name] = module
  }
  function require (name, version) {
    if (name[0] === '.' || name[0] === '/') var _name = new URL(name, window.location.href).href
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
        _module = wzrd(JSON.stringify({ dependencies: { [name]: version } }))
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
      console.log(`caching version "${version}" of "${realname}" for one day`)
    }
    return init(realname, _module).exports
  }
  require.cache = modules
  return require
  function ajax (url) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', `${url}?${Math.random()}`, false)
    xhr.send()
    return xhr.responseText
  }
  function wzrd (json) {
    var xhr = new XMLHttpRequest()
    xhr.open('POST', wzrd_URL, false)
    xhr.send(json)
    return xhr.responseText
  }
})({})
