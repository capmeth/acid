import { is } from '#utils';
import common from './common.js'
import component from './component.js'
import document from './document.js'
import section from './section.js'


export default function (config, other)
{
    let cmn = common(config);
    let cmp = component(config);
    let doc = document(config);
    let sect = section(config);

    let toProc = (...routines) => async record =>
    {
        /* eslint-disable no-await-in-loop */
        // routines must be executed sequentially (and therefore synchronously)
        for (let routine of routines)
        {
            let res = await routine(record);
            // a function is a request for helpers
            if (is.func(res)) res = await res(other);
            // short circuit processing on non-object
            if (!is.nonao(res)) return null;
        }
        /* eslint-enable no-await-in-loop */
        
        return record;
    }

    return other.assemble = 
    {
        section: toProc(sect.overview, sect.assets, sect.cleanup),
        document: toProc(doc.markdown, doc.options, doc.identify, cmn.docmap, doc.parse, doc.cleanup, cmn.doctag),
        component: toProc(cmp.source, cmp.identify, cmn.cmpmap, cmp.example, cmp.cleanup, cmn.cmptag)
    };
}
