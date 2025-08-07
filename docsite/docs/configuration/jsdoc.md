---
title: JsDoc Tags
cobeMode: static
---


# Parsing JsDoc

ACID provides a built-in [JsDoc](https://jsdoc.app) parser (see *Codeless Site Generation* below). It supports only "block-level" tags.

The parser will look for standard JsDoc markers

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

Leading whitespace on each line is truncated and ignored.  A single `*` *within* that leading space will also be truncated up to the first whitespace character after it.  Starting lines with a `*` followed by a space will normalize the content for markdown-parsed tags (like `@description`).

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


# JsDoc Tags

Ok... here are the JsDoc tags recognized by ACID...  

A tag with a `*` after it denotes either a non-standard tag or a deviation from the specified use of a standard tag.  For the rest, please refer to the JsDoc documentation for proper use and formatting.


## @author

Identifies the author of a code entity.

This is not currently displayed anywhere in the docsite.

****Captured for:****
- components


## @component*

Marks the comment as being a component definition.

The content of this tag, if provided, should be the `@name` of the component.

```js
/**
    @component MyComponent
*/
```

is the same as

```js
/**
    @name MyComponent
    @kind component
*/
```


## @default, @defaultvalue

Specifies a default value for the code entity.

****Captured for:****
- components
- component props


## @deprecated

Indicates that a given code entity should no longer be used.

The optional content of this tag should describe an alternative solution.

****Captured for:****
- components
- component props


## @description, @desc

Provides a general description of the code entity.

When a comment starts without a tag, `@description` is assumed be in effect. 

Description content is parsed as markdown, with the following caveats:
- Front-matter is ignored.
- Fenced code blocks are rendered as standard HTML (no CoBEs).
- Header elements are suppressed by converting them to `<div>` tags.
- Thematic break markers are rendered literally (not converted to `<hr>` tags).

****Captured for:****
- components
- component props


## @example

Provides a path to a markdown example file for a code entity.

This should be a relative path from `root` config setting.

****Captured for:****
- components


## @ignore

Prevents the code entity from appearing in the docsite.

This tag has no content, it need only appear in the comment to be effective.

****Captured for:****
- components
- component props


## @kind*

Marks the comment as being a definition for a specific code entity.

This should be `component` or `prop` (neither value is standard JsDoc).

****Captured for:****
- components
- component props


## @name

Provides a name for the code entity.

This is the name that is used to identify the code entity in the docsite.

`@name` is unnecessary when providing a value for `@component` or `@prop`.

****Captured for:****
- components
- component props


## @prop*

Marks the comment as being a component prop definition.

While this tag is standard JsDoc, its usage is not.  The content of this tag, if provided, should be the `@name` of the prop.

```js
/**
    @prop propertyName
*/
```

is the same as

```js
/**
    @name propertyName
    @kind prop
*/
```


## @property

Defines a property of a code entity.

Used to define props in a `@component` comment.  Aggregates with `@kind prop` comments to form the full props list for a component.

****Captured for:****
- components


## @required*

Indiates that a value for the code entity is mandatory.

This tag has no content, it need only appear in the comment to be effective.

****Captured for:****
- component props


## @summary

A brief summary of the component.

Unlike `@description`, this gets no markdown conversion treatment.

Also unlike `@description`, it is not currently displayed anywhere in the docsite.

****Captured for:****
- components
- component props


## @since

Provides (usually version) information about when the code entity was created.

This is not currently displayed anywhere in the docsite.

****Captured for:****
- components


## @tags* 

Provides atomic bits of information about a code entity.

Multiple tags should be separated by commas.

```js
/**
    A simple component.

    @tags related-to:AnotherComponent, simple, childless
*/
```

A tag has the form `name:info` where 
- `name` is a lowercase, alphanumeric, possibly hyphenated value, and
- `info` is any non-whitespace character except a comma.

Incorrectly formed tags will not appear in the docsite.  Additionally, tags must also be defined in `tagLegend` in the config in order to appear in the docsite.

****Captured for:****
- components


## @type

Specifies the datatype(s) for the code entity.

Type information (`{}` enclosed data) is not parsed by this or any other tag that accepts it.  It will appear in the docsite as-is.

****Captured for:****
- component props


## @values*, @enums* 

Comma-separated list of possible enumerated values for the code entity.

****Captured for:****
- component props


# Codeless Site Generation

That is, docsite generation without parsing any code, only JsDoc.

For many codebases, formal documentation-oriented comments can be pretty sparse.  However, for projects that enforce JsDoc in the code, ACID provides a "codeless" JsDoc to JSON parser.

It is configured as the fallback parser.

```js
parsers:
[
    { types: '*', use: '#exts/jsdoc' }
]
```

You can override this by setting the fallback (`*`) record to something else (if necessary), but otherwise there is no need to set the parser explicitly.

For this to work,
- it is assumed that each source file implements exactly one component
- at least `@name` and `@kind` or equivalents should be specified in each comment
- first `@kind component` comment or first comment without `@kind` is assumed to be the primary comment

If the selected primary "component" comment has no `@name`, the filename itself is used.

Once the component comment has been identified, all other comments without `@name` and `@kind` will be skipped.  If the component comment cannot be identified, the file itself is skipped.
