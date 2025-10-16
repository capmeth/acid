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
cobe: object |
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
            Set background color for CoBE blocks.
        */
        color: string | true | false,
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

Use an array for multiple records.  A single record can be specified by setting an object.

Below is a discussion of the settings for individual `cobe` records.

- ****`*.types`**** \
  Specify language type(s) ("js", "jsx", "vue", etc.) in `types`.  Types appearing more than once in the list are shallowly merged to form a single record for a given type.

  A "fallback" record can be set by specifying `types: '*'`. It is shallowly merged with the record corresponding to the code block's effective type - (i.e., global type settings).

  Note that a `default` type exists which gets applied to any block that does not specify a language type.

- ****`*.use`**** \
  Use `use` to specify the module that will render the code from the block (see [renderer docs](document/integration-renderers)).

- ****`*.color`**** \
  You can use a CSS color value here to set a background color for the CoBE render-box (for any non-static `mode`).  If the `mode` is "edit" or "live" a picker will also be available in the UI for changing the background color.  

  If set to `true` the color used is "#FFFFFF".  Omitting or setting to `false` forces a transparent background.

- ****`*.imports`**** \
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

- ****`*.mode`**** \
  Values available for `mode` are:
  - "static": just show the code
  - "render": only show rendered results
  - "demo": show code and rendered results (no editing)
  - "edit": code editing with on-demand render
  - "live": code editing with immediate render

  A code block's `mode` will be forced to "static" if no `use` exists for its language marker (no way to render anything).

- ****`*.noHighlight`**** \
  Set `noHighlight` to `true` to turn off code highlighting.  This has no effect if highlighting for the block's language-type is not supported or not loaded (see `hljs` option).


## cobeSvelte

Builds the default Svelte renderer.

```js label="default value"
cobeSvelte: false
```

```js label="spec"
cobeSvelte: true | false
```

Remember that this only tells ACID to generate the renderer with a docsite build.  To use it, you will still need to set it up in `cobe` with the specifier "svelte-render".


## components

Add custom components or replace internal docsite components.

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

The `[name]` should take the form `group/Component` where `Component` is the proper name of the component and `group` is one of the following custom component groups:

- *page* - page-level internal components
- *main* - all other internal components
- *embed* - user-defined markdown-available components
- *user* - all other user-defined components

While things can be mapped as desired here, it is recommended to use only *page* and *main* groups for replacing internal components, and *embed* or *user* groups for any other user-defined components.

Components mapped in the *embed* group will be available for use in markdown documents.  The component's name within a markdown document is the **PascalCased** name of everything that follows *embed/*.

Relative filename values are subject to `root` config option.

For example, if you have a custom component at *src/components/Homepage.svelte* that you want to use in place of the internal **Home** component, do

```js
components:
{
    'page/Home': 'src/components/Homepage'
}
```

The docsite build can resolve *.svelte* and *.svt* extensions automatically, so the extension is not required.

Setting a value to `null` or an empty string has the same effect as omitting it - the default internal component will be used.  This obviously only works for components that have defaults.

Visit [Customizing Components](document/integration-components) for more details on how all this works.


## configs

Array of additional configuration objects, functions, or module specifiers.

This has no default value.

```js label="spec"
configs: string | function | object
[
    string | [ string, any ] | function | object,
    ...
]
```

Use this to merge in plugin configurations or additional configuration objects.

- A string is a module specifier that `export default`s a function that returns a configuration function or object.
  
  You can use an array if you need to pass a parameter to a module, but you must enclose it in an array even if it is the only item specified.

  ```js
  configs: [ [ 'module_specifier', { /* parameter */ } ] ]
  ```

  Configuration modules are loaded via Rollup. This means that ESM's `import.meta` will not be available on import.  As a convenience, any appearance of the string `__plugin_dirname` (with word boundaries) will be replaced by the absolute directory path to the imported file.

  So you would use,

  ```js
  let file = path.resolve('__plugin_dirname', './local-file.js');
  ```

  in place of

  ```js
  let file = import.meta.resolve('./local-file.js');
  ```

  Remember that it is a literal value replacement, so quote it if you want it to be a string.

- A function is passed the configuration object to add/change configuration as needed.  The return value is ignored.

- An object can include any config option defined in this document and will be merged into current configuration.

Here's how the final set of configuration options (*master*) is determined:
1. Set master to default config options.
2. Get options from the config file (*acid.config.js*).
3. Merge (object) or apply (function) options with master.
4. Get and remove `configs` from master.
5. For each item in `configs` get options and go to step #3 (recursive).

Step #5 repeats until all specified `configs` are merged.  

> Take care to not create circular references here, there is no protection against this.


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


## finalizeAsset

Review discovered asset data.

```js label="default value"
finalizeAsset: null
```

```js label="spec"
finalizeAsset: function | null
```

The function receives each asset data object in the form that will be serialized into the build, and it must return the final form of the asset.  

