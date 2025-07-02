
# Getting Started

Simple instructions to get you started using ACID.


## Quick Start

Install as dev dependency.

```shell
npm install acid --save-dev
```

You will then need an *acid.config.js* file.  To generate a default one, do

```shell
acid --make-config
```

The config file is created in the current directory by default.

It is pretty basic.  You'll probably want to change some things.  But it's enough to get a docsite build going.

Now you can build the site

```bash
acid
```

or build and serve the site

```bash
acid --http-server
```

add `--watch` flag to the above to serve the site <b style="color:red">hot</b>.

```bash
acid --http-server --watch
```

If you've elected to serve the site using the default `httpServerPort`, point your browser at <https://localhost:3010>.

Simple!

Head to the config section of these docs to see all the config & CLI options!


## Programmatic Access

If you wish to operate a docsite from within your own code, do

```js
import acid from '@capmeth/acid'

// create a new docsite instance
let docsite = acid({ /* config options */ });

await docsite.start();
// ... and the docsite is now running
await docsite.stop();
// ... and the docsite is now stopped
```

Both `start` and `stop` are async functions that resolve to `undefined` once the request has finished.

If the http server is disabled and no files are being watched (as per configuration), the process ends when `start` resolves (no need to call `stop`).

