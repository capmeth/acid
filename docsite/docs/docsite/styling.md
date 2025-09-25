---
cobeMode: static
---

# Styling the Docsite

Here we'll take an extensive look at the `style` configuration option, which defines all the styling for a docsite.


## CSS Injection

Let's first discuss how CSS gets applied to the site.

ACID uses Svelte components under the hood, and by default most of the CSS is scoped to these components.  But this CSS does not actually live in the component source files. It lives in one or more "theme files" which get chopped up and the CSS divvied out to the components in the build process.  A theme file can have both component scoped and global CSS for a docsite.

Although everything in a theme file is technically valid CSS, the initial processing of it is slightly different.

Top-level ID-only selectors are used to define CSS that will be injected directly into components.  Anything that is not a valid top-level ID-only selector is treated as normal, global CSS.

We will refer to these top-level ID-only containers as **injectables** from here on out.

A theme file injectable definition takes the form

```css
#identifier
{
    /* CSS styles */
}
/* OR */
#-identifier
{
    /* Class wrapped CSS styles */
}
```

where `identifier` must be an alphanumeric value that can include dashes or underscores (a subset of the permissible characters in a valid HTML ID).  Rulesets with IDs that include unrecognized characters will fall into the global scope.

IDs that start with a dash are first wrapped in a classname before injecting.  So, for example, the CSS in `#-identifier` will be injected as a ruleset for class `.identifier`.  Without the dash the CSS is injected as raw declarations.

The below example defines a `page-title` injectable

```css
#page-title
{
    /* CSS Styles */
    ...
}
```

As with normal CSS, you can comma-separate to apply the same styles to multiple IDs.

```css
#site-title, #page-title
{
    /* CSS Styles */
    ...
}
```

Styles are injected into components via comments using the form `/* @inject #[id] */`.

```html
<style>
/* @inject #site-title */

main
{
    /* @inject #page-title */
}
</style>
```

The entire comment must be on a single line (no newline characters) and only one ID can be specified per comment.  There must be at least one space between the directive and the ID, additional internal spacing is optional.

At build time, the comment will be replaced by the results of the identified injectable, which includes the merging of both dash and non-dash prefixed identifiers.  

For example,

```css
#site-title
{
    display: block;

    a:hover
    {
        text-decoration: underline;
    }
}

#-site-title
{
    background-color: brown;
    color: white;
}
```

would result in the following CSS injection:

```css
display: block;

a:hover
{
    text-decoration: underline;
}

.site-title
{
    background-color: brown;
    color: white;
}
```

Components that support injectable style will sport the *inject* tag in their documentation.

> Injectables are also available in user-defined [custom components](section/comps_custom).

Care must be taken to ensure that the CSS being injected is valid at the position of the comment.  Note that the comment is not removed if it does not map to an existing injectable.  After injection, the CSS becomes part of the component and is then of course subject to Svelte's component CSS processing rules.

> As you may have noted, it will not be possible to style against an ID-only selector at the global level.  To get around this, you can extend the selector (e.g. `* #html-id`) or put the ruleset inside the `:root` definition.  This will prevent it from being set aside as an injectable.


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

Relative paths are resolved from `root` config option.

Or, it can *be* a stylesheet.

```js
// just paste the CSS
style: 'body { background: blue; color: yellow; }'
```

To specify multiple stylesheets, use an array.

```js
style: [ '#grayscape', 'file:/path/to/my/stylesheet.css' ]
```

Multiple sheets are processed from left to right, with later sheets deeply merging their top-level selectors/injectables atop previous ones.  Once a singular stylesheet has been constructed it is then applied to components as described above.


## Protecting CoBE

The CoBE "render-box" styling space needs to be protected from ACID docsite styling.

While the Svelte component scoping certainly helps with this, it is not a complete solution, especially when considering global styles.

The **Renbox** component uses a div with a CSS class of the same name inside which the CoBE rendering is done.

Firstly, the class must prevent the cascade from leaking into itself.

```css
.renbox
{
    all: initial !important;
}
```

Second, globally-scoped rulesets with CSS declarations must have a `:not(.renbox *)` pseudo-class appended to them to prevent selection of `.renbox` descendants.

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

ACID will automatially append the pseudo-class to global level rulesets aa well as any rulesets appearing within a `:global` marker in component scope at build time.  However, there may be cases where you will need to add the pseudo-class manually ff you see docsite CSS selecting elements inside the render-boxes.

> Note that because of the way CSS `:not` works, the pseudo-class **must** be appended to selectors that directly define styling declarations.  This trick **will not** work to block child ruleset declarations if appended to a parent selector.
