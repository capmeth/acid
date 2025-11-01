---
title: CLI Options
cobeMode: static
tocDepth: 3
---


# The Command Line

ACID provides `acid`, a CLI (Command Line Interface) for running or generating a docsite.

Below are the details of the sub-commands (and their options) understood by `acid`.

> Remember that for a local install, you will need to prefix commands with `npx`.


## `run`

Builds the docsite.

```shell
acid run
```

Optionally, a server can be started and files watched for changes.

```shell
acid run --server --watch
```

The config file to use can be specified using the `--config` option:

```shell
acid run --config path/to/acid.config.js
```

As `run` is the default command, it is not actually necessary to type it.

For example, the below will build and start a server on port 3000.

```shell
acid -s 3000
```


### `--use`

Apply an extension using a module specifier with optional parameters.

```shell
acid run --use react-extension
```
```shell
acid run -u react-extension
```

Repeat for as many extensions as needed.

```shell
acid run -u react-extension -u vue-extension
```

Pass a config parameter to the extension after the `::` (double colon).

```shell
acid run -u react-extension::"{\"exts\":[\".jsx\"]}"
```

The parameter will be JSON parsed so remember to quote and format properly.


### `--log-level`

Logging level for the build process.

This must be "test", "info", "warn", "fail", or "off" (see API documentation for more details).

```shell
acid run --log-level test
```
```shell
acid run -l test
```


## `make-config`

Creates a starter configuration file.

```shell
acid make-config
```

The config file to generate can be specified using the `--config` option:

```shell
acid make-config --config path/to/acid.config.js
```

Any other configuration option specified will be written to the file.

If the config file already exists it **will not** be overwritten.


## Common Options

The following options are avaailable to both `acid` sub-commands.

These cli options will override defaults or anything set in a config file.


### `--config`

Specifies the location of the acid config file.

```shell
acid --config ./path/to/acid.config.js
```
```shell
acid -c ./path/to/acid.config.js
```

Prefix relative paths with `./`.

The default for this option is *acid.config.js*.


### `--help`

Displays help for the `acid` command.

```shell
acid --help
```
```shell
acid -h
```


### `--launch-browser`

Load the docsite in the default browser on startup.

```shell
acid --launch-browser
```
```shell
acid -b
```

You must also use `--server` (or have it enabled in config) for this to work.


### `--output-dir`

Specifies the location to put the generated docsite.

```shell
acid --output-dir <dir>
```
```shell
acid -d <dir>
```

### `--output-name`

Specifies the name/prefix to use for generated docsite files.

```shell
acid --output-name <name>
```
```shell
acid -n <name>
```

### `--root-section`

Identifies the top-level section for the docsite.

```shell
acid --root-section <name>
```
```shell
acid -r <name>
```


### `--server`

Enables the dev http server and, optionally, the port it will listen on.

```shell
acid --server [port]
```
```shell
acid -s [port]
```

If `server` is enabled in configuration then this option serves only to specify the port.


### `--title`

Docsite display name.

```shell
acid --title <str>
```
```shell
acid -t <str>
```


### `--toc-depth`

Header level depth for Table of Contents display.

This must be an integer between 0 and 6.

```shell
acid --toc-depth <num>
```


### `--version`

Show `acid` version info.

```shell
acid --version
```
```shell
acid -v
```


### `--watch`

Watch files for changes.

```shell
acid --watch
```
```shell
acid -w
```

The set of files to be watched must come from configuration.
