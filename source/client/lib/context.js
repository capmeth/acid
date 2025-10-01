import { getContext, setContext } from "svelte";
import ns from "./namespace";


export default new Proxy({}, 
{
    get: (_, key) => getContext(ns(key)),
    set: (_, key, val) => (setContext(ns(key), val), true)
});
