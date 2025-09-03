---
title: Custom Components
---

Custom components are used to render the UI of a docsite.  

They can be replaced via configuration and can be fully styled/themed.  They are used by *core* and *shared* components for rendering the interface.  Generally, custom components should prefer to use their shared component equivalent rather than each other, where applicable.


# Creating Custom Components

TODO: Finish this document!

All of the custom components have default implementations, but you can replace them to further enhance docsite customization.

With the exception of the "helper" shared components, all of the HTML generation (and, consequently, CSS styling) comes through the custom components.


## Component Context

The following values are set internally into the Svelte context and become available at
- **Docsite** component:
  - `page` *string* - name of the current page
- page components (where applicable):
  - `section` *string* - name of the current section
  - `asset` *string* - id of the current asset

The Svelte context is wrapped in an assignment proxy and injected into component files (only) as global variable `ctx` so it does not need to be imported.

As an example, here we enable custom component styling by page type. 

```svelte 
<span class="main-text page-{ctx.page}">
  {@render children()}
</span>
```

As mentioned above, `ctx` is an *assignment proxy* which means you can conveniently use object property getter/setter operations on it.
