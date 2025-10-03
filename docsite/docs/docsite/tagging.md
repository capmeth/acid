---
title: Asset Tagging
cobeMode: static
---


# Asset Tags

Tags are "infostamps" used to categorize a docsite asset.  They can be applied via the custom JsDoc tag `@tags` for components, or via a `tags` attribute in the front-matter of a markdown document.

Multiple tags should be separated by commas.

```js
/**
    A simple component.

    @tags related-to:AnotherComponent, simple, childless
*/
export default class SimpleComponent
```

A tag has the form `name:info` where 
- `name` is a lowercase, alphanumeric, and possibly hyphenated value, and
- `info` is any non-whitespace character except a comma.

Incorrectly formed tags will be omitted from the documentation.  


## Tag Definitions

Define tags in the `tagLegend` setting of *acid.config.js* to make them functional in the docsite.

A tag definition is simply a description of the tag:

```js
tagLegend:
{
    'related-to': 'This component is somehow related to {info}.',
    childless: 'This is a self-closing component.'
}
```

Use `{info}` in the description to insert tag `info` when displayed in the docsite (as applicable).

Tag descriptions are neither HTML nor markdown enabled.  They display as-is in the browser.

For tags that need to be assigned automatically, you can define an `assign` function in the tag definition that will determine if the tag should be assigned.

```js
tagLegend:
{
    form: 
    { 
        desc: 'This component can be used as a form control.',
        assign: ({ path }) => path.indexOf('components/form/') >= 0
    }
}
```

The function must return `true` or a non-empty string for the tag to be added to the asset.  A returned string becomes the *info* portion of the tag. 

The object passed to `assign` will have the following information.
- `uid` *string*: asset id
- `path` *object*: asset filepath details
  - `abs`: absolute path
  - `base`: filename with extension
  - `ext`: file extension
  - `name`: filename w/o extension
- `tid` *string*: asset type id


## Tag Styling

The default **Tag** component is responsible for rendering tags.

It applies the tag name as a class on its root element, allowing for customized styling.

For instance, a "domain" tag with "pricing-data" info would render as follows.

```html
<span class="main-tag domain">
  <span class="name">
    domain
  </span>
  <span class="info">
    pricing-data
  </span>
</span>
```

You can style this component using `#main-tag` (via `config.style`) or, as it is a custom component, replace it altogether using `main/Tag` (via `config.components`).
