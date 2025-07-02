
/*
    Custom JSDoc to JSON (docson) parser
    ---------------------------------------------------------------------------
*/
let jsRe = /^\s*\/\*\*(.+?)\*\/\s*$/s;
let htmlRe = /^\s*<!--\*(.+?)-->\s*$/s;
let truncRe = /^(?:\s(?<!\n))*(?:\*(?: |$))?/gm;

/**
    Trims comment string and strips comment markers (js and html) including *'s
    at beginning of lines. 
*/
let stripMarkers = source =>
{
    let adjusted = source;

    if (jsRe.test(adjusted)) 
        adjusted = jsRe.exec(adjusted)[1];
    else if (htmlRe.test(adjusted)) 
        adjusted = htmlRe.exec(adjusted)[1];

    if (truncRe.test(adjusted))
        adjusted = adjusted.replace(truncRe, '');

    return adjusted;
}


let tagdefRe = /(?:^\s*(?!\s|@)(?<spec>.+?)|(?<=(^|\n)\s*)@(?<tag>\w+)(?:\s+(?<spec>.+?))?)\s*(?=\n\s*@|$)/gsi;

let alias =
{
    arg: 'param',
    argument: 'param',
    defaultvalue: 'default',
    enums: 'values',
    desc: 'description',
    emits: 'fires',
    func: 'function',
    method: 'function',
    return: 'returns'
};

/**
    Splits comment into individual parts by tags.  This selects the tag marker 
    and everything after it until the next tag marker.  Initial portion without 
    tag is always "description".
*/
let divideTags = (source, target) =>
{
    for (let match of source.matchAll(tagdefRe))
    {
        // default `tag` to "description" for comment open without tag
        let { tag = 'description', spec = '' } = match.groups;
        // only push data from understood tags
        Object.assign(target, procs[alias[tag] || tag]?.(spec));
    }

    return target;
}

// execute regex and skip to capture groups
let caps = (re, str, fn = (...x) => x) => fn(...(re.exec(str || '') || []).slice(1))

// => name <email>
let nameEmailRe = /^(.+?)(?:\s+<(.+?)>)?$/;
// => { type }
let typeRe = /^\{\s*(.+?)\s*\}$/;
// let typeRe = /^\{\s*(\.\.\.|!|\?)?\s*(.+?)\s*\}$/;
// => { type } This is a description.
let typeDescRe = /^\{\s*(.+?)\s*\}\s*(.+)?$/s;
// let typeDescRe = /^\{\s*(\.\.\.|!|\?)?\s*(.+?)\s*\}\s*(.+)?$/s;
// => name - This is a description.
let paramDescRe = /^(\[.+?\]|[\w$:.-]+)(?:\s+(?:-\s+)?|\s*\n)?(.+)?$/s;
// => name=defaultValue
let nameDefvalRe = /^\[?\s*(.+?)(?:\s*=\s*(.+?))?\s*\]?$/;
// => class#member
let classMemberRe = /^(.+?)#(.+?)$/;

let isOptionalRe = /^\[.+?\]$/;
let commaRe = /\s*,\s*/;

