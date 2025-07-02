---
cobeMode: static
---

# Styling the Docsite

This is going to be an extensive look at the `style` configuration option, which defines all the stying for a docsite.


## CSS Injection

Let's first discuss how CSS gets applied to the site.

ACID uses Svelte components under the hood, and most of the CSS is scoped to these components.  But the CSS does not actually live in the component source files. It lives in separate "theme files".  A theme file can have both scoped and global CSS for a docsite.

During a docsite build, theme file CSS is processed and divvied out to the appropriate components.  The top-level CSS classes in a theme file identify which component the individual rulesets belong to.

A theme file scope class takes the form

```css
.{group}-{name}
{
    /* component styles */
}
```

where `{name}` is the lower-cased name of the component and `{group}` is the name of the group the component belongs to.  

To find out which group a component belongs to, go to its docpage and look for a *group* tag (note that components with the *no-style* tag cannot be styled).

For example, the **Docsite** component can be styled using a `.app-docsite` class. 

```css
.app-docsite
{
    font-family: Palatino, sans-serif;
    font-size: 18px;
    display: grid;
    padding: 8px;
}
```

Any top-level selector that begins with `.{group}-{name}` (where `{name}` identifies a valid component that can be styled) will have its styles injected into the named component and automatically scoped to it. 

For instance, the below CSS ruleset would be injected into the **Title** component.

```css
.element-title.region-banner
{
    font-size: max(24px, 3.5vw);
    font-weight: 700;
}
```

Declarations and rulesets appearing inside a scoped selector are subject to Svelte's component styling rules.

The internal (pseudo-code) structure of ACID components is also in their docpages, and this can be used to determine how to properly construct selectors for internal component styling.


## Region Styling

To make things a bit more organized, docsite pages are partitioned into a common set of regions, which are identified by CSS classes.

These classes are placed on a component's root element (where applicable) right next to the class that identifies its scope.  The region class has the form `region-{region}` where `{region}` is one of

- **banner**: the docsite header region
- **leader**: header region for the page
- **main**: main content region
- **trailer**: footer region for the page
- **nav**: primary navigation region
- **footer**: the docsite footer region

So, to style the docsite header, you would add styles to a `.app-docsite.region-banner` selector.

Note that not all components appear in every region, but any combination of component/region is generally valid (i.e., not going to wind up being a global style).


## The `style` option

With the details above out of the way, we can now get into how the `style` config option works.

In its simplest form, `style` can specify a built-in theme.

```js
// prefix builtins with a `#`
style: '#grayscape'
```

Or, it can specify a stylesheet file.

```js
// prefix filepaths with `file:/`
style: 'file:/path/to/my/stylesheet.css'
```

Relative paths are resolved from `root` path in *acid.config.js*.

Or, it can *be* a stylesheet.

```js
// just paste the CSS
style: 'body { background: blue; color: yellow; }'
```

To specify multiple stylesheets, use an array.

```js
style: [ '#grayscape', 'file:/path/to/my/stylesheet.css' ]
```

By default, multiple sheets are processed from left to right, with top-level rulesets overwriting the ones in the previous sheet (shallow merging).

An object form is available which also allows to turn on deep-merging.

```js
style: { sheets: [ '#grayscape', 'file:/path/to/my/stylesheet.css' ], merge: true }
```

Multiple stylesheets are merged to form a singular one which is then applied to components as described above.


- - -

```handlebars:render label="Scope Classes"
<ul style="columns:12vw">
  {{#each scopes}}
    <li><code>{{this}}</code></li>
  {{/each}}
</ul>
```
