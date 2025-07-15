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

        return Promise.all(specs.map(async spec => 
        {
            let files = await globit(spec.files, rootpath);
            let toDest = pathTransformer(spec.to) ?? ident;
            let copies = 0;

            await Promise.all(files.map(async file => 
            {
                let from = path.join(rootpath, file)
                let to = path.resolve(outpath, toDest(file) || file);
                // do not copy if file is out of bounds
                if (to.startsWith(outpath))
                {
                    return fs.cp(from, to, { recursive: true }).then(() => 
                    {
                        log.test(`copied {:whiteBright:${file}} to ${to}`);
                        copies ++;
                    });
                }
                else
                {
                    log.warn(`copying {:whiteBright:${file}} was skipped as destination is outside ${outpath}`)
                }
            }));

            if (copies > 0) log.info(`{:whiteBright:${copies} additional file(s)} were copied into ${outpath}`);
        }));
    }

    return plugin;
}
