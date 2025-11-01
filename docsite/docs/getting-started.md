---
cobeMode: static
---


# Install

Install as dev dependency.

```shell
npm install @capmeth/acid --save-dev
```

Alternatively, you can install globally.

```shell
npm install @capmeth/acid -g
```


# Quick Start

While a docsite build can be run without a configuration file, it will be based entirely on defaults which will likely not capture much of your project's content.  

You can create an *acid.config.js* in your project's root folder as that is where ACID will look for configuration by default.

Or, to generate a default config file execute this (from project root folder):

```shell
acid make-config
```

> Remember that for a local install, you will need to prefix commands with `npx`.

The file is created as *acid.config.js*.  Or you can specify the path of the file.

```shell
acid make-config -c ./path/to/config-files/acid.config.js
```

Remember to prefix a relative path with `./`.

And then build and serve the site (also include `-c` option here if you placed your config elsewhere).

```shell
acid -s
```

Now, point your browser to <https://localhost:3010> to see the site.

As discussed earlier, the site is pretty empty when using only the default configuration.  But now you have a working config file and a running docsite... and you're just 3 minutes in!

See *Next Steps* section below to get you on your way to adding content into the docsite.

For ease of use, you might want to add this to your *package.json* scripts.

```json
{
    "docsite-dev": "acid -ws -l info -c ./path/to/acid.config.js"
}
```

And now, `npm run docsite-dev` starts you a "hot-reload" server with the proper config file at the `info` logging level.  Check out the [CLI Docs](/document/reference-acid-cli) page for details on all the command-line options.


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

See the [API docs](/document/docsite-api) for more details on programmatic functionality.


# Next Steps

You can structure your docsite and specify exactly which components and other documentation you wish to include.

&nbsp;&nbsp; ******[Basic Setup >](/document/tutorials-basic-setup)******

If you are documenting only Svelte components, then you do not necessarily need a framework plugin.  You can use the built-in JsDoc parser (configured automatically), and the built-in Svelte renderer for rendering component examples.

&nbsp;&nbsp; ******[Cobe Code Injection >](/document/tutorials-cobe-code-injection)******
