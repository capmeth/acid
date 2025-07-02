import { storage } from '#config'
import namespace from './namespace'


let store = { get: () => void 0, set: () => true };

if (storage === 'local' || storage === 'session')
{
    let storeApi = window[`${storage}Storage`];

    store = 
    { 
        get: (target, id) => target[id] ??= JSON.parse(storeApi.getItem(namespace(id))),
        set: (target, id, value) => (storeApi.setItem(namespace(id), JSON.stringify(target[id] = value)), true)
    }
}

/*
    Simple localStorage proxy.
*/
export default new Proxy({}, store);
