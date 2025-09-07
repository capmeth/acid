import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { hackson } from '#lib/hosted.js'
import { is, jss } from '#utils'
import { assign, defaults } from '../config/index.js'


/**
    Generates a starter config file.

    @param { string } dest
      Destination of generated file.
    @param { object } options
      Addtional config options to apply.
*/
export default async function (dest, options)
{
    if (!dest) dest = 'acid.config.js';
 
    if (existsSync(dest))
    {
        console.error(`File ${dest} already exists.`);
        return void 0;
    }

    let { config } = assign(defaults, options);
    let code = content(config)

    return fs.writeFile(dest, code, { encoding: 'utf8' });
}

let content = config =>
`
${hackson.type === 'module' ? 'export default' : 'module.exports ='}
{
    /*
        Display name for the docsite.
    */
    title: ${jss(config.title)},

    /*
        Location of generated docsite artifacts.
    */
    output: ${format(config.output, 1)},

    /*
        <meta> tags for <head> tag
        Strings items pull from package.json to generate name/content tags
    */
    metas: ${jss(config.metas)},

    /*
        Docsite organizational structure.
    */
    sections: ${format(config.sections, 1)},

    /*
        Top level docsite section.
    */
    rootSection: ${jss(config.rootSection)},

    /*
        Default header level depth for table-of-contents.
    */ 
    tocDepth: ${jss(config.tocDepth)},

    /*
        Docsite styling.
    */
    style: ${jss(config.style)},

    /*
        Asset tag descriptions.
    */
    tagLegend: {},

    /*
        Dev http-server.
        Keep this disabled to activate from CLI.
    */
    server: ${format(config.server, 1)}
}
`

let format = (object, indent) =>
{
    let isArr = is.array(object);
    let str = '\n';

    str += ' '.repeat(indent * 4);
    str += isArr ? '[' : '{';

    Object.keys(object).forEach(key =>
    {
        let val = object[key], isObj = is.object(val);
        let ind = ' '.repeat((indent + 1) * 4);

        str += isArr ? isObj ? '' : `\n${ind}` : `\n${ind}${key}: `;
        str += (isObj ? format(val, indent + 1) : jss(val)) + ',';
    });

    str += '\n';
    str += ' '.repeat(indent * 4);
    str += isArr ? ']' : '}';

    return str;
}
