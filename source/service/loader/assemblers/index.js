import { is, proxet } from '#utils';
import operations from './operations.js'


export default function (config, other)
{
    let { finalizeAsset } = config;
    let op = operations(config);

    let exec = proxet({}, key => async record => 
    {
        let res = await op[key](record, exec);
        // a function is a request for helpers
        if (is.func(res)) res = await res(other);
        // short circuit processing on non-object
        return is.nonao(res) ? record : null;
    });

    let toProc = (...routines) => async record =>
    {
        /* eslint-disable no-await-in-loop */
        // routines must be executed sequentially (and therefore synchronously)
        for (let routine of routines) if (!(await routine(record))) return null;
        /* eslint-enable no-await-in-loop */
        
        if (record.tid && finalizeAsset)
        {
            let { section, tid, uid } = record;
            record = finalizeAsset(record);
            if (record) record = { ...record, section, tid, uid };
        }

        return record;
    }

    return other.assemble = 
    {
        section: toProc(exec.options, exec.assets, exec.title, exec.cleanup),
        document: toProc(exec.identify, exec.options, exec.tag, exec.title, exec.access, exec.cleanup),
        component: toProc(exec.identify, exec.source, exec.example, exec.tag, exec.title, exec.access, exec.cleanup)
    };
}
