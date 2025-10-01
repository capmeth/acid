import { existsSync } from 'node:fs';
import fs from 'node:fs/promises'
import path from 'node:path'
import takedown from 'takedown'
import { is } from '#utils'


/*
    Extracts link references from markdown files.
*/
export default async function (config)
{
    let { refLinks, root } = config;

    let fileRe = /^file:\//;
    let td = takedown();

    let promises = refLinks.map(async item => 
    {
        if (is.string(item))
        {
            if (fileRe.test(item))
            {
                let abspath = path.resolve(root, item.replace(fileRe, ''));

                if (!existsSync(abspath))
                {
                    log.warn(`reference link file {:emph:${abspath}} does not exist`);
                    return {};
                }

                item = await fs.readFile(abspath, 'utf8');
            }

            return td.parse(item).meta.refs;
        }

        return item;
    });

    let merge = items => items.reduce((obj, item) => ({ ...obj, ...item }), {})

    return Promise.all(promises).then(merge);
}
