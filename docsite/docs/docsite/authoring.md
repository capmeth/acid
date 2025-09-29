---
title: Markdown Notes
---


ACID uses the [Takedown] parser for converting markdown documents into HTML.

Most HTML generation is left standard, but ACID does manipulate the output on some elements to achieve its feature set.

- **Front-matter is enabled and parsed as YAML**  
  Some [document-specific config settings](document/reference-markdown) are available here.

- **Fenced code blocks are controlled**  
  These blocks are replaced with [**Editor**](component/stable-common-editor) components for code highlighting and editing.

- **HTML ids are added to header elements**  
  For ATX (`#` prefixed) style headers only, this is used for rendering a table of contents.

- **Docsite hyperlinks are adjusted**  
  Relative hyperlinks for docsite routes are adjusted for easier page linking from within a document.

Here's a [quick reference](https://commonmark.org/help/) page and a [tutorial](https://commonmark.org/help/tutorial/) to help you learn how to use markdown.


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
- `catalog`
- `section/[name]`: where `[name]` is the name of a section
- `component/[uid]`: where `[uid]` is the asset id of a component
- `document/[uid]`: where `[uid]` is the asset id of a document

Asset UID generation is controlled by the `config.toAssetId` option.
