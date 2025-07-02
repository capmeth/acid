---
title: Code Rendering Extensions
cobeMode: static
---


The docsite allows for HTML code blocks to be rendered in an interactive state.  This means a user can edit the code and then see the results of those edits live in the browser.  A given block could be js, vue, react, etc., of course, so the docsite needs an extension in order to be able to compile and render the result.

This is where Code Rendering Extensions (CREs) come in.

Use the `cobeSpecs` settings to configure a CRE.

```js:static
cobeSpecs:
[
    { types: [ 'js', 'jsx' ], use: [ 'render-ext', [ 10, true ] ], mode: 'static' }
]
```

In the above example, we have a single spec that specifies the use of a **render-ext** CRE to render content for js and jsx code blocks in the docsite.

The CRE module must `export default` a function of the form

```js:static
function (param: any, lang: string): { render: function, config: object }
```

When the docsite loads in the browser, the this function will be called once for each of the language `types` it is to be associated with (`lang` parameter), along with the configuration parameter (`param`), if provided.

Here is the general idea from the docsite's perspective:

```js:static
import renderConfig from 'render-ext'

let { render: jsRender, config: jsConfig } = renderConfig([ 10, true ], 'js');
let { render: jsxRender, config: jsxConfig } = renderConfig([ 10, true ], 'jsx');
```

The returned `config` is a rollup configuration object that can include any plugins necessary for the build step (other options are ignored).  The input (virtual) file name will be `cobe-example.[lang]`, with `[lang]` being the language extension.  The output format is "esm".

The `render` function should have the form:

```js:static
async function (params: object): void
```

It is called every time a code block with the associated lang marker needs to be rendered.  The `params` parameter will contain the following:

- `source: string`: raw content from the code block
- `imports: string`: import statements for hosted app bundle
- `build: function`: generates a module (bundle) from `source`
- `el: HTMLElement`: host or mount element for the component

The render function should do the following:

1. Add `imports` into `source` as appropriate so that it is accessible to the code.
2. Modify `source` to construct the proper component export for the framework supported.
3. Pass the updated `source` to `build` and await result.
4. Take the component export from `build` and mount it to `el`.

Here's a pseudocode-ish example of a render function.

```js:static
import Framework from 'supported-component-framework';
import transform from './transform-source-into-component.js';

let render = async ({ source, imports, build, el }) =>
{
    return new Promise((accept, reject) => 
    {
        try
        {
            // #1
            source = imports + source;
            // #2     
            source = transform(source);
            // #3
            let { default: Component } = await build(source); 
            // #4
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

- - -

ACID ships with a built-in CRE, **@capmeth/acid/ext-handlebars**, which is based on the [Handlebars](https://handlebarsjs.com) templating engine.

In your *acid.config.js* file... set it up as a renderer:

```js
cobeSpecs:
[
    { 
        types: [ 'handlebars', 'hbrs' ], 
        use: 
        [ 
            '@capmeth/acid/ext-handlebars',
            {
                context: { /* global context variables */ }
            } 
        ], 
        mode: 'edit' 
    }
]
```

The extension allows for additional context variables (optional) that will be available to each code block.

The example also adds a shorthand "hbrs" for the code block language-type (typing "handlebars" on every block might get tedious).

Add handlebars language to `hljs` setup for syntax highlighting (optional).

```js
hljs: { languages: 'handlebars' }
```

In a handlebars code block, the template context is available as `tc`.  

Put code into the block in two parts: Write JS as normal at the top of the block, adding/changing variables on `tc` as needed; at the bottom of the block, write the handlebars template to be rendered.

````md label="example"
```handlebars
tc.name = "Judith";
<div>Hello {{ name }}!</name>
```
````

The app bundle (if available) will be spread into the template context.

Please see the [Handlebars Guide](https://handlebarsjs.com/guide/) for more details on configuration and usage.
