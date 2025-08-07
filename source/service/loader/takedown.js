import { camelCase } from 'change-case'
import jsyaml from 'js-yaml'
import takedown from 'takedown'
import { is } from '#utils'


// HTML attribute regex
let attrsRe = 
    /(?<k>[a-z_:][a-z0-9_.:-]*)(?:=(?:(?<v>[^\s"'<=>`]+)|"(?<v>(?:(?!\\").)*?)"|'(?<v>(?:(?!\\').)*?)'))?(?=\s|$)/gi;

/**
    Converts an attribute string into an object.

    @param { string } string
      String containing HTML attributes.
    @return { object }
      Attributes from `string`.
*/
let attrsToObject = string =>
{
    let result, attrs = {};

    while (result = attrsRe.exec(string || ''))
    {
        let { k: name, v: value } = result.groups;
        attrs[camelCase(name)] = is(value) ? value : true;
    }

    return attrs;
}


let langRe = /^([^\s:]*)(?::(\w+))?(?:\s+(.+)$)?/;
let braceRe = /[{}]+/g;
let pageRe = /^component|document|home|index|section/;

let link = e => 
{
    if (pageRe.test(e.href)) e.href = `#/${e.href}`;
    return '<a href="{href??}"{? title="{title}"?}>{value}</a>';
}

/*
    Example file markdown parser.

    - allow YAML-based front-matter
    - fencedblock converter produces Editor tags (for CoBEs)
    - root converter creates "Article" component
    - turn off delousing for fence block content
    - relative links adjusted
*/
export let tdContent = takedown(
{
    convert:
    {
        fenceblock: (e, v) =>
        {
            [ e.lang, e.mode, e.attrs ] = e.info?.match(langRe)?.slice(1) || [];
            let attrs = attrsToObject(e.attrs);
            // store details on code block
            v.blocks.push({ id: e.id, lang: e.lang, code: e.value, uid: v.uid, ...attrs });
            return '<Editor id="{id}"{? mode="{mode}"?} />';
        },

        header: '<h{level} id="{id}" class="hx">{value}</h{level}>\n',

        link,

        root: e =>
        {
            let file = 
            `
                ${e.value.replace(braceRe, '{"$&"}')}
        
                <script module>
                import Editor from '#comps/cobe/Editor'
                </script>
            `;
            
            return file;
        }
    },

    fm:
    {
        enabled: true,
        parser: source => jsyaml.load(source),
        useConfig: false
    },

    delouse:
    {
        fenceblock: { value: [], info: [ 'htmlEntsToChars', 'unescapePunct' ] }
    }
});

/*
    Code comments markdown parser.

    - no header tags allowed
    - no thematic breaks allowed
    - relative links adjusted
*/
export let tdComment = takedown(
{
    convert:
    {
        divide: '{marks}',
        header: '<p data-h{level}><strong>{value}</strong></p>',
        link
    }
});
