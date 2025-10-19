---
title: Basic Setup
cobeMode: static
escapeBraces: true
---

Here we'll walk through a setup for a basic component application.


# App Structure

Let's say your app has the following structure:

- node_modules/
- src/
  - components/
    - domain/
      - Calculator/
        - index.jsx
        - doc.md
        - tests.js
      - Processor/
      - readme.md
    - views/
      - Accordion/
      - BusinessCard/
      - readme.md
    - layouts/
      - TwoColumnLayout/
      - NewspaperLayout/
    - App.jsx
  - index.js
- acid.config.js
- package-lock.json
- package.json
- readme.md

The above indicates a project with components organized by category with an optional *readme.md* in each that provides information about the category.  The project has an *index.js* entry point that mounts the root *App.jsx* component into the html.  There is also a readme in the root folder that describes the project as a whole.

With the exception of *App.jsx*, each component has several files associated that live together in a folder that names the component itself.  An *index.jsx* file provides the source code, and an optional *doc.md* file provides additional documentation and usage examples for the component.  (There may also be test specs and other supporting files found here, but these are beyond the scope of what ACID can document... for now).


# Let's Configure!

The first place to start when organizing your project documentation is the `sections` configuration option.

Create an *acid.config.js* file at the root of your project, and make it look like this:

```js label="acid.config.js"
export default
{
    sections: {}
}
```

*We have skipped generating a default config file for this tutorial mainly to eliminate potential distractions.*

We will need a section that will be the homepage of the site.  Let's call it "home".  We'll also make a section for each of the component categories.

```js label="acid.config.js"
export default
{
    rootSection: "home",

    sections: 
    {
        home: {},
        domain: {},
        views: {},
        layouts: {}
    }
}
```

Note that we tell ACID which section is the root by setting `rootSection` to a named section in the config.

Now let's fill out the root section.

```js
{
    home: 
    {
        title: "App Component Library",
        overview: "file:/readme.md",
        sections: [ "domain", "views", "layouts" ]
    }
}
```

We've now given the home section a `title`, connected the project's readme file as the `overview` content, and linked the other three sections as children or sub-sections.

The remaining sections will all be similar.

```js
{
    domain:
    {
        title: "Domain Components",
        overview: "file:/src/components/domain/readme.md",
        components: "src/components/domain/**/index.jsx"
    },
    views:
    {
        title: "View Components",
        overview: "file:/src/components/views/readme.md",
        components: "src/components/views/**/index.jsx"
    },
    layouts:
    {
        title: "Layout Components",
        overview: "Components that provide page structure.",
        components: "src/components/layouts/**/index.jsx"
    }
}
```

As the "Layouts" folder has no readme file, we have provided a short description in `overview` instead.

In `components` we use glob patterns to select all the files that should be included in the section. For each category, we have selected every *index.jsx* file found as a descendant of the category's folder, as they are all component source files.

*As this is a basic tutorial, we won't go into how to setup a source parser here.  We will assume that all of the component source files in this fake project are well documented using [JsDoc tags that are understood by ACID](/document/reference-jsdoc), and thus can be parsed for documentation using the default internal parser.*

At this point your app will be more organized, but notice that the names of all the components are "index".  Of course, this might not be true if a component specifies a name in its JsDoc comment, but our project structure dictates that a component name should come from the immediate parent folder of the component source file.

Let's fix that!

```js
{
    toAssetName: ({ base, name, segs }) => base === 'index.jsx' ? segs.reverse()[1] : name,
    useFilenameOnly: true
}
```

The above `toAssetName` function is selecting the second-to-last path segment (using reversed `segs` array) as the name when the `base` path segment is *index.jsx*.  Otherwise, the file `name` is used.  Option `useFilenameOnly` is set to force the component to derive its name from its filename (which will use `toAssetName`).

We've left out the *App.jsx* component, though.  Let's just add it to the *home* section.

```js
{
    home: 
    {
        title: "App Component Library",
        overview: "file:/readme.md",
        sections: [ "domain", "views", "layouts" ],
        components: "src/components/App.jsx"
    }
}
```

So, putting it all together...

```js label="acid.config.js"
export default
{
    rootSection: "home",

    sections: 
    {
        home: 
        {
            title: "App Component Library",
            overview: "file:/readme.md",
            sections: [ "domain", "views", "layouts" ],
            components: "src/components/App.jsx"
        },
        domain:
        {
            title: "Domain Components",
            overview: "file:/src/components/domain/readme.md",
            components: "src/components/domain/**/index.jsx"
        },
        views:
        {
            title: "View Components",
            overview: "file:/src/components/views/readme.md",
            components: "src/components/views/**/index.jsx"
        },
        layouts:
        {
            title: "Layout Components",
            overview: "Components that provide page structure.",
            components: "src/components/layouts/**/index.jsx"
        }
    },

    toAssetName: ({ base, name, segs }) => base === 'index.jsx' ? segs.reverse()[1] : name,

    useFilenameOnly: true
}
```

Now, we have the documentation structure working for our app.  As we add components to the existing categories, they should get picked up by the build without any changes.  For new categories, we just need to setup another section and make sure the home section includes it.
