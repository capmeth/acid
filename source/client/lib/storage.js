import { storage } from '#config'
import namespace from './namespace'


let stoxie = storage =>
{
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

    return new Proxy({}, store);
}

export default stoxie(storage);

export let local = stoxie('local');
