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
async function (file: string, data: object, parse: function)
{
    // Parse `file` and set properties on `data`
}
```

It will receive the following parameters:

1. `file`: an absolute path to the file to be parsed
2. `data`: a proxied data object in which to store parsed information
3. `parse`: a specialized JsDoc parser

The parsing function should populate `data` with as many of the following properties as possible.

- `name` *string*: name of the component
- `description` *string*: a description for the component
- `ignore` *boolean*: omit the component from documentation?
- `since` *string*: details for when component was created
- `example` *string*: relative path to a markdown example file
- `content` *string*: markdown content ("example file")
- `tags` *array:string*: tags for the component
- `props` *array:object*: component property definitions

If `content` is set, ACID will skip looking for an example file for the component.

Each object in `props` can contain:

- `name` *string*: property name
- `description` *string*: a description for the property
- `ignore` *boolean*: omit the property from documentation?
- `type` *string*: data type for the property
- `required` *boolean*: is this property required?
- `default` *any*: the default value for the property
- `values` *array:any*: legal enumerated values

The `parse` function parses a string as a single JsDoc comment with or without the standard comment markings, and can provide much of the above information depending on how detailed the comment is.  It looks only for [JsDoc tags](document/configuration-jsdoc) that ACID understands and returns a populated plain object for the comment passed in.
