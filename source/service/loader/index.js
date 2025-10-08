import { ident, mapExtensions } from '#utils'
import importer from '../importer/index.js'
import assemblers from './assemblers/index.js'
import parentize from './parentization.js'
import takedown from './takedown.js'


export default function(config)
{
    let { parsers, root, rootSection, updateMarkdown } = config;

    let linked = parentize(config.sections, rootSection);
    let linkeys = Object.keys(linked);

    let makeParser = td => 
    {
        let replace = ident;

        if (updateMarkdown)
        {
            replace = md =>
            {
                let data = td.partition(md);
                return (data[1] || '') + updateMarkdown(data[0]);
            }
        }

        return (md, config) => td.parse(replace(md), config)
    }
    
    let promises = Promise.all([ takedown(config), mapExtensions(parsers, importer(root)) ]);

    return async () => 
    {
        let [ td, parsers ] = await promises;

        let md = { content: makeParser(td.content), comment: makeParser(td.comment) };
        let assets = {}, blocks = [], files = {}, sections = {};
        let assemble = assemblers(config, { assets, files, parsers, md });
        let mapper = async name => sections[name] = await assemble.section({ ...linked[name], name })

        td.content.config.vars.blocks = blocks;

        await Promise.all(linkeys.map(mapper));
        blocks = await Promise.all(blocks);
        
        log.info(`{:emph:${Object.keys(sections).length} section(s)} included in docsite`);
        log.info(`{:emph:${Object.keys(assets).length} asset(s)} included in docsite`);

        log.info(`{:emph:${Object.keys(files).length} markdown component(s)} were generated`);
        log.info(`{:emph:${blocks.length} code block(s)} were indexed`);

        return { sections, assets, files, blocks };
    }
}
