import { is } from '#utils';
import component from './component.js'
import document from './document.js'
import section from './section.js'


export default function (config, other)
{
    let cmp = component(config);
    let doc = document(config);
    let sect = section(config);

    let toProc = (...routines) => async record =>
    {
        for (let routine of routines)
        {
            let res = await routine(record);
            // a function is a request for helpers
            if (is.func(res)) res = await res(other);
            // short circuit processing on non-object
            if (!is.nonao(res)) return null;
        }
        
        return record;
    }

    let map = tid => record =>
    {
        if (record.tid === tid)
        {
            return ({ assets }) =>
            {
                let { uid } = record;

                if (assets[uid])
                {
                    log.warn(`duplicate asset {:yellowBright:${uid}} was skipped`);
                    return null;
                }

                return assets[uid] = record;
            }
        }

        return record;
    }

    return other.assemble = 
    {
        section: toProc(sect.overview, sect.assets, sect.cleanup),
        document: toProc(doc.markdown, doc.options, doc.identify, map('doc'), doc.parse, doc.cleanup),
        component: toProc(cmp.source, cmp.identify, map('cmp'), cmp.example, cmp.cleanup)
    };
}
