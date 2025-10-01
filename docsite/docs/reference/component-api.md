---
title: Component API
cobeMode: static
---


Here we'll cover additional APIs made available via the docsite build process to aid in authoring custom components.


# Imports

Use module specifier `#public` for the following imports:

```svelte
<script module>
import { ainfo, page, sinfo, site } from '#public'
</script>
```

## `ainfo`

Asset information function proxy.

Calling `ainfo()` with the `uid` of an asset will return the asset object.  This also works if an object having a `uid` property (like the asset object itself) is passed.

```js
let asset = ainfo(asset_or_uid);
```

An error will be thrown if the asset does not exist.

```js label="ainfo proxy"
{
    /*
        All asset UIDs (across all sections).
    */
    assets: [ ... string ],
    /*
        Creates an asset filtering function based on criteria.
    */
    filter: function,
    /*
        Asset group names (plural names).
    */
    groups: [ ... string ],
    /*
        Asset type names (singular names).
    */
    types: [ ... string ],
    /*
        All asset UIDs in `[group]` (across all sections).
    */
    [group]: [ ... string ],
}
```

Note that:
- `[group]` assets are sorted by `title` (except for `documents`)


### `filter()`

Returns an asset filtering function based on `criteria`.

```js
filter(criteria: object): function
```

```js label="criteria object"
{ 
    /*
        Deprecated or non-deprecated assets only?
    */
    deprecated: true | false,
    /*
        Asset must be in one of the specified groups.
    */
    groups: string | [ ... string ] | { [group]: true | false },
    /*
        Asset must belong to one of the specified sections (by name).
    */
    sections: string | [ ... string ] | { [name]: true | false }, 
    /*
        Asset must have at least one of the specified tags (by tagname).
    */    
    tags: string | [ ... string ] | { [tagname]: true | false }, 
    /*
        Asset title must include the sequence of characters (case-insensitive).
    */
    text: string
}
```

All criteria is optional, so no filtering occurs if no criteria is specified.

As an example, to find all component assets with *bootstrap* or *foundation* tags:

```js
let criteria = { groups: 'components', tags: [ 'bootstrap', 'foundation' ] };
let filterFn = ainfo.filter(critera);
let filteredAssets = ainfo.assets.filter(filterFn);
```

Remember that `filteredAssets` will be a list of UIDs, not asset objects.


## `page`

General page-level functionality.


### `setTitle()`

Sets the html `<title>` for the page.

```js
setTitle(title: string): void
```

The `config.title` option value is always appended to `title`.

```js
page.setTitle('Section Page');
```

If in the above example the configured title is "My Docsite", the full title would then be *Section Page | My Docsite*. 

The (sub)title can be cleared by omitting or passing a falsey parameter.


## `sinfo`

Section information function proxy.

Calling `sinfo()` with the `name` of a section will return the section object.  This also works if an object having a `name` property (like the section object itself) is passed.

```js
let section = sinfo(section_or_name);
```

An error will be thrown if the section does not exist.

```js label="sinfo proxy"
{
    /*
        Root section object (as determined by `config.rootSection`).
    */
    root: object,
    /*
        Names of all sections in the docsite.
    */
    sections: [ ... string ]
}
```


## site

General site-level variables and functionality.

```js
{
    /*
        URL to the site logo from `config.logo`.
    */
    logo: string,
    /*
        Site name from `config.title`.
    */
    title: string,
    /*
        Generates a docsite URL.
    */
    toUrl: function,
    /*
        Version info from `config.version`
    */
    version: string
}
```


### `toUrl()`

Generates a docsite URL for an asset, section, or static page.

```js
toUrl(param: string | object): string
```

```js label="param object"
{ 
    /*
        Name of section to link to.
    */
    name: string,
    /*
        Name of docsite page (route) to link to.
    */
    to: string,
    /*
        ID of the asset to link to.
    */
    uid: string
}
```

When a string is passed, it is assumed to be the `to` parameter.

As ordered below, `param` will generate a link to
1. the specified section if `name` exists
2. the specified asset if `uid` exists
3. the page specified by `to`


# Components

Replaceable components are available via the module specifier prefix `#custom`, while all other internal components are available via the prefix `#stable`.

The following example imports the Button and Markup components.

```svelte
<script module>
import Button from '#stable/helper/Button'
import Markup from '#custom/main/Markup'
</script>
```

Import subpaths for components can be found in the *cid* (Component ID) tag on their docpages.