/*
    The object return value of these processors is merged to build the coment
    spec.
*/
let procs = 
{
    /**
        @return { object }
          `access`: encapsulation level of the thing
    */
    access: spec => ({ access: spec }),
    /**
        @return { object }
          - `name`: author's name
          - `email`: author's email address
    */
    author: spec => caps(nameEmailRe, spec, (name, email) => ({ author: { name, email } })),
    /**
        Non-standard JsDoc.

        @return { object }
          - `kind`: sets thing type to "component"
          - `name`: name of the thing
    */
    component: spec => ({ kind: 'component', name: spec }),
    /**
        @return { object }
          - `default`: default value for the thing
    */
    default: spec => ({ default: spec }),
    /**
        @return { object }
          - `deprecated`: details about why the thing is no longer useful
    */
    deprecated: spec => ({ deprecated: spec }),
    /**
        @return { object }
          - `description`: how to use the thing
    */
    description: spec => ({ description: spec }),
    /**
        @return { object }
          - `kind`: sets thing type to "event"
          - `owner`: identifies who owns the thing
          - `name`: name of the thing
    */
    event: spec => caps(classMemberRe, spec, (owner, name) => ({ kind: 'event', owner, name })),
    /**
        @return { object }
          - `example`: example use of the thing 
    */
    example: spec => ({ example: spec }),
    /**
        @return { object }
          - `owner`: identifies who owns the thing
          - `event`: name of the event fired by the thing
    */
    fires: spec => caps(classMemberRe, spec, (owner, event) => ({ fires: { owner, event } })),
    /**
        @return { object }
          - `kind`: sets thing type to "function"
          - `name`: name of the thing
    */
    function: spec => ({ kind: 'function', name: spec }),
    /**
        @return { object }
          - `ignore`: should this thing be ignored?
    */
    ignore: () => ({ ignore: true }),
    /**
        @return { object }
          - `kind`: nature/type of the thing
    */
    kind: spec => ({ kind: spec }),
    /**
        @return { object }
          - `license`: license for the thing
    */
    license: spec => ({ license: spec }),

    /**
        @return { object }
          - `name`: name of the thing
    */
    name: spec => ({ name: spec }),
    /**
        Non-standard JsDoc.

        @return { object }
          - `kind`: sets thing type to "prop"
          - `name`: name of the thing
    */
    prop: spec => ({ kind: 'prop', name: spec }),
    /**
        @return { object }
          - `prop`
            - `name`: name of property
            - `mod`: type modifier (spread, nullable)
            - `type`: data type
            - `desc`: property description
            - `default`: default value 
            - `optional`: is property optional?
    */
    property: spec =>
    {
        let [ type, rest ] = caps(typeDescRe, spec);
        let [ param, description ] = caps(paramDescRe, rest);
        let [ name, fallback ] = caps(nameDefvalRe, param);
        let required = !isOptionalRe.test(param);

        return { prop: { name, type, description, fallback, required } };
    },
    /**
        @return { object }
          - `access`: makes the thing public
    */
    public: () => ({ access: 'public' }),
    /**
        Non-standard JsDoc.

        @return { object }
          - `required`: Is this thing mandatory?
    */
    required: () => ({ required: true }),
    /**
        @return { object }
          - `mod`: type modifier (spread, nullable)
          - `type`: return value type
          - `desc`: description of return value
    */
    returns: spec => caps(typeDescRe, spec, (type, desc) => ({ type, desc })),
    /**
        @return { object }
          - `see`: indicate some other related thing
    */
    see: spec => ({ see: spec }),
    /**
        @return { object }
          - `since`: version in which this thing was added
    */
    since: spec => ({ since: spec }),
    /**
        @return { object }
          - `summary`: a summarized description of the thing
    */
    summary: spec => ({ summary: spec }),
    /**
        Non-standard JsDoc.

        @return { object }
          - `tags`: list of tags
    */
    tags: spec => ({ tags: spec.split(commaRe) }),
    /**
        @return { object }
          - `mod`: type modifier (spread, nullable)
          - `type`: data type
    */
    type: spec => caps(typeRe, spec, type => ({ type })),
    /**
        @return { object }
          - `values`: enumerated values for the thing
    */
    values: spec => ({ values: spec.split(commaRe) }),
    /**
        @return { object }
          - `version`: current version of the thing
    */
    version: spec => ({ version: spec }),
};

/** 
    Parses JSDoc comments into `target` object.

    Values are not aggregated for repeatable tags found in a comment.  They
    are simply assigned directly to `target`.  Thus, `target` is preferably a 
    Proxy that can handle multiple assignments to the same key internally.

    @param { string } comment
      Data to be parsed.
    @param { object | Proxy } target
      Object to which JsDoc tag data will be added.
    @return { object | Proxy }
      Updated `target` object.
*/
export default (comment, target) => divideTags(stripMarkers(comment), target)
