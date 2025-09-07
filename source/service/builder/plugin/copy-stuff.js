import fs from 'node:fs/promises'
import path from 'node:path'
import globit from '#lib/globit.js'
import pathTransformer from '#lib/path-transformer.js'
import { ident } from '#utils'


export default function ({ specs, rootpath, outpath })
{
    let plugin = {};

    plugin.name = 'copy-stuff';

    plugin.buildEnd = async error =>
    {
        if (error) return;

        let copies = 0;

        await Promise.all(specs.map(async spec => 
        {
            let files = await globit(spec.files, rootpath);
            let toDest = pathTransformer(spec.to) ?? ident;

            await Promise.all(files.map(async file => 
            {
                let from = path.resolve(rootpath, file)
                let to = path.resolve(outpath, toDest(file) || file);
                // do not copy if file is out of bounds
                if (to.startsWith(outpath))
                {
                    return fs.cp(from, to, { recursive: true }).then(() => 
                    {
                        log.test(`copied {:white:${file}} to {:white:${to}}`);
                        copies ++;
                    });
                }
                else
                {
                    log.warn(`{:yellowBright:${file}} was not copied as destination is outside output directory`);
                }
            }));
        }));

        if (copies > 0) 
            log.info(`{:cyanBright:${copies} additional file(s)} were copied to output directory`);
    }

    return plugin;
}
