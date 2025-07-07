---
title: CLI Options
cobeMode: static
tocDepth: 0
---


# The Command Line

ACID provides `acid`, a limited CLI (Command Line Interface) for running or generating a docsite.

Below are the command line options understood by `acid`.


## `--config`

Specifies the location of the acid config file.

```shell
acid --config [path]
```
```shell
acid -c [path]
```

Replace `[path]` with the path to the config file.  The default for this option is *acid.config.js*.


## `--help`

Displays help for the `acid` command.

```shell
acid --help
```
```shell
acid -h
```


## `--http-server`

Enables the dev http server and, optionally, the port it will listen on.

```shell
acid --http-server [port]
```
```shell
acid -s [port]
```

If `httpServer` is activated in configuration then this option serves only to specify the port, and if the port is not specified, `httpServerPort` from configuration is used.



## `--make-config`

Creates a basic configuration file.

```shell
acid --make-config
```
```shell
acid -m
```

This flag changes command operation to generating a config file.

The config file to generate can be specified using the `--config` option:

```shell
acid --make-config --config [path]
```

Any other configuration option specified will be written to the file.


## `--output-dir`

Specifies the location to put the generated docsite.

```shell
acid --output-dir <dir>
```
```shell
acid -o <dir>
```

`output.dir` from configuration is used if not specified.


## `--title`

Docsite display name.

```shell
acid --title <str>
```
```shell
acid -t <str>
```

`title` from configuration is used if not specified.


## `--version`

Show `acid` version info.

```shell
acid --version
```
```shell
acid -v
```


## `--watch`

Watch files for changes.

```shell
acid --watch
```
```shell
acid -w
```

The set of files to be watched must come from configuration.

File watching triggers a rebuild of the docsite.  If the server is also enabled, hot-reload is in effect.

```shell
acid --watch --http-server
```
