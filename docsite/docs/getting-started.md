---
cobeMode: static
---


# Quick Start

Install as dev dependency.

```shell
npm install @capmeth/acid --save-dev
```

Now, you need an *acid.config.js* file.  To generate a default one, do

```shell
acid --make-config
```

The config file is created in the current directory by default.  It is pretty basic, but it's enough to get a docsite build going.

Now you can build the site,

```bash
acid --http-server
```

and then point your browser to <https://localhost:3010> to see the result.

Simple!

See the [CLI docs](document/configuration-acid-cli) for more details on command-line functionality.


# Programmatic Access

If you wish to operate a docsite from within your own code, do

```js
import acid from '@capmeth/acid'
import config from './acid.config.js'

// create a docsite instance
let docsite = acid(config);

// passing `true` starts the server
let stop = await docsite.run(true);
```

In the above, the returned `stop` function is async and resolves to `undefined` once the server has stopped.

See the [API docs](document/docsite-api) for more details on programmatic functionality.
