---
title: CoBE Code Injection
cobeMode: static
---


You will of course want to use ACID as a styleguide for your own component library or project.  This how-to covers how to make your components available in the docsite CoBEs (Code Block Editors).

ACID does not build your code for you.  If you are building a component library, you may already be bundling your components and other library artifacts for export.  If not, you should generate the bundle(s) of exports that you wish the docsite to have access to.

Here's an example entry/input file for a bundle.

```js label="my-project-entry.js"
export { default as Button } from 'components/Button.svelte'
export { default as Icon } from 'components/Icon.svelte'
export { default as ActionForm } from 'components/ActionForm.svelte'
...
```

Once you have this file bundled (*my-project-bundle.js*), you should copy it to `config.output`.

You can use `config.copy` for this.

```js
copy: { files: 'path/to/my-project-bundle.js', to: 'my-project-bundle.js' }
```

This `to` setting ensures the bundle is copied to the root of `config.output.dir`.

Next, we need to make the bundle "importable" for the browser.

```js
importMap: 
{ 
    "#bundle": "./my-project-bundle.js"
}
```

Above we have made *#bundle* a module specifier for our project bundle via browser [import mapping](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps).

Let's now make the bundle accessible to CoBEs in the browser.  We do this using the `imports` feature in `config.cobe` for the necessary language-type.

If your project bundles Svelte components, for example, you can use the internal svelte renderer with a setup like this

```js
cobe: { types: 'svelte', use: 'svelte-render', mode: "edit", imports: { '#bundle': '*' } }
```

What this does is make sure all of the **named exports** from *#bundle* are imported by name automatically for every renderable CoBE of language-type *svelte*.

> Remember to also set `cobeSvelte: true` to ensure the build generates the renderer.

If you are using a different renderer extension, consult with its documentation to be sure that it supports injecting `imports` into code blocks.

You should now have access to your bundle's exports from within code in a fenced markdown block.

````md
```svelte
<Button onclick={() => alert('It works!')}>
  <Icon name="thumbs-up" size="medium" /> Click Me!
</Button>
```
````

****Bonus Round**** \
While running the ACID dev server in watch mode, you can have it also watch the bundle file and trigger a rebuild when it changes.

```js
watch:
{
    enabled: true,
    files: 
    [ 
        'components/**/*.svelte',
        'path/to/generated/my-project-bundle.js', 
        ...
    ]
}
```

You can leave out the `enabled` flag if you wish to control that from the CLI.

In order for this to work, file bundles must not be generated directly into `config.output.dir`, as `config.watch` will **always** ignore anything in that directory.

Finally, putting all of the config for this tutorial together...

```js label="acid.config.js"
{
    copy: { files: 'path/to/my-project-bundle.js', to: 'my-project-bundle.js' },

    importMap: { "#bundle": "./my-project-bundle.js" },

    cobe: { types: 'svelte', use: 'svelte-render', mode: "edit", imports: { '#bundle': '*' } },

    cobeSvelte: true,
    
    watch:
    {
        enabled: true, // or use -w flag with cli
        files: 
        [ 
            'components/**/*.svelte',
            'path/to/generated/my-project-bundle.js', 
            ...
        ]
    }
}
```
