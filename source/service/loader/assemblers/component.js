import { kebabCase } from 'change-case'
import { existsSync } from 'node:fs'
import np from 'node:path'
import { is } from '#utils'
import docson from '../docson.js'
import doxie from '../doxie.js'


/*
    Generates routines for creating component assets.
*/
export default function(config)
{
    let { root, toAssetId, toExampleFile, useFilenameOnly } = config;

    let cmp = {};

    /**
        Loads source file `path` if present.

        @param { object } record
          - `path`: source file path
        @return { object }
          All parsed data added.
    */
    cmp.source = async record =>
    {
        let { path } = record;

        if (is.string(path))
        {
            let abspath = np.resolve(root, path);
            
            if (existsSync(abspath))
            {
                return async ({ parsers, td }) =>
                {
                    let ext = np.extname(abspath);
                    let parser = { ...parsers['*'], ...parsers[ext] };

                    if (parser.use)
                    {
                        let data = doxie(path, td.comment);
                        await parser.use(abspath, data, docson);

                        Object.assign(record, data);

                        if (record.ignore) return null;
                    }

                    return record;
                }
            }
        }

        return record;
    }


    /**
        Identifies the component asset.

        @param { object } record
          - `path`: file path
          - `section`: parent section
          - `title`: document title
        @return { object}
          - `tid`: "doc"
          - `title`: component name
          - `uid`: unique id
    */
    cmp.identify = record =>
    {
        let { path } = record;

        record.tid = 'cmp';
        record.uid = kebabCase(toAssetId(path));
        record.title = record.name;

        if (useFilenameOnly || !record.title)
            record.title = np.basename(path, np.extname(path));

        return record;
    }

    /**
        Extract details from an example file.

        Uses `toExampleFile` config option to determine example file path if 
        `example` not set.

        @param { object } record
          - `example`: path to example file
          - `path`: source file path (consumed)
        @return { object }
          - `path`: example file path

    */
    cmp.example = record =>
    {
        let { example, path } = record;

        record.path = example || toExampleFile(path);

        return ({ assemble }) => assemble.document(record);
    }


    /**
        Remove properties not needed in bundle.

        This should be the last step called.

        @return { object }
          A clean record.
    */
    cmp.cleanup = record =>
    {
        delete record.example;
        delete record.name;
        delete record.path;

        return record;
    }

    return cmp;
}
