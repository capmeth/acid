---
title: Custom Components
cobeMode: static
---

Custom components are used to render the UI of a docsite.  

They can be replaced via configuration and can be fully styled/themed.  They are used by *core* and *shared* components for rendering the interface.  Generally, custom components should prefer to use their shared component equivalent rather than each other, where applicable.


# Replacing Custom Components

Custom components have default implementations, but you can replace them to further enhance docsite customization.

To do this, use the `components` option in configuration.

For example, if you have a custom tag component at *src/components/Tag.svelte* (relative to the root of your project), you can replace the existing component using

```js
components:
{
    'main/Tag': 'src/components/Tag'
}
```

Components that can be replaced have the *custom* tag attached in this docsite.  That tag also specifies the ID to use in `components` for specifying the replacement module.

All of the custom components support CSS injection (see the [styling docs](section/styling) page).


# Creating Custom Components

When creating a custom component, it is probably best to start with the existing component of the one you wish to customize.  The ACID repo is public, so you download or cut & paste code from there.

Within a custom component, you can use any shared or custom component

```svelte
<script module>
import Button from '#shared/helper/Button'
import Markup from '#custom/main/Markup'
</script>
```

where `#shared` and `#custom` are the module identifier prefixes to use before the IDs of shared or custom components, respectively.

Take note of the props defined for the default version of the component that you are replacing.  As internal core and shared components will make use of it, these props represent the expected interface for the component.


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
