---
title: Config File Options
tocDepth: 2
cobeMode: static
---


# Config Files

A config file can be written in JSON (.json) or YAML (.yml, .yaml) as well as JS, just be sure to use the proper extension.

However, the only config file the ACID CLI looks for is *acid.config.js* at the project root.  If the file is anywhere else, or has any other name or extension, or if you are using the ACID API instead, you will have to specify where your config file is if you wish to use one.


# Config Options

Below are the settings recognized in a config file.

Pay attention to the default config settings.  Unless otherwise noted, when no setting is specified then the default(s) will be in effect.  Many options can be unset explicitly with `null`, or for array types, with an empty array.

A `// merges` comment in the type definition (`spec`) of an object-based setting indicates that it will (shallowly) merge with defaults rather than overwrite them.  Custom type names are prefixed with a `@` and are detailed below under the *Custom Datatypes* heading.


## cobe

Specifications for individual code block language types.

```js label="default value"
cobe: []
```

```js label="spec"
cobe:
[
    { 
        /*
            Code block language marker(s).
        */
        types: string | [ ...string ],
        /*
            Compiler extension to use.
        */
        use: string | [ string, ...any ], 
        /*
            Import declarations to generate for CoBE blocks.
        */
        imports:
        {
            /*
                Module `specifier` mapped to imports.
            */
            [specifier]: string | function | RegExp | null |
            {
                /*
                    Specifies the default or namespace import.
                */
                default: string,
                /*
                    Filters for named imports.
                */
                names: string | function | RegExp
            },
            ...
        },
        /*
            Default render mode.
        */
        mode: "demo" | "edit" | "live" | "render" | "static", 
        /*
            Show editable code blocks by default (modes 'edit' or 'live')?
        */
        noHide: true | false,
        /*
            Turn off code highlighting?
        */
        noHighlight: true | false
    },
    ...
]
```

****`*.types`****

Specify language marker(s) ("js", "jsx", "vue", etc.) in `types`.  Markers appearing more than once in the list are shallowly merged to form a single record for a given marker.

A `default` type exists, and it is applied to any block that does not specify a language type.

A "fallback" record can be set by specifying `types: '*'`. If set, it is shallowly merged with the record corresponding to the code block's effective type.

****`*.use`****

Use `use` to specify the module that will render the code from the block (see [renderer docs](document/integration-renderers)).

****`*.imports`****

The `imports` setting generates import declarations from browser-accessible module `specifier`s with the exports desired.  These declarations are then added to code blocks provided the renderer in `use` supports inserting them.

Use `imports.*.default` to specify the name of the default import, or to specify a namespace import.

For `imports.*.names`,
- use a `*` to import **all** of the named exports
- use a string to import specific named exports
- use a function to filter the export names desired (return the name or null to omit)
- use a regular expression to match the export names desired

The above also applies when `imports.*` is set to a non-object value.

Setting `imports.*` to `null` results in a side-effect import declaration.

> Beware of potential naming conflicts as renderers may also apply their own imports to code blocks.

****`*.mode`****

Values available for `mode` are:
- "static": just show the code
- "render": only show rendered results
- "demo": show code and rendered results (no editing)
- "edit": code editing with on-demand render
- "live": code editing with immediate render

Note that "render" and "static" modes will always hide or show the code block, respectively, regardless of `noHide` setting.

A code block's `mode` will be forced to "static" if no `use` exists for its language marker (no way to render anything).

****`*.noHighlight`****

Set `noHighlight` to `true` to turn off code highlighting.  This has no effect if highlighting for the block's language-type is not supported or not loaded (see `hljs` option).


## components

Replace internal presentational components.

```js label="default value"
components: {}
```

```js label="spec"
components: // merges
{
    /*
        Filename of replacement component.
    */
    [name]: string | null,
    ...
}
```

The `[name]` should take the form `group/Component` where `Component` is the proper name of the component and `group` must be one of the custom component groups (currently only "main" or "page").

Relative filepaths are based on `root` config option.

For example, if you have a custom component at *src/components/Docsite.svelte* that you want to use in place of the internal root **Docsite** component, do

```js
components:
{
    'main/Docsite': 'src/components/Docsite'
}
```

The docsite build can resolve *.svelte* and *.svt* extensions automatically, so the extension is not required.

Setting a value to `null` or an empty string has the same effect as omitting it - the default internal component will be used.

TODO: Documentation link for more information!

> If you add a `<style>` tag to a custom component, it will NOT be themable via config `style` option (no CSS will be injected).


## copy

Glob settings for static files that need to be copied into `output.dir`.

```js label="default value"
copy: []
```

