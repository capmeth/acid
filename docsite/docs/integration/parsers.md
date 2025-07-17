---
title: Source Parsing Extensions
cobeMode: static
---

Source parsing is necessary in order to normalize component details so that ACID can provide relevant documentation about them whether they be from Svelte, Vue, React, etc.

To configure a source parser use the `parsers` settings.

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

The parsing function is called during docsite build to parse every file with the associated extension(s). It can be an async function and will receive an absolute path to the file (first parameter) and a specialized JsDoc parser (second parameter).

The parsing function should return an object with as many of the following properties as possible.

- `name` **string**: name of the component
- `description` **string**: a description for the component
- `ignore` **boolean**: omit the component from documentation?
- `since` **string**: details for when component was created
- `example` **string**: relative path to a markdown example file
- `content` **string**: markdown content ("example file")
- `tags` **array<string>**: tags for the component
- `props` **array<object>**: component property definitions

Setting `content` will cause ACID to skip looking for an example file.

`props` objects can contain:
- `name` **string**: property name
- `description` **string**: a description for the property
- `ignore` **boolean**: omit the property from documentation?
- `type` **string**: data type for the property
- `required` **boolean**: is this property required?
- `default` **any**: the default value for the property
- `values` **any**: legal enumerated values

The provided JsDoc parser can provide much of the above depending on how detailed the JsDoc comments are.

**The JsDoc Parser**  

The second parameter passed to a parsing function is a JsDoc parser that looks only for JsDoc tags that ACID understands as well as some other non-standard tags that are used in the docsite.

It is a function that can parse any string as JsDoc with or without the standard comment markings.  It can also be passed a string with HTML comment markings (`<!-- -->`).

It will return an object with all the relevant data found in the comment parsed.
