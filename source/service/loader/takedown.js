import { pascalCase } from 'change-case'
import fs from 'node:fs'
import path from 'node:path'
import jsyaml from 'js-yaml'
import takedown from 'takedown'
import { attrsToObject, uid } from '#utils'
import references from './references.js'


let langRe = /^([^\s:]*)(?::(\w+))?(?:\s+(.+)$)?/;
let braceRe = /[{}]+/g;
let pageRe = /^catalog|component|document|home|section/;

export default async function (config)
{
    let { components, root } = config;

    let embeds = articleEmbeds(components);
    let refs = await references(config);

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
    let content = takedown(
    {
        convert:
        {
            fenceblock: (e, v) =>
            {
                let [ lang, dome, attrs ] = e.info?.match(langRe)?.slice(1) || [];
                let { file, mode = dome, ...rest } = attrsToObject(attrs);
                
                let code = file ? fs.readFileSync(path.resolve(root, file), 'utf8') : e.value;
                let main = { lang, mode, code, uid: v.uid };
                let data = { id: uid.hex(main), ...rest, ...main };
                
                v.blocks.push(data);

                return `<CoBEditor id="${data.id}" />`;
            },

            header: '<h{level} id="{id}" class="hx">{value}</h{level}>\n',
            setext: '<h{level} id="{id}" class="hx">{value}</h{level}>\n',

            link,

            root: e => 
            {
                let file = 
                `
                    ${e.value.replace(braceRe, '{"$&"}')}
            
                    <script module>${embeds}</script>
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

        refs,

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
    let comment = takedown(
    {
        convert:
        {
            divide: '{marks}',
            header: '<p data-h{level}><strong>{value}</strong></p>',
            setext: '<p data-h{level}><strong>{value}</strong></p>',
            link
        },

        refs
    });

    return { content, comment };
}

let embedRe = /^embed\//;

let articleEmbeds = map =>
{
    let imports = `import CoBEditor from '#stable/cobe/Editor'\n`;

    let reducer = (str, cid) => 
    {
        if (embedRe.test(cid) && map[cid]) 
            return str + `import ${pascalCase(cid.replace(embedRe, ''))} from '#custom/${cid}'\n`;
        
        return str;
    }

    return '\n' + Object.keys(map).reduce(reducer, imports);
}