```js label="spec"
copy:
[
    { 
        /*
            Files to include for copying.
        */
        files: @globfiles,
        /*
            Destination for the copied files.
        */
        to: @repath
    },
    ...
]
```

The resulting filename(s) from `to` are assumed to be relative to `output.dir`.  

If `to` is omitted, `null`, or results in the same or an empty string, the file is copied into `output.dir` using its original path.  If `to` resolves to a path that is not inside `output.dir` the file will not be copied.


## footer

Raw HTML content for the site footer.

```js label="default value"
footer: null
```

```js label="spec"
footer: string | null
```


## hljs

Code highlighting (HighlightJs) configuration.

```js label="default value"
hljs:
{
    theme: 'a11y-light',
    version: '11.11.1'
}
```

```js label="spec"
hljs: string | // merges
{
    /*
        Language marker aliases.
    */
    aliases: // merges
    {
        /*
            Aliases to be added.

            `[name]` is the name or an existing alias of the targeted language.
        */
        [name]: string | [ ... string ],
        ...
    }
    /*
        Additional names of languages to load.
    */
    languages: string | [ ... string ]
    /*
        Name (filename) of a CSS theme.
    */
    theme: string | null,
    /*
        Version of hljs to use.
    */
    version: string
}
```

Setting a string value is the same as setting `hljs.theme`.

