import merge from 'deepmerge'


export default function (config)
{
    let { assetTypes, tagLegend } = config;

    let tagmap = new Map();
    Object.entries(tagLegend).forEach(([ key, val ]) => val.assign && tagmap.set(val.assign, key));

    /**
        Adds the asset record to the master list.

        @param { object } record
          - `uid`: asset id
        @return { object }
          Asset record or `null` if asset already added.
    */
    let map = record =>
    {
        return ({ assets }) =>
        {
            let { uid } = record;

            if (assets[uid])
            {
                log.warn(`duplicate asset {:emph:${uid}} was skipped`);
                return null;
            }

            return assets[uid] = record;
        }
    }

    /**
        Adds tag(s) to assets as per configuration.

        @param { object } record
          - `tags`: asset info-stamps
          - `uid`: asset id
        @return { object }
          - `tags`: added info-stamps
    */
    let tag = async record =>
    {
        if (tagmap.size)
        {
            let promises = [];
            let recordCopy = merge({}, record);

            for (let fn of tagmap.keys())
            {
                promises.push(Promise.resolve(fn(recordCopy)).then(info => 
                {
                    if (info)
                    {
                        let name = tagmap.get(fn);
                        let tag = info === `true` ? name : `${name}:${info}`;

                        record.tags ||= [];
                        record.tags.push(tag);

                        log.test(`tag {:emph:${tag}} was auto-assigned to asset {:emph:${record.uid}}`);
                    }
                }));
            }

            return Promise.all(promises).then(() => record);
        }

        return record;
    }

    let check = (tid, fn) => record => record.tid === tid ? fn(record) : record

    let cmn = {};

    Object.keys(assetTypes).forEach(key => 
    {
        cmn[`${key}map`] = check(key, map);
        cmn[`${key}tag`] = check(key, tag);
    });

    return cmn;
}
