---
title: Main Config Options
tocDepth: 2
cobeMode: static
---


# Config File Options

Below are the settings recognized in an *acid.config.js* file.

Pay attention to the default config settings.  Unless otherwise noted, when no setting is specified then the default(s) will be in effect.  Many options can be unset explicitly with `null`, or for array types, with an empty array.

A `// merges` comment in the type definition of a multi-value config option indicates that the option will merge with the defaults instead of overwriting them when set.


## cobe

Default settings for CoBEs.

```js label="spec"
cobe: // merges
{ 
    /**
        Show editable code blocks by default (modes 'edit' or 'live')?
    */
    noHide: true | false,
    /**
        Turn off code highlighting?
    */
    noHighlight: true | false
}
```

Note that "render" and "static" modes will always hide or show the code block, respectively, regardless of `noHide` setting.

For highlighting to work, `hljs` must also be configured properly (which it is, for common languages, by default).

```js label="default value"
cobe:
{ 
    noHide: false,
    noHighlight: false
}
```


## cobeSpecs

Specifications for individual code block language types.

```js label="spec"
cobeSpecs:
[
    { 
        /**
            Code block language marker(s).
        */
        types: string | [ ...string ],
        /**
            Compiler plugin to use.
        */
        use: string | [ string, ...any ], 
        /**
            Default render mode.
        */
        mode: "edit" | "live" | "render" | "static", 
        /**
            Show editable code blocks by default (modes 'edit' or 'live')?
        */
        noHide: true | false,
        /**
            Turn off code highlighting?
        */
        noHighlight: true | false
    },
    ...
]
```

Specify language marker(s) ("js", "jsx", "vue", etc.) in `types`.  When a marker appears more than once in the list, it is the last definition given that will apply.

The settings here are specific to the language types specified and will override any defaults.

Use `use` to specify the name of a package (plugin) that will render the code from the block (See plugin documentation).

Values available for `mode` are:
- "static": just show the code
- "render": execute the code and display results
- "edit": code editing with on-demand render
- "live": code editing with immediate render

A code block's `mode` will be forced to "static" if no `use` is set for its language marker (no way to render anything).

```js label="default value"
cobeSpecs: []
```


## copy

Glob settings that identify files that need to be copied into `ouputDir`.

```js label="spec"
copy:
[
    { 
        /**
            Glob patterns selecting files to include in the copy list, 
            or an object specifying include/exclude.
        */
        files: string | [ ... string ] |
        {
            /**
                Glob patterns selecting files to include in the copy list.
            */
            include: string | [ ... string ],
            /**
                Glob patterns selecting files to exclude from those included in the copy list.
            */
            exclude: string | [ ... string ]
        },
        /**
            Destination for the copied files.
        */
        to: string | function | null |
        [ 
            string | RegExp | [ string | RegExp, string ], 
            string | function 
        ]
    },
    ...
]
```

Root for relative paths specified in `files` is `root`.

`to` will evaluate each relative path captured in `files`.
- a string can be interpolated with information from the relative path
  - `{dir}` path to the file
  - `{name}` name of the file (without extension)
  - `{ext}` file extension
- a function is passed the relative path and should return a new filepath.
- an array is the parameter list for `String.prototype.replace` against the relative path. 
  Optionally, **RegExp** constructor parameters can be provided in an array as the first argument.

The resulting filename from `to` is assumed to be relative to `output.dir`.  If `to` is omitted, `null`, or results in the same or an empty string, the file is copied into `output.dir` with its original relative path.  If `to` results in a path that is not inside `output.dir` the file is not copied.

```js label="default value"
copy: []
```


## hljs

HighlightJs configuration.

```js label="spec"
hljs: // merges
{
    /**
        Language marker aliases.
    */
    aliases: // merges
    {
        /**
            Aliases to be added.

            `[name]` is the name or an existing alias of the targeted language.
        */
        [name]: string | [ ... string ],
        ...
    }
    /**
        Additional names of languages to load.
    */
    languages: string | [ ... string ]
    /**
        Name (filename) of a CSS theme.
    */
    theme: string | null,
    /**
        Version of hljs to use.
    */
    version: string
}
```

