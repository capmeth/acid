
ACID uses the [Takedown](https://www.npmjs.com/package/takedown) parser for converting markdown documents into HTML.  

Most HTML generation is left standard, but ACID does manipulate the output on some elements to achieve its feature set.

- **Front-matter is enabled and parsed as YAML**  
  Some [document-specific config settings](document/configuration-markdown) are available here.

- **Fenced code blocks are controlled**  
  These blocks are replaced with [**Editor**](component/cobe-editor) components for code highlighting and editing.

- **HTML ids are added to header elements**  
  This is used for rendering a table of contents.

- **Docsite hyperlinks are adjusted**  
  Relative hyperlinks for docsite routes are adjusted for easier page linking from within a document.


# Internal Hyperlinking

Markdown link elements with docsite recognizeable paths are captured and adjusted for linking to pages of the docsite.

For instance...

We can link to [this page](section/authoring). \
We can link to [the home page](home).

```md
We can link to [this page](section/authoring).
We can link to [the home page](home).
```

Relative links that the docsite understands include:

- `home`
- `section/[name]`: where `[name]` is the name of a section
- `component/[id]`: where `[id]` is the asset id of a component
- `document/[id]`: where `[id]` is the asset id of a document
- the name of any other non-parameterized route in the docsite

Asset ID generation is controlled by the `toAssetId` config option.
