import { unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { rollup } from 'rollup'
import rollConfig from '../rollup.config.js'


export default function (config)
{
    let { root } = config;

    return async ext =>
    {
        let data = {};

        data.file = `${ext.name}-exts.js`;
        data.code =
        `
            import mapExts from '#extend/lib/map-exts'
            import imported from '#importer'
            let specs = ${JSON.stringify(ext.specs)};
            export default await mapExts(specs, imported, '${ext.name}')
        `;
        data.importFile = path.join(root, `temp-acid-${ext.name}.mjs`);
        // write a file at root of hosted app for module resolution
        writeFileSync(data.importFile, exportsCode(ext.specs, ext.name));

        try 
        {
            let build = rollConfig(config, data);
            let bundle = await rollup(build);
    
            await bundle.write(build.output).then(() => bundle.close());
        }
        finally
        {
            unlinkSync(data.importFile);
        }
    }
}


let exportsCode = (specs, name) =>
{
    let lines = [];

    lines.push(`let imported = {}`);

    specs.forEach((ext, idx) => 
    {
        let [ modname ] = ext.use || [];
        
        if (modname)
        {
            let iname = name + idx;
            lines.push(`import ${iname} from '${modname}'`);
            lines.push(`imported['${modname}'] = ${iname}`);
        }
    });

    lines.push(`export default imported`);

    return lines.join('\n');
}