[UNPKG](https://unpkg.com/) is used to pull all highlightjs resources into the browser.

The highlightjs code is pulled using

```
https://unpkg.com/@highlightjs/cdn-assets@{version}/highlight.min.js
```

Where `{version}` s replace with `hljs.version`.

Likewise, URL interpolation is used to pull the CSS.

```
https://unpkg.com/@highlightjs/cdn-assets@{version}/styles/{theme}.min.css
```

Additionally, each name in `languages` (if any) is interpolated into a URL as `lang` and pulled as well.

```
https://unpkg.com/@highlightjs/cdn-assets@{version}/languages/{lang}.min.js
```

Browse [this page](https://app.unpkg.com/@highlightjs/cdn-assets) to see what's available via UNPKG.


## importMap

Module specifier resolution in the browser.

```js label="default value"
importMap: {}
```

```js label="spec"
importMap: object // merges
```

See the [official documentation](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps) for details on how to configure importmaps.

As a convenience, any top-level entry whose key is not `imports`, `scopes`, or `integrity` is added to **imports**.


## labels

Literal string content used by ACID.

```svelte:render label="default value" allow-css
import { labels } from '#bundle';
<pre>
  labels:
  { JSON.stringify(labels, null, 4) }
</pre>
```

```js label="spec"
labels: // merges
{
    /*
        String content for a label id.
    */
    [id]: string,
    ...
}
```

The defaults represent the full set of strings used in a docsite and they can be changed as necessary.

Labels display as-is and are neither HTML nor markdown enabled.


## links

Configures `<link>` tags for the `<head>` tag.

```js label="default value"
links: []
```

```js label="spec"
links: string | object | [ ... string | object ]
```

Object properties are directly applied as `<link>` attributes.

String items are assumed to be stylesheet urls for the `href` attribute and `rel="stylesheet"` will automatically be added as well.  


## logo

URL of a representative image for the docsite.

```js label="default value"
logo: packageJson.logo
```

```js label="spec"
logo: string | null
```


## metas

Configures `<meta>` tags for the `<head>` tag.

```js label="default value"
metas: 
[ 
    { charset: 'utf-8' }, 
    'author', 
    'description', 
    'keywords', 
    'og:title=title', 
    'og:description=description',
    'og:url=homepage',
    'og:image=logo'
]
```

```js label="spec"
metas: string | object | [ ... string | object ]
```

Object properties are directly applied as `<meta>` attributes.

Where a string is specified (`name`), a *package.json* property is assumed.  When `name=prop` is specified, `name` is the "meta-name" and `prop` is the key in *package.json*.

By default a `name`/`content` attribute pair will be applied.  However, if the meta-name contains a colon(`:`) then this becomes a `property`/`content` pair instead.

For example, the following settings in *package.json*,

```js
"title": "Cardano App",
"author": "Ada Lovelace"
```

along with this config setting

```js
metas: [ { charset: 'utf-8' }, 'author', 'og:title=title' ]
```

produces the tags

```html
<meta charset="utf-8" />
<meta name="author" content="Ada Lovelace" />
<meta property="og:title" content="Cardano App" />
```

Note that tags being sourced from *package.json* are added only if the file has a non-nullish value for them.


## namespace

A string used internally to help prevent potential naming collisions.

```js label="default value"
namespace: 'docsite'
```

```js label="spec"
namespace: string
```

The string can contain only letters, numbers, dashes, and underscores.


## output

Details where generated artifacts will be placed.

```js label="default value"
output:
{
    dir: 'docs',
    name: 'index'
}
```

```js label="spec"
output: string | // merges
{
    /*
        Path where generated docsite files will be written.
    */
    dir: string,
    /*
        Name/Prefix for docsite generated files.
    */
    name: string
}
```

Specifying `output` as a string is the same as specifying `output.dir`.

`output.dir` also serves as root for the http server.

File output includes:

- `{dir}/{name}.html`: docsite html
- `{dir}/{name}-docsite.js`: docsite javascript
- `{dir}/{name}-examples.js`: docsite example code
- `{dir}/{name}-svelte-render.js`: docsite component compiler

If `name` includes path segments, subfolders will be created under `dir`.



## parsers

Specifies how to parse code by source language type.

```js label="default value"
parsers: []
```

```js label="spec"
parsers:
[
    { 
        /*
            Source file extension(s).
        */
        types: string | [ ...string ],
        /*
            Parser extension to use.
        */
        use: string | [ string, ...any ], 
    },
    ...
]
```

Specify file extensions (".js", ".jsx", ".svelte", etc.) in `types`.

A "fallback" record can be set by using `types: '*'`. The fallback is otherwise always set to the built-in JsDoc parser.


## root

Root path for the project containing the files to be documented.

```js label="default value"
root: process.cwd()
```

```js label="spec"
root: string
```

This is the base path for 
- relative file paths specified in config (`sections`, `watch`, etc.)
- relative `@example` file paths in JsDoc comments


## rootSection

Name of the section at the top of the docsite navigation hierarchy.

```js label="default value"
rootSection: 'root'
```

```js label="spec"
rootSection: string
```

See `sections` setting for more info on how this is used.


## scripts

Configures `<script>` tags for the `<head>` tag.

```js label="default value"
scripts: []
```

```js label="spec"
scripts: string | object | [ ... string | object ]
```

Object properties are directly applied as `<script>` attributes.

A string item is applied as the `src` attribute for the tag.

If `src` contains any whitespace whatsoever, it is assumed to be an inline script.


## sections

Organizational and content structure for the docsite pages.

```js label="default value"
sections:
{
    root:
    {
        title: 'Overview',
        overview: 'file:/readme.md',
        sections: [ 'components' ]
    },
    components:
    {
        title: 'Components',
        components: 
        { 
            include: '**/*.jsx', 
            exclude: 'node_modules/*'
        }
    }
}
```

```js label="spec"
sections:
{
    /*
        A name for the section (must be alphanumeric incl. underscores and dashes).
    */
    [name]: string |
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
            Markdown files to include for the section.
        */
        documents: @globfiles,
        /*
            Component files to include for the section.
        */
        components: @globfiles,
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

Specifying a string for `[name]` is the same as specifying the object form with `overview`.

Note that `overview` can alternatively be a path to a markdown file.  Simply prefix the path with `file:/`.

See [this page](section/structure) for more details on how this works.


## server

Configures the HTTP server.

```js label="default value"
server:
{
    enabled: false,
    port: 3010
}
```

```js label="spec"
server: true | false | // merges
{
    /*
        Enable HTTP server?
    */
    enabled: true | false,
    /*
        Port number where HTTP server listens for requests.
    */
    port: number
}
```

Specifying a boolean is the same as setting `server.enabled`.

For hot-reloading, `watch` option must also be enabled.


## socket

Websocket (server/browser) communication control.

```js label="default vallue"
socket:
{
    port: 3014,
    recoAttempts: 30,
    recoAttemptDelay: 1000
}
```

```js label="spec"
socket: number | // merges
{
    /*
        Web socket port to use.
    */
    port: number,
    /*
        Number of times to attempt reconnecting to server.
    */
    recoAttempts: number,
    /*
        Milliseconds before next reconnect attempt is made.
    */
    recoAttemptDelay: number
}
```

Specifying a number is the same as setting `socket.port`.

This option essentially defines *hot-reload* for the docsite, but has no effect unless both `httpServer` *and* `watch` are enabled, as the socket needs something to connect to and a reason to respond, respectively.

Change `port` if you have conflicts on your dev machine.  The other two properties control the frequency in which the browser attempts to reconnect with the server when a connection is lost (due to server restarts, errors, etc.).


## storage

Determines how to store docsite user state.

```js label="default value"
storage: 'local'
```

```js label="spec"
storage: 'local' | 'session' | 'none'
```

For the purposes of this setting "user state" includes
- asset filters
- expand/collapse state of most elements

The data will persist in `local` or `session` storage in the browser, or set to `none` to turn this off.


## style

Allows for styling of the docsite.

```js label="default value"
style: '#grayscape'
```

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

Please see the [styling documentation](document/docsite-styling) for a more extensive explanation.


## tagLegend

Defines the tags recognized by the docsite.

```js label="default value"
tagLegend: {}
```

```js label="spec"
tagLegend: // merges
{
    [tagname]: string |
    {
        /*
            Description for the tag.
        */
        desc: string
    },
    ...
}
```

`tagname` should be lowercase alphanumeric (incl. dashes).  A string value is the tag description.

Any tag attached to an asset that is not defined here will not be available as a filter in the docsite.


## title

Display name for the docsite.

```js label="default value"
title: packageJson.title
```

```js label="spec"
title: string
```


## tocDepth

Maximum depth level for the table of contents (ToC) menu.

```js label="default value"
tocDepth: 3
```

```js label="spec"
tocDepth: number
```

The ToC is generated from header tags (`<h1>`, `<h2>`, ... `<h6>`) appearing in markdown document content.  

This must be an integer between 0 and 6.  Specifying 0 turns off the TOC completely.

This is not available for component example files.


## toAssetId

Generates an asset id from a file path.

```js label="default value"
toAssetId: '{hex}'
```

```js label="spec"
toAssetId: @repath
```

This can be used to make prettier ids (used in URLs) for asset pages.

Resulting filepaths are **kebab-cased** for id generation.

> Care should be taken to ensure that each asset id will be unique across the docsite as page/content/links might not get rendered or resolved properly otherwise.


## toExampleFile

Generates the path to an example file from a source file path.

```js label="default value"
toExampleFile: [ /^(.+)\.[^./]+$/, '$1.md' ]
```

```js label="spec"
toExampleFile: @repath
```

This evaluation is skipped for source files specifying `@example` with a filepath in the primary JsDoc comment.

The default setting looks for an example with a *.md* extension at the exact same path.  E.g., an example file for `path/to/Component.jsx` would be looked for at `path/to/Component.md`.


## useFilenameOnly

Forces use of filename as component name.

```js label="default value"
useFilenameOnly: false
```

```js label="spec"
useFilenameOnly: true | false
```

When `true`, the basename of the filepath from whence the component came is used as the component's name in the docsite, ignoring the name coming from a configured parser.


## version

Current version of the component library or project.

```js label="default value"
version: `ver. ${packageJson.version}`
```

```js label="spec"
version: string | null
```


## watch

Manages automatic docsite rebuilds on file changes.

```js label="default value"
watch:
{
    enabled: false,
    delay: 1000,
    files:
    {
        include: '**/*.{js,jsx,md}',
        exclude: 'node_modules/*'
    }
}
```

```js label="spec"
watch: true | false | // merges
{
    /*
        Activate watch features?
    */
    enabled: true | false,
    /*
        Milliseconds to wait after a change before rebuilding site.
    */
    delay: number,
    /*
        Files to include on watchlist.
    */
    files: @globfiles
}
```

Specifying a boolean is the same as setting `watch.enabled`.

Some important notes on watch files:
- `output.dir` is __always__ excluded, regardless of settings
- files selected in `sections` __are not__ automatically watched

Also note that changes in a watched config file __will not__ be reflected in a hot-rebuild (for now).


# Custom Datatypes

Custom types (`@` prefixed type names) are detailed below.


## `@globfiles`

Glob pattern configurations for including files.

```js label="typedef"
@globfiles = string | [ ... string ] |
{
    /*
        Glob pattern(s) for selecting files to be included.
    */
    include: string | [ ... string ],
    /*
        Glob pattern(s) selecting files to be excluded from the files selected for inclusion.
    */
    exclude: string | [ ... string ]
}
```

Specifying `@globfiles` as a string or an array is the same as specifying `@globfiles.include`.

The `root` config option is used to resolve relative filepath globs.


## `@repath`

Converts filepaths from one form to another.

```js label="typedef"
@repath = string | function | null |
[ 
    string | RegExp | [ string | RegExp, string ], 
    string | function 
]
```

The `root` config option is used to resolve relative source paths.

- A function value receives the source path and should return a target filepath.
- A string value can be interpolated with information from the source path
  - `{dir}` - directory path to the file
  - `{name}` - name of the file (w/o extension)
  - `{ext}` - file extension
  - `{hex}` - hexadecimal value of the hash of the full source path
- An array value is used as parameters for `String.prototype.replace` against the source path. \
  Optionally, **RegExp** constructor parameters can be provided in an array as the first argument.

For example, the following value

```js
[ /^source[/](.+?)[.][^./]+$/, "example/$1.md" ]
```

would convert `source/components/layout/Grid.jsx` to `example/components/layout/Grid.md`.

See the docs for the referencing config option to understand how the output filepaths are used.
