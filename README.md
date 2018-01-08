# npm-require
synchronous global require function for the browser to load commonjs modules from a (relative) URL or npm

# TODO
```js
// @TODO: put `src/index.js` structure into place
// @TODO: experiment with offlineFirst/ServiceWorker with cross-domain-re-use of modules
// @TODO: find `package.json` and load all dependencies with their versions
// @TODO: require.config(opts) // to change NPM CDN, etc...
// @TODO: require.packageJSON // to show packageJSON of current require
// @TODO: maybe support version ranges (check unpkg and wzrd support)


// @TODO: compare with npm-requie inofficial and implement

// // then
//   a. LOAD_AS_FILE(Y + X)
//   //     LOAD_AS_FILE(X)
//   // 1. If X is a file, load X as JavaScript text.  STOP
//   // 2. If X.js is a file, load X.js as JavaScript text.  STOP
//   // 3. If X.json is a file, parse X.json to a JavaScript Object.  STOP
//   b. LOAD_AS_DIRECTORY(Y + X)
//   // 1. If X/package.json is a file,
//   //    a. Parse X/package.json, and look for "main" field.
//   //    b. let M = X + (json main field)
//   //    c. LOAD_AS_FILE(M)
//   //    d. LOAD_INDEX(M)
//         //   If X/index.js is a file, load X/index.js as JavaScript text.  STOP
//         //  2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
//         //  3. If X/index.node is a file, load X/index.node as binary addon.  STOP
//   //  If X/index.js is a file, load X/index.js as JavaScript text.  STOP
//   //  2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
//   //  3. If X/index.node is a file, load X/index.node as binary addon.  STOP
// 4. LOAD_NODE_MODULES(X, START=dirname(Y))
//   // 1. let DIRS=NODE_MODULES_PATHS(START)
//   // 2. for each DIR in DIRS:
//   //    a. LOAD_AS_FILE(DIR/X)
//   //    b. LOAD_AS_DIRECTORY(DIR/X)
// 5. `throw new Error("Cannot find module '<module name>'")`

// @TODO: use as "test cases" or rather "example output"

// require('./routes')
//   ./package.json#main
//   ./routes.js
//   ./routes.json
//   ./routes.node
// 
// // /home/bytearcher/socket/src/server.js
// require('async')
//   /home/bytearcher/socket/src/node_modules/async
//   /home/bytearcher/socket/node_modules/async
//   /home/bytearcher/node_modules/async
//   /home/node_modules/async
//   /node_modules/async
// 
//   module.paths
//   [ '/Users/samer/learn-node/repl/node_modules',
//     '/Users/samer/learn-node/node_modules',
//     '/Users/samer/node_modules',
//     '/Users/node_modules',
//     '/node_modules',
//     '/Users/samer/.node_modules',
//     '/Users/samer/.node_libraries',
//     '/usr/local/Cellar/node/7.7.1/lib/node' ]
```

# usage

**`index.html`**

```html

  <body>
    <script src="https://wzrd.in/standalone/npm-require"></script>
    <script src="browser.js"></script>
  </body>

```

**`browser.js`**

```js
var minixhr = require('minixhr')

// use module :-)
```

# resolver spec

*The `require` function in nodejs does not follow the official module resolver logic, so below follows the resolver logic this module uses and what I think the logic currently used by `require` in nodejs looks like*

open issue:
* https://github.com/nodejs/node/issues/17966

**Official** (not implemented by this module)
* https://nodejs.org/api/modules.html#modules_all_together

**Inofficial** (implemented by this module)  
Follows official spec as closely as possible, but:
* without nodejs CORE MODULES support
* without .node file extension support

```
require(X) from module at path Y
1. If X is a core module,
   a. return the core module
   b. STOP
2. If X begins with '/'
   a. set Y to be the filesystem root
3. If X begins with './' or '/' or '../'
   a. LOAD(Y + X)
4. LOAD_NODE_MODULES(X, dirname(Y))
5. THROW "not found"

LOAD(X)
1. LOAD_AS_DIRECTORY(X)
2. LOAD_AS_FILE(X)
3. LOAD_INDEX(X)

LOAD_AS_DIRECTORY(X)
1. If X/package.json is a file,
   a. Parse X/package.json, and look for "main" field.
   b. let M = X + (json main field)
   c. LOAD_AS_FILE(M)
   d. LOAD_INDEX(M)

LOAD_AS_FILE(X)
1. If X is a file, load X as JavaScript text.  STOP
2. If X.js is a file, load X.js as JavaScript text.  STOP
3. If X.json is a file, parse X.json to a JavaScript Object.  STOP
4. If X.node is a file, load X.node as binary addon.  STOP

LOAD_INDEX(X)
1. If X/index.js is a file, load X/index.js as JavaScript text.  STOP
2. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP
3. If X/index.node is a file, load X/index.node as binary addon.  STOP

LOAD_NODE_MODULES(X, START)
1. let DIRS=NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules" CONTINUE
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS
```

# license
MIT
