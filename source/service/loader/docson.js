import { is, mapComment, uncomment } from '#utils'


/** 
    Parses JSDoc comments into `target` object.

    @param { string } comment
      Data to be parsed.
    @param { object | Proxy } target
      Object to which JsDoc tag data will be added.
    @return { object | Proxy }
      Updated `target` object.
*/
export default (comment, target = {}) => 
{
    mapComment(uncomment(comment), (tag, spec) => 
    {
        let data = procs[tag]?.(spec);
        is.func(data) ? data(target) : Object.assign(target, data);
    });

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
          - `fallback`: default value for the thing
    */
    default: spec => ({ fallback: spec }),
    /**
        @return { object }
          - `deprecated`: details about why the thing is no longer useful
    */
    deprecated: spec => ({ deprecated: spec || true }),
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
            - `type`: data type
            - `description`: property description
            - `fallback`: default value 
            - `required`: is property required?
    */
    property: spec =>
    {
        let [ type, rest ] = caps(typeDescRe, spec);
        let [ param, description ] = caps(paramDescRe, rest);
        let [ name, fallback ] = caps(nameDefvalRe, param);

        let prop = {};
        
        prop.name = name;
        if (description) prop.description = description;
        if (type) prop.type = type;
        if (fallback) prop.fallback = fallback;
        prop.required = !isOptionalRe.test(param);

        return t => t.props = [ ...t.props || [], prop ];
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
