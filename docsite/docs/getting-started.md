
# Getting Started

Simple instructions to get you started using ACID.


## Quick Start

Install as dev dependency.

```shell
npm install @capmeth/acid --save-dev
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

Then you can point your browser to <https://localhost:3010> to see the result.

Simple!

Add the `--watch` flag to the above to serve the site <b style="color:red">hot</b>.

```bash
acid --http-server --watch
```

Head to the *Config Quick Reference* section of these docs to see all the config & CLI options!


## Programmatic Access

If you wish to operate a docsite from within your own code, do

```js
import acid from '@capmeth/acid'
import config from './acid.config.js'

// create a docsite instance
let docsite = acid(config);

// returned function can stop the server (if running)
let stop = await docsite.run();

await stop();
```

Both `run` and `stop` are async functions, with the latter resolving to `undefined` once the request has finished.