Changing `tid`, `uid`, or `section` will have no effect here.  A nullish return value will cause the asset to be skipped.

You can use this, for example, to omit component assets without example files.

```js
finalizeAsset: asset => 
{
    let isComponent = asset.tid === 'cmp';
    let hasExample = !!asset.mcid;

    if (!isComponent || hasExample) return asset;
}
```

Remember that non-serializable data (functions, symbols, etc.) returned in the asset object will not survive the trip to the browser.


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

```svelte mode="render" label="default value" allow-css
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


## noRecognition

Hide the ACID logo.

```js label="default value"
noRecognition: false
```

```js label="spec"
noRecognition: true | false
```

ACID adds a "watermark" logo in the lower right corner of the sites it generates.  It is very unobtrusive, mostly transparent, allows interaction with content underneath it, and is great way to acknowledge the tool that made your docsite possible!

...so please, never set this to `true`, ok? 🙏🏼

And, yes, this setting was intentionally named to make you feel a bit guilty 😉


## noticeTimeout

Milliseconds in which to wait before dismissing a notification.

```js label="default value"
noticeTimeout: 2000
```

```js label="spec"
noticeTimeout: number
```

Currently, this only affects *copy-to-clipboard* notices.


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


## refLinks

Global link reference definitions for markdown content.

```js label="default value"
refs: []
```

```js label="spec"
refs: string | object | [ ... string | object ]
```

A string is assumed to be markdown content, or a path to a markdown file when prefixed with `file:/`.  The markdown is parsed only for its link reference definitions, and the rest of the document is discarded.

In object form, each entry is a separate definition.

The array form allows for specifying multiple strings and/or objects as defined above.  They are processed in the order given, with latter definitions overriding previous ones.

These link reference definitions are made available to **all** of the markdown content parsed into the docsite by passing the resulting entries here to [Takedown]'s `refs` config option.  Please review the documentation there to understand how to properly construct these definitions in both object and markdown forms.


## root

Absolute path to the project targeted for documentation.

```js label="default value"
root: process.cwd()
```

Serves as the root path for just about every file-related activity in a docsite build.

This value is immutable.  It exists on the config for reference only.


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
        sections: [ ... string ],
        /*
            Code block render settings for this section and its descendants.
        */
        cobe: /* same settings as `cobe` option */
    },

    // add as many sections as needed...
    ...
}
```

All of the properties above are optional.

Specifying a string for `[name]` is the same as specifying the object form with `overview`.

Note that `overview` can alternatively be a path to a markdown file.  Simply prefix the path with `file:/`.

See [Site Structure](section/structure) for more details on how all this works.


## server

Configures the HTTP server.

```js label="default value"
server:
{
    enabled: false,
    port: { port: [ 3000, 3010, 3020 ] }
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
    port: number | null | object
}
```

Specifying a boolean is the same as setting `server.enabled`.

An object `port` value will be passed to [get-port](https://www.npmjs.com/package/get-port) to attempt to find an open port for the server to use.  Setting `null` will invoke the same without any parameter.  Setting a number indicates that **only** the specified port should be used.

For hot-reloading, `watch` option must also be enabled.


## socket

Websocket (server/browser) communication control.

```js label="default value"
socket:
{
    port: { port: [ 3005, 3015, 3025 ] },
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
    port: number | null | object,
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

This option essentially defines *hot-reload* for the docsite, but has no effect unless both `server` *and* `watch` are enabled, as the socket needs something to connect to and a reason to respond, respectively.

The `port` option functions just like `server.port`.

The `reco*` properties control the frequency in which the browser attempts to reconnect with the server when a connection is lost (due to server restarts, errors, etc.).


## storage

Determines how to store docsite user state.

```js label="default value"
storage: 'session'
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
- #acidic

When specifying relative file paths, `root` is assumed to be the root path.

All `sheets` are converted to JSON and deep merged from left to right to form the final stylesheet.  The final styles are then injected into the internal components based on top-level scope definitions. Any styling not within a scope definition is assumed to be global.

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
            Assigns the tag to the asset automatically.
        */
        assign: function | null
        /*
            Description for the tag.
        */
        desc: string
    },
    ...
}
```

Setting `[tagname]` to a string is the same as setting `[tagname].desc`, and `[tagname]` itself must be a lowercase alphanumeric (incl. dashes) value.

The `assign` function will receive a data object for each asset parsed.  It must return `true` or a non-empty string for the tag to be added to the asset.

Any tag attached to an asset that is not defined here will not be functional in the docsite.


## title

Display name for the docsite.

```js label="default value"
title: packageJson.title ?? 'Untitled'
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

By default, this is not available for component example files.


## toAssetAccessLine

Generates an access line (generally, an import statement) for an asset.

```js label="default value"
toAssetAccessLine: null
```

```js label="spec"
toAssetAccessLine: @repath
```

No access lines will be generated if set to `null`.

