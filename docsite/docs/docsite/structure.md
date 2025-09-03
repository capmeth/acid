
# Sections

The config option `sections` defines the navigtional hierarchy of the site as well as the assets to be included in the site.

```js
sections:
{
    root:
    {
        title:
        sections: [ 'components' ]
    }

    components:
    {
        title: 'Components',
        sections: [ 'action', ... ]
    },

    action:
    {
        title: 'Action',
        overview: 'file:/action-section/document.md',
        documents: 'action/*.md',
        components: 'action/*.jsx'
    },
    ...
}
```

In the above example, `root`, `components`, and `action` are the names of the sections.

The `rootSection` config setting is used to define the top-level section.

```js
rootSection: 'root'
```

The docsite will be empty without `rootSection`, as a hierarchical tree is built by starting there and working down through `sections.*.sections` until each one has a "parent" reference. Any defined sections that ultimately do not descend from `rootSection` will be excluded from the docsite.


# Section Properties

These are the elements that can appear in a section.

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

This setting has the same form as `components`.

A document's display name (title) is determined by the value of `title` in the front-matter.  If this is not available, the **Capital Cased** filename is used.


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

Specify the names of the sub-sections for the section.

```js
sections: [ 'introduction', 'action_components', 'layout_components' ]
```

The sections specified must exist in the config or they will be skipped in the build process.  

Any section that is included by more than one parent section will only ever appear as the child of the first parent that claims it (and "first" may be arbitrary, depending on the order in which they get processed).


## title

The display name for the section.

If this is not present, the `title` attribute from the `overview` file's front-matter will be used.

If `overview` is not present or is not a file, or has no front-matter, or there is no `title` to be found therein, the name of the section itself is used as the display title.
