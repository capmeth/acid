import fs from 'node:fs/promises'
import path from 'node:path'
import globit from '#lib/globit.js'
import pathTransformer from '#lib/path-transformer.js'


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
            let toDest = pathTransformer(spec.to, rootpath);

            await Promise.all(files.map(async file => 
            {
                let from = path.resolve(rootpath, file)
                let to = path.resolve(outpath, toDest?.(file) || file);
                // do not copy if file is out of bounds
                if (to.startsWith(outpath))
                {
                    return fs.cp(from, to, { recursive: true }).then(() => 
                    {
                        copies ++;
                        
                        log.test(() => 
                        {
                            let frel = path.relative(rootpath, from), trel = path.relative(outpath, to);
                            return `copied {:emph:${frel}} to output directory as {:emph:${trel}}`
                        });
                    });
                }

                log.warn(`{:emph:${frel}} was not copied as destination is outside output directory`);
            }));
        }));

        if (copies > 0) 
            log.info(`{:emph:${copies} additional file(s)} were copied to output directory`);
    }

    return plugin;
}
