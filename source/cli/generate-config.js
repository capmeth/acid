import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import { hackson } from '#lib/hosted.js'
import { is } from '#utils'
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
    // name for the docsite
    title: ${jss(config.title)},

    // generated artifacts location
    output: ${format(config.output, 1)},

    // root directory of project
    root: ${jss(config.root)},

    // meta-tags for html <head> tag
    metas:
    [
        { charset: 'utf8' },
        { name: 'author', content: ${jss(hackson.author || 'unknown')} },
        { name: 'description', content: ${jss(hackson.description || 'ACID generated docsite.')} },
        { name: 'keywords', content: ${jss(hackson.keywords || 'components, documentation')} }
    ],

    // docsite information structure
    sections: ${format(config.sections, 1)},

    // top level section of docsite
    rootSection: ${jss(config.rootSection)},

    // header level depth for table-of-contents
    tocDepth: ${jss(config.tocDepth)},

    // docsite styling
    style: ${jss(config.style)},

    // custom asset tags
    tagLegend: {},

    // http-server: keep disabled to run from CLI
    server:
    {
        enabled: false,
        port: ${jss(config.server.port)}
    }
}
`

let jss = str => JSON.stringify(str)

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