This becomes the `accessLine` property of the asset.


## toAssetId

Generates an asset UID from a file path.

```js label="default value"
toAssetId: '{hex}'
```

```js label="spec"
toAssetId: @repath
```

This can be used to make prettier ids (used in URLs) for asset pages.

The resulting value is **kebab-cased** for id generation.  If it falsey, the asset will be omitted from the docsite.

> Care should be taken to ensure that each UID is unique across the docsite as page/content/links might not get rendered or resolved properly otherwise.


## toAssetName

Generates an asset name from a file path.

```js label="default value"
toAssetName: '{name}'
```

```js label="spec"
toAssetName: @repath
```

Called when an asset is needs to derive its name from its filepath.

Resulting values will be **Capital Cased** for document asset name generation.


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


## updateMarkdown

Globally manipulate all docsite markdown content.

```js label="default value"
updateMarkdown: null
```

```js label="spec"
updateMarkdown: string | RegExp | object | function | null
[
    string |
    [ 
        string | RegExp | [ string | RegExp, string ], 
        string | function 
    ] |
    {
        search: string | RegExp | [ string | RegExp, string ],
        replace: string | function 
    }
    ...
]
```

Every markdown string passes through this option before being parsed into HTML.

A function value is passed a markdown string and should then return the new markdown.

The array form represents `String.prototype.replace` calls that are each played in the order given against a markdown string.  For each *value* in the array,
- a string or RegExp is treated as `replace(value, '')`
- an array is treated as `replace(value[0], value[1])`
- an object is treated as `replace(value.search, value.replace)`

If the first parameter to `replace()` would be an array, it is first spread as parameters to `RegExp()` before being passed along.  If the would-be second parameter is nullish it converts to an empty string.

Take care with this syntax as something like

```js
updateMarkdown: [ /code/g, 'toad' ]
// => remove all "code" strings and the first "toad" string
```

is a bit different from

```js
updateMarkdown: [ [ /code/g, 'toad' ] ]
// => replace all "code" strings with a "toad" string
```

Setting any other valid *value*, except for `null`, is the same as setting `[ value ]`.

Omitting or setting to `null` turns this feature off.

> Note that this feature **ignores** markdown front-matter.


## useFilenameOnly

Forces a component's name to be a derivation of its filepath.

```js label="default value"
useFilenameOnly: false
```

```js label="spec"
useFilenameOnly: true | false
```

When `true`, Component assets will be forced to get their names (titles) from `toAssetName`, ignoring any name coming from a configured parser.


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
    options: [ '.git', 'node_modules' ]
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
        File and directory paths to be watched (not globs).
    */
    paths: string | [ ... string ],
    /*
        Chokidar options.
    */
    options: object | any
}
```

Specifying a boolean is the same as setting `watch.enabled`.

The settings `paths` and `options` are passed directly to `chokidar.watch()` (with some caveats below).  Please refer to the [chokidar docs](https://www.npmjs.com/package/chokidar) for more information on these settings.

The aforementioned caveats:
- if no `paths` are given, `root` is assumed
- seting `options` as a non plain-object value actually sets `options.ignored`
- `options.cwd` is always set to `root`
- `options.ignoreInitial` is always set to `true`

The default settings effectively watch the whole project directory for changes, excluding *.git* and *node_modules* folders.

Changes within `output.dir` (if included in watch) do not cause rebuilds. They will simply cause a page reload (if server is also running) instead.

It is highly recommended to set `paths` to something(s) other than the project root directory, especially if you don't need to watch things like dependencies and git metadata.  Too many files will overwhelm Chokidar.

```js label="Example Setup"
watch:
{
    // watch source/documentation folders, acid config, etc.
    paths: [ 'src', 'docs', 'acid.config.js', 'readme.md' ],
    // watch certain types of files - .js, .jsx, .md, etc.
    options: (path, stats) => stats?.isFile() && /\.(jsx?|md|yaml)&/.test(path)
}
```


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

The `root` option is used to resolve relative source paths.

- A function value receives a source path info object with the following and should return a string.
  - `path` - the source filepath (absolute)
  - `sub` - the source filepath (relative)
  - `dir` - directory path
  - `base` - filename with extension
  - `name` - filename w/o extension
  - `ext` - filename extension
  - `hex` - hexadecimal value of hash of `path`
  - `sep` - path separator character
- A string value can be interpolated with information from the source filepath using brace-enclosed 
  keys from those above (e.g. `{name}` for filename).
- An array value is used as parameters for `String.prototype.replace` against the source subpath. \
  Optionally, **RegExp** constructor parameters can be provided in an array as the first argument. \
  For example, the following value
  ```js
  [ /^source[/](.+?)[.][^./]+$/, "example/$1.md" ]
  ```
  would convert `source/components/layout/Grid.jsx` to `example/components/layout/Grid.md`.

See the documentation for the referencing config option to understand how the output strings are used.
