---
cobeMode: static
---


# Install

Install as dev dependency.

```shell
npm install @capmeth/acid --save-dev
```

# Quick Start

A site can be generated without any configuration.

From your project root, do

```shell
acid -s
```

and then point your browser to <https://localhost:3010> to see the docsite.

Content will be generated if there is a *readme.md* file or JsDoc-commented *.jsx* component files in the project.

Pretty basic, but hey, you're only a couple minutes in and you have a docsite already!


# Quick Start with Config

To generate a default config file, do

```shell
acid make-config
```

It is created as *acid.config.js* in the current directory by default, or you can specify where you want the file.

```shell
acid make-config -c path/to/config-files/acid.config.js
```

And then build and serve the site

```shell
acid -s
```

Remember to use the `-c` parameter in the command above if you placed your config file elsewhere.

This gets you about the same results as not using a config file if you didn't make any changes to it.

- See the [CLI docs](document/configuration-acid-cli) for more details on command-line functionality.
- See the [config options docs](document/configuration-options) for config file options and their defaults.


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
