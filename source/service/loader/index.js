import { mapExtensions } from '#utils'
import importer from '../importer/index.js'
import assemblers from './assemblers/index.js'
import parentize from './parentization.js'
import takedown from './takedown.js'


export default function(config)
{
    let { parsers, root, rootSection } = config;

    let linked = parentize(config.sections, rootSection);
    let linkeys = Object.keys(linked);

    let promises = Promise.all([ takedown(config), mapExtensions(parsers, importer(root)) ]);

    return async () => 
    {
        let [ td, parsers ] = await promises;

        let assets = {}, blocks = [], files = {}, sections = {};
        let assemble = assemblers(config, { assets, files, parsers, td });
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
