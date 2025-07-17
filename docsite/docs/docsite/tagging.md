
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

You must define tags in the `tagLegend` setting of *acid.config.js*.

A tag definition is simply a description of the tag:

```js
tagLegend:
{
    'related-to': 'This component is somehow related to {info}.',
    childless: 'This is a self-closing component.'
}
```

Note that tag `simple` will not be available/shown in the docsite since we didn't define it.

Use `{info}` in the description to insert tag `info` when displayed in the docsite.

Tag descriptions are not HTML nor markdown enabled.  They display as-is in the browser.


## Tag Styling

The **Tag** component is responsible for rendering tags.

It applies the tag name as a class on its root element, allowing for customized styling.

For instance, a "domain" tag with "pricing-data" info would render

```html
<span class="element-tag domain">
  <span class="name">
    domain
  </span>
  <span class="info">
    pricing-data
  </span>
</span>
```

and can be styled via `.element-tag.domain` (*acid.config.js*).
