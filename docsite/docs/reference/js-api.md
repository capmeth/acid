---
title: Javascript API
obeMode: static
---


# Module

The module-level API is accessed from the default-level package export.

```js
import acid from '@capmeth/acid'
```

## `acid()`

Creates a docsite application instance.

```js
import acid from '@capmeth/acid'

let app = acid(/* config options */);
```

Pass configuration to this function as an object or a path to a config file (string).

Note that this API **does not** automatically look for *acid.config.js* if no config is specified.  That is a feature of the command-line interface only.


## `acid.logger()`

Updates log settings.

The function takes a single parameter that is a string or an object.

When a string is passed log `level` is being set.  Otherwise, the object parameter may include:

```js
{
    /*
        Activates logging at the specified severity level.
    */
    level: "test" | "info" | "warn" | "fail" | "off",
    /*
        Severity level colors.
    */
    colors:
    {
        [level]: string |
        {
            /*
                Primary color.
            */
            main: string,
            /*
                Secondary (emphasis) color.
            */
            emph: string
        }
    },
    /*
        Default log function
    */
    default: function | null,
    /*
        Severity level log function.
    */
    [level]: function | null,
    /**
        Turn off colors in log messages?
    */
    noChalk: true | false,
}
```

`[level]` must be one of the 4 severity-levels:

1. `test` => excessive information about the build process
2. `info` => useful information about the build process
3. `warn` => alerts about potential issues in the build process
4. `fail` => errors in the build process (usually accompanied by a thrown exception)

By default, `level` is "fail".  From the list above, all levels after the specified `level` are also activated (e.g. setting "info" also activates "warn" and "fail").  Use "off" to disable all severity-level logging.

To set a logging `level`, do

```js
acid.logger('info');
// or
acid.logger({ level: info });
```

Specifying `null` for a severity-level logger will disable it.  Setting `default` to `null` forces the use of `console.log`.

If a failure message occurs and "fail" level logging is disabled, a notification will be sent via the default logger.

Use `colors` to set `main` and `emph` (emphasis) [chalk](https://www.npmjs.com/package/chalk) mods for each severity level.

```js
colors:
{
    info: { main: 'blue', emph: 'blue.underline.bold' }
}
```

Setting `colors[level]` to a string is the same as setting `colors[level].main`.

Finally, `noChalk` turns off all log message colorization.

Default settings are as follows:

```js
{
    name:  'acid',
    level: 'warn',
    colors:
    {
        fail: 'redBright',
        info: { main: 'cyan', emph: 'cyanBright' },
        test: { main: 'gray', emph: 'white' },
        warn: { main: 'yellow', emph: 'yellowBright' } 
    },
    default: null,
    fail:  console.error,
    info:  console.info,
    test:  console.debug,
    warn:  console.warn,
    noChalk: false
}
```


# Instance

The instance-level API follows from creating a docsite app instance.

```js
import acid from '@capmeth/acid'

let app = acid({ /* config options */ });
```

## `app.run()`

Builds the docsite, optionally starting the server and/or watch services.

This is an async function that resolves to a function that stops the server.

```js
let stop = await app.run();
```

The `stop` function is also async and resolves to `undefined` once the server and/or file watchers have stopped.

```js
await stop();
// server and watch is now stopped
```

To explicitly run in "hot-reload" mode, do

```js
let stop = await app.run(true);
```

This activates both the server and watch mode, regardless of config settings.

Note that the `stop` function is always returned regardless of server and watch mode settings.  Calling it will either stop the server if it is running, or do nothing if not.


## `app.use()`

Accepts a function that can update or modify configuration settings.  This is the basis for an ACID extension or "plugin".

Here's how it works...

```js
import acid from '@capmeth/acid'
import acidReactExt from 'acid-react-extension'
import acidVueExt from 'acid-vue-extension'

let app = acid();

app.use(acidReactExt, { /* extension config */ });
app.use(acidVueExt, { /* extension config */ });

app.run();
```

In the above, `acidReactExt` and `acidVueExt` are functions that accept the current config object, which will have defaults and config file settings (and also any previously applied extension settings) already loaded.  The config object itself is a self-managing proxy, so the extension does not need to return anything.

A second parameter can also be passed, ostensibly as configuration for the extension itself.

Alternatively, a module specifier can be used directly as long as the *default* export is the expected function.

So, the above example could also be written as

```js
import acid from '@capmeth/acid'

let app = acid();

app.use('acid-react-extension', { /* extension config */ });
app.use('acid-vue-extension', { /* extension config */ });

app.run();
```

Although ACID configuration is not terribly complicated (right?), the idea is that 3rd-party extensions can apply their needs to configuration directly without having to instruct the user how to configure a renderer, which URLs to add to scripts, what needs be in the importmaps, etc.  

...of course, the extension itself may require configuration, so... mileage may vary.
