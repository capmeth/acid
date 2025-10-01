---
title: Parsing Extensions
cobeMode: static
---


# Parser Configuration

Source parsing is necessary in order to extract and normalize component details across different frameworks (like Svelte, Vue, React, etc.) so that ACID can provide relevant documentation about them.

To configure a source parser use the `parsers` config settings.

```js
parsers:
[
    { types: [ '.js', '.jsx' ], use: [ 'parse-ext', [ 10, true ] ] }
]
```

In the above example, we have a single spec that specifies the use of a **parse-ext** parser to parse ".js" and ".jsx" files being pulled into the docsite.

The parser module must `export default` a function that returns a function that does the actual parsing. Alternatively, `use` can be set to a function directly.

During the docsite build process, the config function will be called once for each of the extensions (`types`) it is to be associated with.  It will receive the extension string as well as the parameter from configuration, if provided.

Here is the general idea from the perspective of the build process:

```js
import parseConfig from 'parse-ext'

let jsParse = parseConfig([10, true], '.js');
let jsxParse = parseConfig([10, true], '.jsx');
```


# Parsing the Data

The parsing function is called during docsite build to parse every file with the associated extension(s). 

```js
async function (file: string, parse: function)
{
    let data = {};

    // Parse `file` and set properties on `data`

    return data;
}
```

It will receive the following parameters:

1. `file`: an absolute path to the file to be parsed
2. `parse`: a specialized JsDoc parser

and it must return an object, even if it is an empty one.

The parsing function should populate `data` with as many of the following properties as possible.

- `author` *object*: component author
  - `email` *string*: email address of author
  - `name`: *string* name of author
- `content` *string*: markdown content ("example file")
- `deprecated` *boolean|string*: deprecation status with optional message
- `description` *string*: a description for the component
- `example` *string*: relative path to a markdown example file
- `ignore` *boolean*: omit the component from documentation?
- `name` *string*: name of the component
- `props` *array<object>*: component property definitions
- `since` *string*: details for when component was created
- `summary` *string*: a brief description of the component
- `tags` *array<string>*: tags for the component

If `content` is set, ACID will skip looking for an example file for the component.

If `ignore` is set or would be set, the function can return `data` or simply `{ ignore: true }` immediately without further parsing as ACID will exclude the component from the documentation entirely.

Each object in `props` can contain:

- `deprecated` *boolean|string*: deprecation status with optional message
- `description` *string*: a description for the property
- `fallback` *any*: the default value for the property
- `ignore` *boolean*: omit the property from documentation?
- `name` *string*: property name
- `required` *boolean*: is the property mandatory?
- `type` *string*: data type for the property
- `values` *array:any*: legal enumerated values for the property

The `parse` function parses a string as a single JsDoc comment with or without the standard comment markings, and can provide much of the above information depending on how detailed the comment is.  It looks only for [JsDoc tags that ACID understands](document/reference-jsdoc) and returns a populated object for the comment passed in.


# The Default Parser

For many codebases, formal documentation-oriented comments can be pretty sparse.  However, for projects that enforce JsDoc in the code, ACID provides a "codeless" JsDoc to JSON parser, affectionately named *docson*.

Docson is effectively the same JsDoc parser passed to custom source file parsers, except that it can evaluate an entire source file as opposed to a single comment.  Docson does not evaluate any code or rely on an AST.  It merely searches for comments in a file and parses them, which means that comments appearing in strings could potentially confuse it.

Docson is configured as the fallback parser.

```js
parsers:
[
    { types: '*', use: '#exts/jsdoc' }
]
```

The docson parser is always in effect for any source filetype that is not explicitly configured in `config.parsers`.  If necessary, however, this can be overridden by setting the fallback (`*`) record's `use` property to something else.


## Parsing JsDoc

Docson will look for standard JsDoc markers

```js
/**
    This is a standard JsDoc-style comment.
 */
```

as well as JsDoc within HTML comment markers

```html
<!--*
    This can also be detected as JsDoc.
-->
```

The key here is the extra `*` (star) added to an opening JS or HTML style block comment to identify it as JsDoc.

Note that the opening and closing comment markers *must* appear on separate lines with only optional whitespace before or after them, respectively.

```js
let good = false; /**
    This comment will not be detected as there is code on the same line and before 
    the opening comment marker.
*/
/**
    This comment will not be detected as there is code on the same line and after
    the closing comment marker.
*/ if (!good) fixit();
```

Leading whitespace on each line is truncated and ignored.  A single `*` *within* that leading space will also be truncated up to the first whitespace character after it.  Starting lines with a `*` followed by a space can help normalize the content for markdown-parsed tags (like `@description`).

A block-level tag is one that starts a line in the comment after the above truncations.

```js
/**
 * This is a description (@see JsDoc docs).
 *
 * @name ComponentName
 */
```

In the example above `@name` is a block tag while `@see` is used as an inline one.  If any non-whitespace content appears on a line before a tag (including a non-truncated `*`), that tag is considered to be inline.

Block-level tags are processed, but inline tags are not and may appear in docsite content as-is.  A block tag's content is ended by the start of the next block tag, or by the end of the comment itself.


## Notes on Individual Comments

Docson assumes that each source file implements exactly one component.

Each JsDoc comment should have at least `@name` and `@kind` or equivalent tags specified.  If no comment specifies `@kind component`, then the first comment that does not specify `@kind` is assumed to be the identifying comment.

Once the identifying comment has been identified, all other comments without `@name` and `@kind` will be skipped.

Please see [JsDoc Tags](document/reference-jsdoc) for all the supported JsDoc tags and their equivalents.
