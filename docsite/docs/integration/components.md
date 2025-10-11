---
title: Custom Components
cobeMode: static
---


This document will cover how you can replace ACID's presentational components and further include your own components.

Note that the internal Svelte components have their own documentation pages here in this docsite, as we use ACID to document ACID, of course!


# Replacing Components

When replacing a component, it is probably best to start with the existing version of the one you wish to customize.  The [ACID repo][repo] is public, so you can download or cut & paste code from there.

Once you have created your custom component, you can use it to replace a default one.  For example, if you have a custom component at *src/components/Tag.svelte* (relative to the root of your project), you can replace the existing **Tag** component:

```js label="acid.config.js"
{
    components:
    {
        'main/Tag': 'src/components/Tag',
        ...
    }
}
```

Property names in the `config.components` option are the "Component IDs" (CIDs) you use to identify the component to replace.  Look for the *cid* tag on a custom component's docpage to find the proper CID to use for replacement.

The default custom components will generally have an expected interface (props) that should be supported, as other internal components make use of them.  Your custom component should at least handle the required props for the component being replaced to be sure you are implementing what's necessary for a functioning docsite.

Check out the [Custom Components](section/comps_custom) section for all the replaceable components.


# Developing Components

A general overview of custom component development, is described in this section.


## Docsite Build

Your custom components, as well as anything they depend on, will be pulled into the docsite build when generating the site.  

The build process compiles components in *runes* mode and will make all of the typical Svelte libraries available.  

It can handle file extensions
- *.js* - for JavaScript, of course
- *.json* - for JavaScript Object Notation data
- *.css* - for Cascading StyleSheets
- *.svelte*, *.svt* - for svelte components/files

The build can process CommonJs modules, but the output format is ESM.

If your custom component requires anything fancier than the above you may need to generate a separate dependency bundle first before integrating your components into the docsite.

The build also provides components via the `#stable` and `#custom` module specifier prefixes, and additional internal APIs via the `#public` module specifier (described in the following sections).


## Importing Components

The docsite build maps stable and custom components via special module specifier prefixes.

```svelte
<script module>
import Button from '#stable/helper/Button'
import Markup from '#custom/main/Markup'
</script>
```

Just prefix a component's ID with `#stable/` or `#custom/` to import it.  The build can resolve supported file extensions for you so it is not necessary to include them.

Below is the list of CIDs for replaceable components (what you would use in `config.components`).

- page components
  - [**page/Home**](component/custom-page-home) - Docsite Homepage
  - [**page/Section**](component/custom-page-section) - Section Display Page
  - [**page/Document**](component/custom-page-document) - Document Asset Page
  - [**page/Component**](component/custom-page-component) - Component Asset Page
  - [**page/Catalog**](component/custom-page-catalog) - Asset Search Page
  - [**page/Isolate**](component/custom-page-isolate) - CoBE Isolation Page
  - [**page/Error**](component/custom-page-error) - Navigation Error Page
- main components
  - [**main/Branch**](component/custom-main-branch) - Tree Navigation Branch
  - [**main/Editor**](component/custom-main-editor) - CoBE Editor
  - [**main/Leaf**](component/custom-main-leaf) - Tree Navigation Leaf
  - [**main/List**](component/custom-main-list) - Item Listing
  - [**main/Markup**](component/custom-main-markup) - Markdown HTML Content
  - [**main/Node**](component/custom-main-node) - Toc Navigation Node
  - [**main/Tag**](component/custom-main-tag) - Asset Tag

If you are writing a plugin that uses custom components, importing them using `#custom/` (as oppose to internal project paths) and mapping them in `config.components` will allow users to customize those components as well.

Note that any custom component can also use CSS injection (see [docsite styling](section/styling)).


## APIs

The `#public` module specifier can be used to get at the docsite APIs.

```svelte
<script module>
import { ainfo, page, sinfo, site, tinfo } from '#public'
</script>
```

The `ainfo`, `sinfo`, and `tinfo` functions are used to get asset, section, and tag data, respectively.  They also include additional functionality pertaining to the entity access they facilitate.  

Use `site` to access available configuration info as well as generate docsite URLs.  The `page` import includes a function to set html `<title>` for the page.

See the [Component API Reference](document/reference-component-api) page for more details.


## Markdown Embedded Components

Custom components mapped in `config.components` using the *embed/* prefix can be used in markdown documents.

Imagine you have a component that allows the user to copy child content to the clipboard.

```js label="acid.config.js"
{
    components:
    {
        'embed/Clip': 'src/components/utils/CopyToClipboard'
    }
}
```

Using the above configuration, we can now use `<Clip>` in markdown.

```md
You can click <Clip>this string of text</Clip> to copy it to the clipboard.
```

Now, clicking "this string of text" in the browser will add it to the clipboard, assuming the implementation of **Clip** is indeed as described above.

Remember that these custom components can only be used in **markdown document content** - not in places like component descriptions or deprecation messages.

> **IMPORTANT**: \
> Brace (`{}`) characters in the content are svelte-escaped as literals after HTML conversion.  This means that JS expressions and special svelte-syntax cannot be used in markdown files.

> Be sure to understand how HTML [block](https://spec.commonmark.org/0.31.2/#html-blocks) and [inline](https://spec.commonmark.org/0.31.2/#raw-html) content is handled in CommonMark to avoid any gotchas when embedding components.


### Component Names

The markdown-usable name of the component is auto-generated based on the **PascalCased** embed mapping name.

As an example, consider the following mappings:

```js label="acid.config.js"
{
    components:
    {
        'embed/exotic/DancingText': 'path/to/exotic/DancingText',
        'embed/layout-special/Parallax': 'path/to/layouts/Parallax'
    }
}
```

The components available in markdown would be `<ExoticDancingText>` and `<LayoutSpecialParallax>` as everything after the *embed/* is used to form the name.

