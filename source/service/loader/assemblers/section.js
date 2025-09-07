import globit from '#lib/globit.js'
import { is } from '#utils'


/*
    Generates routines for assembling section data.
*/
export default function(config)
{
    let { assetTypes, root } = config;

    let types = Object.values(assetTypes);
    let fileRe = /^file:\//;

    let sect = {};

    /**
        Extract details from `overview` content.

        @param { object } record
          - `overview`: string content or filepath
        @return { object }
          - `path`: document filepath
          - `content`: document content
    */
    sect.overview = record =>
    {
        let { overview } = record;

        if (fileRe.test(overview))
            record.path = overview.replace(fileRe, '');
        else
            record.content = overview;

        return ({ assemble }) => assemble.document(record);
    }

    /**
        Processes the section assets.

        @param { object } record
          Asset list properties (consumed).
        @return { object}
          - `assets`: uids of all associated to the section
    */
    sect.assets = record =>
    {
        record.assets = [];

        return async ({ assemble }) =>
        {
            await Promise.all(types.map(async ({ plural, singular }) => 
            {
                let files = await globit(record[plural], root);
                let array = await Promise.all(files.map(path => assemble[singular]({ path, section: record.name })));

                record.assets = [ ...record.assets, ...array.filter(is).map(item => item.uid) ];
            }));

            return record;
        }
    }    

    /**
        Remove properties not needed in bundle.

        This should be the last step called.

        @return { object }
          A clean record.
    */
    sect.cleanup = record =>
    {
        delete record.overview;
        delete record.path;
        delete record.uid;

        types.forEach(({ plural }) => delete record[plural]);

        return record;
    }

    return sect;
}
