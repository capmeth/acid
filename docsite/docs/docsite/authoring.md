---
title: Content Authoring Notes
---


ACID uses the [Takedown](https://www.npmjs.com/package/takedown) parser for converting markdown documents and source comments into HTML.  

Most HTML generation is left standard, but ACID does manipulate the output on some elements to achieve its feature set.


# For Documents

- Front-matter is enabled and parsed as YAML for document-specific config settings.

- Fenced code blocks are replaced with [**Editor**](component/cobe-editor) components for code highlighting and editing.

- HTML ids are added to header elements for table-of-contents rendering.

- Relative hyperlinks known to the docsite are adjusted to allow for easier docsite page linking from within a document.

- Entire document HTML is wrapped in a component for rendering in a document docpage.


# For Source Comments

- Front-matter is disabled.

- Fenced code blocks are rendered as converted to HTML.

- Header elements are suppressed by converting them to `<div>` tags.

- Markdown for thematic breaks is rendered literally (not converted to `<hr>`s).

- Hyperlinks get the same treatment as they do with documents.

- No internal components are embedded so document HTML is not wrapped.


# For Component Examples

- Front-matter is enabled and parsed, but most settings will be overridden by component data.

- Fenced code blocks are rendered using **Editor** components.

- HTML ids are added to header elements but a table-of-contents is not available.

- Hyperlinks get the same treatment as they do with documents.

- Entire document HTML is wrapped in a component for rendering in a component docpage.
