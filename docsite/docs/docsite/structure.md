---
title: Site Structure
---


# Sections

The config option `sections` defines the navigtional hierarchy of the site.  It is also where all of the files that will become part of the documentation are specified.  Each section must have a unique name.

An individual section may have:
- `title`: a display nmae for the section
- `overview`: markdown content that describes the section
- `documents`: markdown asset files to be included in the section
- `components`: component source files to be included in the section
- `sections`: names of the child sections of the section

All of these settings are optional.

The following example creates `root`, `components`, and `action` sections for the site.

```js
sections:
{
    root:
    {
        title: 'React Project',
        sections: [ 'components' ]
    },

    components:
    {
        title: 'Components',
        sections: [ 'action' ]
    },

    action:
    {
        title: 'Action',
        overview: 'file:/action-section/document.md',
        documents: 'action/*.md',
        components: 'action/*.jsx'
    }
}
```

The `config.rootSection` option is used to define the top-level section.

```js
rootSection: 'root'
```

A hierarchical tree is built by starting at `rootSection` and working down through the child `sections` until each one has a "parent" reference.  Sections that do not ultimately descend from `rootSection` will be excluded from the docsite.


# Section Properties

Here we'll cover a bit more detail about the various parts of a section.


## title

The visual identification (display name) for the section in the UI.  Generally, this is the value displayed as the title of or a link to a section page.

If not present, the `title` entry from the `overview` file's front-matter will be used.  If `overview` is not present or has no front-matter or there is no `title` to be found therein, the **Capital Cased** name of the section itself is used as the display title.


## overview

A short description of the section.

```js
overview: 'Components that allow for user interaction.'
```

The content will be parsed as markdown.

Alternatively, this can be the path to a single markdown file.

```js
overview: 'file:/docs/components/actions.md'
```

A filepath must be prefixed with `file:/` or it is assumed to be raw content.

This is the "default" property for a section, which means that you can specify it directly as the value of the section itself.

For example,

```js
sections:
{
    content_authoring:
    {
        overview: 'file:/docs/content-authoring.md'
    }
}
```

is the same as

```js
sections:
{
    content_authoring: 'file:/docs/content-authoring.md'
}
```

The above case of course means that no additional configuration for the section is possible.


## sections

Specifies the names of the child sections.

```js
sections: [ 'introduction', 'action_components', 'layout_components' ]
```

The sections specified must exist in `config.sections` or they will be skipped in the build process.  

Any section that is included by more than one parent section will only ever appear as the child of the first parent that claims it (and *first* may be arbitrary due to the async processing involved).


## components

Specifies which component files are to be included in the section.

You can assign a glob inclusion string directly.

```js
components: 'components/**/*.jsx'
```

and with the object form you can use `exclude` to ignore included files.

```js
components:
{
    include: 'components/**/*.jsx'
    exclude: 'components/actions/*.jsx'
}
```

Arrays of glob strings are also accepted in any of the above settings.

A component's name (title) will generally be provided by the extension that parsed the component source file. If that doesn't happen, the basename of the source file is used as-is.

Alternatively, the `useFilenameOnly` config setting can be used to force the use of the filename.


## documents

Specifies which markdown files are to be included in the section.

This setting follows the same pattern as `components` for selecting files.

A document's display name (title) is determined by the value of `title` in the front-matter.  If this is not provided, the **Capital Cased** filename is used.
