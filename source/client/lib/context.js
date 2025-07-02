import { getContext, setContext } from "svelte";
import ns from "./namespace";


export default new Proxy({ [ns('global')]: {} }, 
{
    get: (target, key) => target[ns(key)] ?? getContext(ns(key)),
    set: (target, key, val) => Object.hasOwn(target, ns(key)) ? false : (setContext(ns(key), val), true)
});
