---
title: Markdown Options
cobeMode: static
---


# Document Level Options

ACID will look for configuration options in a markdown document's front-matter.

For ACID, front-matter is parsed as YAML key-value pairs enclosed by standard triple-dash delimiters.

```yaml
---
title: Technical Specs
cobeMode: static
---
```

These settings will take precedence over their equivalents (as applicable) in an *acid.config.js* file for the document in which they appear.  


## cobeMode

Default mode for CoBEs embedded in the content.

```yaml label="spec"
cobeMode: demo | edit | live | render | static 
```

Unless `static` is forced, only the code block itself can override this.  See config option `cobe` for more details on CoBE modes.

Example: Set the default CoBE mode to "render" for all code blocks in the document.

```yaml
cobeMode: render
```


## tags

Tags to associate with the document.

```yaml label="spec"
tags: string | array
```

Unlike source comment `@tags`, an array can be used here.  Same rules apply.

Please see [tagging docs](document/docsite-tagging) for more details on this.


## title

Sets the displayed title of the document.

```yaml label="spec"
title: string
```

When not specified, the **Capital Cased** name of the file is used (e.g. `getting-started.md` becomes "Getting Started").  This setting is ignored for example files.  Also ignored for `section.*.overview` documents when the section already has a `title`.


## tocDepth

Maximum depth level for the table of contents (TOC) menu.

```yaml label="spec"
tocDepth: number
```

This will override `tocDepth` setting in *acid.config.js* file.  See that setting for more details on this.


# Code-Block Level Options

All fenced code blocks are rendered by CoBE (Code Block Editor) components, and these blocks can have configuration options as well.  

Generally, options are defined on the opening fence in standard HTML attribute form (`attr="value"`) after the language-type specification.

There must be at least one space after the `lang-type` before defining options.  That space must still be present even if the `lang-type` is not.

````md
```js label="example"
let example = "Here's an example of a labeled code block";
```
````


## allow-css

CoBE rendering containers are protected from docsite CSS by default (as long as the proper selectors are used in styling).  If you wish to allow this CSS to affect these containers you can set the `allow-css` attribute.

````md
``` allow-css
Code rendered from this block is affected by docsite CSS.
```
````

The attribute has no value.  It's mere appearance signifies activation.


## cobe-mode

Rendering mode for the CoBE component associated to this block.

This overrides any mode set in the document or in *acid.config.js*.  However, if there is no renderer configured for the language-type of the block, "static" mode will be forced.

This setting is appended to the `lang-type` via a colon (`:`) rather than being a separate attribute option.

````md
```svelte:[cobe-mode]
let string = "[cobe-mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
````

The values available for `cobeMode` are:
- **demo**: show code and rendered results (no editing)
- **edit** - code editing with on-demand render
- **live** - code editing with immediate render
- **render**: only show rendered results
- **static** - just show the code

Using the example block above here are examples of each mode.

```svelte:demo label="demo mode"
let string = "[cobe-mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
```svelte:edit label="edit mode"
let string = "[cobe-mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
```svelte:live label="live mode"
let string = "[cobe-mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
```svelte:render label="render mode"
let string = "[cobe-mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
```svelte:static label="static mode"
let string = "[cobe-mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```


## label

Provides a caption for the code block.

For example, this

````md
``` label="Block Label"
This block has a label.
```
````

would produce this

``` label="Block Label"
This block has a label.
```


## lang-type

Language name/abbreviation for the content-type of the block.

As is standard, this value comes immediately after the opening fence of a block.

````md
```js
// this code block uses javascript
```
````

This value indicates how the block should be highlighted (for HighlightJs) as well as which extension CoBE should use to parse the code for rendering (if applicable).
