---
title: Markdown Options
cobeMode: static
---


Here you will find information about how to add document-specific configuration options in the front-matter of a markdown file, as well as block-specific options that can be added to the info-strings of fenced code within.

Keep in mind that the HTML from parsed markdown documents are compiled as Svelte component templates.


# Document Level Options

ACID will look for configuration options in a markdown document's front-matter.

Front-matter is parsed as YAML key-value pairs enclosed by standard triple-dash delimiters.

```yaml
---
title: Technical Specs
cobeMode: static
---
```

These settings will take precedence over their equivalents (as applicable) in an *acid.config.js* file for the document in which they appear.  


## cobeColor

Default background color for CoBEs.

```yaml label="spec"
cobeColor: string
```

A string value can be any valid CSS color value.  If the mode of the block is "edit" or "live" a color picker is added to CoBE that allows the user to change the background.  If `true` is set the color defaults to "#FFFFFF" (white).  Omitting or setting `false` turns this feature off.

Also see `config.cobe` option `color` setting.


## cobeMode

Default mode for CoBEs.

```yaml label="spec"
cobeMode: demo | edit | live | render | static 
```

Unless `static` is forced, only the code block itself can override this.  See `config.cobe` option for more details on CoBE modes.

Example: Set the default CoBE mode to "render" for all code blocks in the document.

```yaml
cobeMode: render
```


## escapeBraces

Escapes all brace (`{'{}'}`) characters in the document.

```yaml label="spec"
escapeBraces: true | false
```

Brace-enclosed content in markdown will normally be interpreted as Svelte directives or javascript expressions.  

Setting this option to `true` will svelte-escape **all** braces in the document, preventing them from being interpreted by the Svelte compiler.  Svelte components can still be embedded in the document, however, but their use will effectively be limited to HTML-conformant syntax only.

Leaving this unset or `false` means you must svelte-escape literal braces manually or compiling errors may occur.  Use single-quotes for this, as double-quotes will be converted to HTML entities and tick-quotes to `<code>` tags by the markdown parser.

For example

````md
Escape the {'{'} braces {'}'}.
````

gives you, "Escape the {'{'} braces {'}'}."

In general, remember that unless you are coding within an opening or closing HTML or component tag, you are "out in the wild" and subject to CommonMark's markdown transformation rules.

> Fenced code blocks are unaffected by this setting, as they are extracted from the markdown before compilation.


## moduleScript

Add additional code to `<script module>` of the document component.

```yaml label="spec"
moduleScript: string
```

Every document component will have a `<script module>` element (for CoBE support and imports coming from `config.components`), and Svelte allows for only one of these to exist in a component definition.  If you need to put code at this level you must do so here to get it appended within the existing element.

Remember that you can still append a plain `<script>` element to the markdown content if needed.


## tags

Tags to associate with the document.

```yaml label="spec"
tags: string | array
```

Unlike source comment `@tags`, an array can be used here.  Same rules apply.

Please see [tagging docs](/document/docsite-tagging) for more details on this.


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

````md
```js label="example"
let example = "Here's an example of a labeled code block";
```
````

There must be at least one space after the `lang-type` before defining options.  That space must still be present even if the `lang-type` is not.


## allow-css

Background color for the render-box of the CoBE component rendering this block.

This overrides any color set in the document (`cobeColor`) or in `config.cobe`.  It has the same behavior as those as well.

````md
``` color="#00FF00"
Render everything on a green background.
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


## file

Specifies a file to be loaded.

````md
``` file="path/to/code.js"
Everything in here will be ignored.
```
````

File loading is handled at build time.  Relative filepaths are subject to `config.root`.

The content of the code block will be *replaced* by the file contents.


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

This value indicates how the block should be highlighted as well as which extension CoBE should use to parse the code for rendering (if applicable).


## mode

Display mode for the CoBE component rendering this block.

This overrides any mode set in the document (`cobeMode`) or in `config.cobe`.  However, if there is no renderer configured for the language-type of the block, "static" mode will be forced.

````md
```svelte mode="[mode]"
let string = "[mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
````

Alternatively, this setting can be appended to the `lang-type` via a colon (attribute takes precedence).

````md
```svelte:[mode]
let string = "[mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
````

The values available for `[mode]` are **demo**, **edit**, **live**, **render**, and **static**.

Copying the example block above here are examples of each mode.

```svelte:demo label="demo - displays the code and the render with no update capability"
let string = "[mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
```svelte:edit label="edit - displays the code and the render with on-demand update capability"
let string = "[mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
```svelte:live label="live - displays the code and the render with immediate update capability"
let string = "[mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
```svelte:render label="render - displays the render only"
let string = "[mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
```svelte:static label="static - displays the code only"
let string = "[mode] is demo, edit, live, render, or static";
<div style="color:blue">{ string }</div>
```