[UNPKG](https://unpkg.com/) is used to pull all highlightjs resources into the browser.

Settings `version` and `theme` are interpolated into a URL to pull CSS.

```
https://unpkg.com/@highlightjs/cdn-assets@{version}/styles/{theme}.min.css
```

And the highlightjs code is pulled as:

```
https://unpkg.com/@highlightjs/cdn-assets@{version}/highlight.min.js
```

Each name in `languages` is pulled using (`lang`):

```
https://unpkg.com/@highlightjs/cdn-assets@{version}/languages/{lang}.min.js
```

Check [this page](https://app.unpkg.com/@highlightjs/cdn-assets) to see what's available.

```js label="default value"
hljs:
{
    theme: 'a11y-light',
    version: '11.11.1'
}
```


## httpServer

Starts the http server.

```js label="spec"
httpServer: true | false
```

For hot-reloading, `watch` option must also be enabled.

```js label="default value"
httpServer: false
```


## httpServerPort

Port number where http server listens for requests.

```js label="spec"
httpServerPort: number
```

```js label="default value"
httpServerPort: 3010
```


## importMap

Module specifier resolution in the browser.

```js label="spec"
importMap: object
```

As a convenience, top-level keys that are not `imports`, `scopes`, or `integrity` are assumed to be **imports**.

ACID will look for a `#bundle` specifier here and import its named exports into a variable named `bundle` for CoBEs.

So if your app's export bundle is named *my-app-bundle.js*, make sure the file gets copied to `output.dir` (you can do this via `copy` setting), and then

```js
importMap:
{
    "#bundle": "./my-app-bundle.js"
}
```

For more details on import maps, see the [official documentation](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps).


```js label="default value"
importMap: {}
```


## links

Configures `<link>` tags for the `<head>` tag.

```js label="spec"
links: string | object | [ ... string | object ]
```

Object properties are directly applied as `<link>` attributes.

String items are assumed to be stylesheet urls for the `href` attribute and `rel="stylesheet"` will automatically be added as well.  

```js label="default value"
links: []
```

## logger

Controls log settings.

```js label="spec"
logger: //merges
{
    /**
        Sets the lowest security level logger activated.
    */
    level: 'test' | 'info' | 'warn' | 'fail' | 'off'
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

The logging levels are ordered as follows: (test, info, warn, fail)

All logging levels after `level` will also be activated (e.g. `level: 'info'` also activates 'warn' and 'fail').

To explicitly disable a severity level logger set it to `null`.  

Setting `default` to `null` forces the use of `console.log`.

If a failure message occurs and "fail" level logging is disabled, a notification will be sent via the default logger.

> This affects only server or build-time logging.  There are no configurable render-time (browser) log settings.

```js label="default value"
logger:
{
    level: 'info',
    default: null,
    test: console.debug,
    info: console.info,
    warn: console.warn,
    fail: console.error,
    noChalk: false
}
```


## metas

Configures `<meta>` tags for the `<head>` tag.

```js label="spec"
metas: object | [ ... object ]
```

Object properties are directly applied as `<meta>` attributes.

```js label="default value"
metas:
[
    // `author` from package.json (if available)
    { name: 'author', content: author },
    // `description` from package.json (if available)
    { name: 'description', content: description },
    // `keywords` from package.json (if available)
    { name: 'keywords', content: keywords },
]
```


## namespace

An string used internally to help prevent potential naming collisions.

```js label="spec"
namespace: string
```

The string can contain only letters, numbers, dashes, and underscores.

```js label="default value"
namespace: 'acid'
```


## output

Details where generated artifacts will be placed.

```js label="spec"
output: string |
{
    /**
        Path where generated docsite files will be written.
    */
    dir: string,
    /**
        Name/Prefix for docsite generated files.
    */
    name: string
}
```

Specifying `output` as a string is the same as specifying `output.dir`.

`output.dir` also serves as root for `httpServer`.

File output includes:

- `{dir}/{name}.html`: docsite html
- `{dir}/{name}-docsite.js`: docsite javascript
- `{dir}/{name}-examples.js`: docsite example code

If `name` includes path segments, subfolders will be created under `dir`.


```js label="default value"
output:
{
    dir: 'docs',
    name: packageJson.name
}
```


## parsers

> TODO: Document!


## root

Root path for the project/library to be documented.

```js label="spec"
root: string
```

This is the base path for 
- relative file paths specified in config (`sections`, `watch`, etc.)
- relative `@example` file paths in JSDoc comments

```js label="default value"
root: process.cwd()
```


## rootSection

Name of the section at the top of the docsite navigation hierarchy.

```js label="spec"
rootSection: string
```

See `sections` setting for more info on how this is used.

```js label="default value"
rootSection: 'root'
```


## scripts

Configures `<script>` tags for the `<head>` tag.

```js label="spec"
scripts: string | object | [ ... string | object ]
```

Object properties are directly applied as `<script>` attributes.

String items are assumed to be source urls for the `src` attribute.

If `src` contains any whitespace whatsoever, it is assumed to be an inline script.

```js label="default value"
scripts: []
```


## sections

Organizational and content structure for the docsite pages.

```js label="spec"
sections:
{
    /*
        A name for the section (must be alphanumeric incl. underscores and dashes).
    */
    [name]:
    {
        /*
            Display name for the section. If not provided, `name` will be used.
        */
        title: string,
        /*
            Markdown content serving as an overview of the section.
        */
        overview: string,
        /*
            Glob patterns selecting additional markdown files to include in the section, 
            or an object specifying include/exclude.
        */
        documents: string | [ ... string ] |
        {
            /*
                Glob patterns selecting additional markdown files to include.
            */
            include: string | [ ... string ],
            /*
                Glob patterns selecting markdown files to exclude from those included.
            */
            exclude: string | [ ... string ]
        }
        /*
            Glob patterns selecting component source files to include in the section, 
            or an object specifying include/exclude.
        */
        components: string | [ ... string ] |
        {
            /*
                Glob patterns selecting component source files to include.
            */
            include: string | [ ... string ],
            /*
                Glob patterns selecting component source files to exclude from those included.
            */
            exclude: string | [ ... string ]
        },
        /*
            Names of sections that will be children of this section (sub-sections).
        */
        sections: [ ... string ]
    },

    // add as many sections as needed...
    ...
}
```

All of the properties above are optional.

A hierarchical tree is built by starting at `rootSection` and working down through `sections.*.sections` until each one has a "parent" reference.  

Parent references are only assigned once. A given section cannot be assigned a parent if it already has one assigned, so any section appearing as a child in multiple places will only ever appear as a child of one of those sections in the docsite.

Ultimately, any section that is not `rootSection` nor included in its descendants will be left out of the docsite altogether.

Note that `overview` can alternatively be a path to a markdown file.  Simply prefix the path with `file:/`.

```js label="default value"
sections:
{
    root:
    {
        title: 'Overview',
        overview: 'readme.md',
        sections: [ 'components' ]
    },
    components:
    {
        title: 'Components',
        components: 
        { 
            include: '**/*.jsx', 
            exclude: 'node_modules/**'
        }
    }
}
```


## storage

Determines how to store docsite user state.

```js label="spec"
storage: 'local' | 'session' | 'none'
```

For the purposes of this setting "user state" includes
- asset filters
- expand/collapse state of most elements

The data will persist in `local` or `session` storage in the browser, or set to `none` to turn this off.

```js label="default value"
storage: 'local'
```


## style

Allows for styling of the docsite.

```js label="spec"
style: string | [ ... string ]
```

Where a string is specified within `style` it can 
- start with `#` to indicate a built-in theme name
- start with `file:/` to identify a css theme file
- be a css stylesheet

The built-in themes available are
- #grayscape

When specifying relative file paths, `root` is assumed to be the root path.

Ultimately, all `sheets` are converted to JSON and deep merged from left to right to form the final stylesheet.

The final styles are then injected into the internal components based on top-level scope definitions. Any styling not within a scope definition is assumed to be global.

Please see the styling documentation for a more extensive explanation.

```js label="default value"
style: '#grayscape'
```


## tagLegend

Defines the tags recognized by the docsite.

```js label="spec"
tagLegend:
{
    [tagname]: string |
    {
        /**
            Description for the tag.
        */
        desc: string
    },
    ...
}
```

`tagname` should be lowercase alphanumeric (incl. dashes).  A string value is the tag description.

Any tag attached to an asset that is not defined here will not appear in the docsite.

```js label="default value"
tagLegend: {}
```


## title

Display name for the component library or project.

```js label="spec"
title: string
```

The default value is `title` from *package.json*.

```js label="default value"
title: packageJson.title
```


## tocDepth

Maximum depth level for the table of contents (TOC) menu.

```js label="spec"
tocDepth: number
```

The TOC is generated from header tags (`<h1>`, `<h2>`, ... `<h6>`) appearing in document content.  

This must be an integer between 0 and 6.  As you may have guessed, specifying 0 turns off the TOC completely.

```js label="default value"
tocDepth: 3
```

## toExampleFile

Maps a component file to a markdown example file.

```js label="spec"
toExampleFile: function | null |
[ 
    string | RegExp | [ string | RegExp, string ], 
    string | function 
]
```

A function value will be passed the relative path string (from `root`) of a source file.  It should return the relative path to an example file.

The array form will execute `String.prototype.replace` against the source file's relative path string, with the added option that **RegExp** constructor parameters can be provided in an array as the first element.

The below example takes a path like `source/components/layout/Grid.jsx`, and looks for an example file in `example/components/layout/Grid.md`.

```json
toExampleFile: [ [ "^source[/](.+?)[.][^./]+$" ], "example/$1.md" ]
```

This setting is used only when the source file **does not** specify `@example` with a filepath in the JsDoc comment.

The default setting returns the same path with the extension changed to ".md".  So, by default, an example file is expected to be found right next to the source file in the same folder with the same name.

```js label="default value"
toExampleFile: [ /^(.+)\.[^./]+$/, '$1.md' ]
```


## useFilenameOnly

Force use of filename as component name?

```js label="spec"
useFilenameOnly: true | false
```

When `true`, the basename of the filepath from whence the component came is used as the component's name in the docsite, ignoring the name coming from a configured parser.

```js label="default value"
useFilenameOnly: false
```


## version

Current version of the component library or project.

```js label="spec"
version: string | null
```

The default incorporates `version` from *package.json*.

```js label="default value"
version: `ver. ${packageJson.version}`
```


## watch

Manages automatic docsite rebuilds on file changes.

```js label="spec"
watch: // merges
{
    /*
        Activate watch features?
    */
    on: true | false,
    /*
        Milliseconds to wait after a change before rebuilding site.
    */
    delay: number,
    /*
        Glob patterns selecting files to include on watch list, 
        or an object specifying include/exclude.
    */
    files: string | [ ... string ] |
    {
        /*
            Glob patterns selecting files to include on watch list.
        */
        include: string | [ ... string ],
        /*
            Glob patterns selecting files to exclude from those included on watch list.
        */
        exclude: string | [ ... string ]
    }
}
```

Some important notes on watch files:
- *acid.config.js* (or the config file specified in the CLI) is __always__ included, regardless of settings
- `output.dir` is __always__ excluded, regardless of settings
- files selected in `sections` are __not__ automatically watched


```js label="default value"
watch:
{
    enabled: false,
    delay: 200,
    files:
    {
        include: '**/*.jsx',
        exclude: 'node_modules/**'
    }
}
```
