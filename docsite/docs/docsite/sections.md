
# Sections

In *acid.config.js*, `sections` defines the navigtional hierarchy of the site.  Assets to be included in the site are also specified here.

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

In the above example, `root`, `components`, and `action` are the names (IDs) of the sections.

The `rootSection` config setting is used to define the top-level section

```js
rootSection: 'root'
```

No documentation will generate without `rootSection`, and any sections not having `rootSection` as ancestor will be excluded from the docsite.


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
overview: "Components that allow for user interaction."
```

Alternatively, this can be the path to a single markdown file.

```js
overview: 'file:/docs/components/actions.md'
```

Note that in the case of specifying a file, you must prefix the path with `file:/`.


## sections

Specify the names of the sub-sections for the section.

```js
sections: [ 'introduction', 'action_components', 'layout_components' ]
```

The array form is not necessary if there is only one sub-section.

The sections specified must exist in the config or they will be skipped in the build process.  Any sub-section that is included by more than one parent section will only appear as the child of the first parent that claims it (and "first" can be arbitrary, depending on the order in which they get processed).


## title

The display name for the section.

If this is not present, the `title` attribute from the `overview` file's front-matter will be used.

If `overview` is not present or is not a file, or has no front-matter, or there is no `title` to be found therein, the name of the section itself is used as the display title.
