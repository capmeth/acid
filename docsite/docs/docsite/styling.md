---
cobeMode: static
---

# Styling the Docsite

Here we'll take an extensive look at the `style` configuration option, which defines all the styling for a docsite.


## CSS Injection

Let's first discuss how CSS gets applied to the site.

ACID uses Svelte components under the hood, and most of the CSS is scoped to these components.  But this CSS does not actually live in the component source files. It lives in separate "theme files".  A theme file can have both scoped and global CSS for a docsite.

During a docsite build, theme file CSS is processed and divvied out to the appropriate components.  The top-level CSS classes in a theme file identify which component the individual rulesets belong to.

A theme file scope class takes the form

```css
.group-name
{
    /* component styles */
}
```

where `name` is the lower-cased name of the component and `group` is the name of the group the component belongs to.  

To find out which group a component belongs to, go to its docpage and look for a *group* tag (note that components with the *no-style* tag cannot be styled).

For example, the **Docsite** component can be styled using the `.app-docsite` class. 

```css
.app-docsite
{
    font-family: Palatino, sans-serif;
    font-size: 18px;
    display: grid;
    padding: 8px;
}
```

Any top-level selector that **begins with** a valid `.group-name` will have its styles injected into the named component and automatically scoped to it. 

For instance, the below CSS ruleset would be injected into the **Title** component.

```css
.element-title.region-banner
{
    font-size: max(24px, 3.5vw);
    font-weight: 700;
}
```

However, the following would **not** be scoped to the component.

```css
.region-banner.element-title
{
    font-size: max(24px, 3.5vw);
    font-weight: 700;
}
```

CSS Declarations and rulesets appearing inside a scoped selector are of course subject to Svelte's component styling rules.

The internal (pseudo-code) structure of ACID components can be found in their docpages, and this info can be used to determine how to properly construct selectors for internal component styling.


## Region Styling

To make things a bit more organized, docsite pages are partitioned into a common set of regions, which are identified by CSS classes.

These classes are placed on a component's root element (where applicable) right next to the class that identifies its scope.  The region class has the form `region-{region}` where `{region}` is one of

- **banner**: docsite header region
- **main**: full content region for the page
  - **leader**: header region for the page
  - **primary**: main content region for the page
  - **trailer**: footer region for the page (currently unused)
- **nav**: navigation region for the page
- **footer**: docsite footer region

with `leader`, `primary`, and `trailer` being sub-regions of `main`.

So, to style the docsite header, you would add styles to a `.app-docsite.region-banner` selector.

Note that not all components appear in every region.


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

Multiple sheets are processed from left to right, with later sheet styles being deeply merged atop former ones.  Once a singular stylesheet has been constructed it is then applied to components as described above.

```svelte:render label="Scope Classes" allow-css
import { scopes } from '#bundle';
<ul style:columns="12vw">
  {#each scopes as scope}
    <li><code>{ scope }</code></li>
  {/each}
</ul>
```

## Protecting CoBE

The CoBE code block rendering space needs to be protected from ACID docsite styling.

While the Svelte component scoping certainly helps with this, it is not a complete solution, especially when considering global styles.

The **Renbox** component uses a div with a CSS class of the same name inside which the CoBE rendering is done.

Firstly, the class must prevent the cascade from leaking into itself.

```css
.renbox
{
    all: initial !important;
}
```

Secondly, globally-scoped rulesets with CSS declarations must have a `:not(.renbox *)` pseudo-class appended to them to prevent selection of `.renbox` descendants.

```css
.markup
{
    em:not(.renbox *)
    {
        font-style: italic;
        letter-spacing: 0.5px;
    }
}
```

ACID does its best to detect affected rulesets (including those within component-scoped `:global` markers), and applies the pseudo-class where applicable.  But there may be situations where it will need to be added manually if you find that styling is leaking into the rendering.

> Note that because of the way CSS `:not` works, the pseudo-class **must** be appended to selectors that define styling declarations directly.  This trick **will not** work if appended to a parent selector.
