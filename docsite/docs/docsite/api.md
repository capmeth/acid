---
title: API
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
    /**
        Sets the lowest security level logger activated.
    */
    level: "test" | "info" | "warn" | "fail" | "off"
    /**
        Default log function
    */
    default: function | null,
    /**
        Test severity level log function.
    */
    test: function | null,
    /**
        Information severity level log function.
    */
    info: function | null,
    /**
        Warning severity level log function.
    */
    warn: function | null,
    /**
        Error severity level log function.
    */
    fail: function | null,
    /**
        Turn off colors in log messages?
    */
    noChalk: true | false,
}
```

The 4 severity-level logging functions (with default handlers) are

1. `test` => `console.debug`
2. `info` => `console.info`
3. `warn` => `console.warn`
4. `fail` => `console.error`

There is also a `default` logger which uses `console.log` by default.

To set a logging `level`, do

```js
acid.logger('info');
// or
acid.logger({ level: info });
```

By default, `level` is "fail".  All levels after the specified `level` will also be activated (e.g. setting "info" also activates "warn" and "fail").  Use "off" to disable all severity-level logging.

Specifying `null` for a severity-level logger will disable it.  Setting `default` to `null` forces the use of `console.log`.

If a failure message occurs and "fail" level logging is disabled, a notification will be sent via the default logger.

Finally, `noChalk` turns off log message colorization.


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

Accepts a function that can update or modify configuration settings.

This is the basis for an ACID extension or "plugin".

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

In the above, `acidReactExt` and `acidVueExt` are functions that accept the current config object, which has defaults, config file settings, and command-line options (if applicable) already loaded.  A second parameter can also be passed, ostensibly as configuration for the extension itself.

The config object itself is a self-managing proxy, so the extension does not need to return anything.

**`extension(config: object, param: any): void`**

Although ACID configuration is not terribly complicated (right?), the idea is that 3rd-party extensions can directly apply their needs to configuration without having to instruct the user how to configure a renderer and/or parser, which URLs to add to scripts, what needs be in the importmaps, etc.  

...Of course, the extension itself may require configuration, so... your mileage may vary.


