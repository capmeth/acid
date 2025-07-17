---
title: Code Rendering Extensions
cobeMode: static
---

# Making a Rendering Extension

The docsite allows for markdown code blocks to be rendered to HTML in an interactive state.  This means a user can edit the code and then see the results of those edits live in the browser.  

A given block could be written in js, vue, react, etc., of course, so we have to tell ACID how to handle the language-type in order to be able to dynamically compile and render components.

We do this via the `cobe` settings.

```js:static
cobe:
[
    { types: [ 'js', 'jsx' ], use: [ 'render-ext', [ 10, true ] ], mode: 'static' }
]
```

In the above example, we have an import name that specifies the use of the **render-ext** module to render content for js and jsx language-type code blocks in the docsite.

> Remember that all this runs in the browser, so the module specified by `use` must be browser accessible (possibly via an import map) as it will be dynamically imported.

The imported module must `export default` a function of the form

```js
function (param: any, lang: string): { render: function, config: object }
```

When the docsite loads in the browser, this function will be called once for each of the language `types` it is to be associated with (`lang` parameter), along with the configuration parameter (`param`), if provided.

Here is the general idea from the docsite's perspective:

```js
import renderConfig from 'render-ext'

let { render: jsRender, config: jsConfig } = renderConfig([ 10, true ], 'js');
let { render: jsxRender, config: jsxConfig } = renderConfig([ 10, true ], 'jsx');
```

The returned `config` is a rollup configuration object that can include any plugins necessary for a build step (other options are ignored).  The input (virtual) file name will be `cobe-example.[lang]`, with `[lang]` being the language extension.  The output format is "esm".

The `render` function should have the form:

```js
async function (params: object): void
```

It is called every time a code block with the associated lang marker needs to be rendered.  The `params` parameter will contain the following:

- `source: string`: raw content from the code block
- `build: function`: generates a module (rollup bundle)
- `modulize: function`: "modulizes" a script via a data url
- `el: HTMLElement`: host or mount element for the component

The render function should generally do the following:

1. Modify `source` to construct the proper component export for the framework supported.
2. Pass the updated source to `build` or `modulize` to generate the code module.
3. Extract the component from #2 and mount it to `el`.

Here's a pseudocode-ish example of a render function.

```js
import Framework from 'supported-component-framework';
import transform from './transform-source-into-component.js';

let render = async ({ source, imports, build, el }) =>
{
    return new Promise((accept, reject) => 
    {
        try
        {
            // #1
            source = transform(source);
            // #2
            let { default: Component } = await build(source); 
            // #3
            Framework.mount(Component, el);

            accept();
        }
        catch (error)
        {
            reject(error);
        }
    });
}
```

Promise rejections in the rendering process will be caught and displayed to the user.


# Built-in Svelte Renderer

As ACID is built on Svelte, a dynamic component renderer is included out-of-the-box (makes sense, right?).

It is available as a module named "svelte-render".

In your *acid.config.js* file... you can set it up as a renderer:

```js
cobe:
[
    { types: [ 'svelte', 'svt' ], use: 'svelte-render', mode: 'edit' }
]
```

Note the example also adds a shorthand "svt" for the code block language-type (save a few keystrokes).

There is no default syntax highlighting for svelte, so you may wish to alias it (jsx is probably the closest).

```js
hljs: 
{ 
    aliases: { svelte: 'svt' },
    languages: 'svelte'
}
```

In a markdown code block, you can write a .svelte file as normal (`<style>` blocks currently not supported).

````md
```svelte:edit
<h1 {onclick}> Hello there, { bool ? 'Mark' : 'Fred' }! </h1>

<script>
let bool = $state(false);
let onclick = () => bool = !bool
</script>
```
````

Or, you can use the code/template split style.

````md
```svelte:edit
let bool = $state(false);
let onclick = () => bool = !bool
<h1 {onclick}> Hello there, { bool ? 'Mark' : 'Fred' }! </h1>
```
````

The split form simply requires that the block opens with code at the top, and then a template comes after.
