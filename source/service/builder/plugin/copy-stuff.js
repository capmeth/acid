import fs from 'node:fs/promises'
import path from 'node:path'
import globit from '#node/globit.js'
import { inter, is } from '#utils'


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
            let toDest = getDestFn(spec.to);
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

let getDestFn = spec =>
{
    if (is.func(spec)) return spec;
    if (is.string(spec)) 
    {        
        return str => 
        {
            let dir = path.dirname(str);
            let ext = path.extname(str);
            let name = path.basename(str, ext);

            return inter(spec, { dir, ext, name });
        }
    }
    if (is.array(spec))
    {
        let [ search, replace ] = spec;
        if (is.array(search)) 
            search = new RegExp(...[].concat(search));
        return str => str.replace(search, replace || '')
    }
    return str => str
}
