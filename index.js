;(function (module, exportname) {
    module[exportname] = require
    function require (name) {
     // @TODO: implement
    }
}).apply(null, (typeof module === "object" && module && [module, 'exports'] || [window, 'require']))