# Data Objects

Additional object types used within the docsite.


## asset

A proxy object that represents a docsite asset.  The `ainfo()` factory can produce these from an asset `uid`.

```js label="asset data"
{
    /*
        Identifies this asset.
    */
    uid: string,
    /*
        Plural form of this asset's type (e.g. components, documents).
    */
    group: string,
    /*
        Markdown Content ID: Identifies the document associated with this asset (if any).
    */
    mcid: string,
    /*
        Name of section this asset belongs to.
    */
    section: string,
    /*
        Set of unique tag names applied to this asset.
    */
    tagNames: [ ... string ],
    /*
        Tags applied to this asset.
    */
    tags: [ ... string ],
    /*
        Singular form of this asset's type (e.g. component, document).
    */
    type: string,
}
```

Additional fields are available based on asset type.


### component asset

A component asset can additionally have the following:

```js
{
    /*
        Deprecation indicator and optional explanation.
    */
    deprecated: true | string,
    /*
        A description of this component.
    */
    description: string,
    /*
        Property definitions for this component.
    */
    props: [ ... object ]
}
```

Note that components with `@ignore` JsDoc tags are filtered out of the build entirely.

A component prop object (in `props`) may have:

```js
{
    /*
        Deprecation indicator and optional explanation.
    */
    deprecated: true | string,
    /*
        A description of this property.
    */
    description: string,
    /*
        Default value for this property.
    */
    fallback: any,
    /*
        Should this property be ignored?
    */
    ignore: true | false,
    /*
        Name of this property.
    */
    name: true | string,
    /*
        Is this property required to be specified for the component?
    */
    required: true | false,
    /*
        Data type of this property.
    */
    type: string,
    /*
        Enumerated (accepted) values for this property.
    */
    values: [ ... any ]  
}
```

Properties with `@ignore` JsDoc tags are filtered out automatically by the **Props** component.


### document asset

A document asset can additionally have the following:

```js
{
    /*
        Default edit mode for fenced code blocks in this document.
    */
    cobeMode: string,
    /*
        Maximum table-of-contents header depth level for this document.
    */
    tocDepth: number
}
```


## section

A proxy object that represents a docsite section.  The `sinfo()` factory can produce these from an section `name`.

```js label="section data"
{
    /*
        Identifies this section.
    */
    name: string,
    /*
        Aggregated data from all parent sections.
    */
    ancestor:
    {
        /*
            Ancestor data for the specified property `prop`.
        */
        [prop]: [ ... any ]
    },
    /*
        IDs of assets that belong to this section.
    */
    assets: [ ... string ],
    /*
        Aggregated data from all descendant sections.
    */
    descendant:
    {
        /*
            Descendant data for the specified property `prop`.
        */
        [prop]: [ ... any ]
    },
    /*
        Aggregated data from all parent sections and this section.
    */
    lineage:
    {
        /*
            Lineage data for the specified property `prop`.
        */
        [prop]: [ ... any ]
    },
    /*
        Markdown Content ID: Identifies the document associated with this section (if any).
    */
    mcid: string,
    /*
        Name of section this section is a child of.
    */
    parent: string,
    /*
        Maximum ToC header depth level for the overview of this section.
    */
    tocDepth: number,
    /*
        UIDs of assets in `group` that belong to this section.
    */
    [group]: [ ... string ],
}
```

Note that:
- `ancestor` lists parent data from root section down to immediate parent
- `descendant` lists child data down to leaves for all descendant sections
- `lineage` lists parent data from root section down to current section
- `parent` will be null for the root section
- `[group]` assets are sorted by `title` (except for `documents`)




# Globals

APIs in this section are available without explicit import as they are automatically imported by the build process.


## t

Label translation function.

```js
t(label: string, vars: object): string
```

The function returns the label identified in `config.labels`, interpolating `vars` into the text as needed.

For example, the following labels

```js
{
    greeting: "Good afternoon {name}!  How is your {noun} today?",
    goodbye: "See you next time!"
}
```

can be used like so

```js
let hola = t('greeting', { name: 'Jenna', noun: 'life' });
// => Good afternoon Jenna!  How is your life today?
let adios = t.goodbye;
// => See you next time!
```

Note that `t` is a proxy, so label IDs that are also valid javascript identifiers can conveniently be accessed without the need for quotes or parentheses, as long as no interpolation is needed.

The ID will be returned if no label is found.  A `{braced}` item is left in the label as-is if no replacement value is provided.
