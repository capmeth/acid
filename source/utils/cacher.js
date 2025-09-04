import uid from './uid.js'


/**
    Returns a function that wraps `fn` for caching purposes.
    
    The returned function passes all values directly to wrapped `fn` and caches 
    the return value.
    
    Note that 'fn` is not invoked by the wrapping function if a cached value 
    exists for the given set of arguments.
    
    To clear cache on the wrapped function, do `fn.clearCache()`
    
    @param { function } fn
      The function to be wrapped.
    @return { function }
      A function that calls `fn` with the same parameters given.
*/
export default function cacher(fn)
{    
    let cache = {};
    
    let exec = (...args) =>
    {
        let cid = uid.hex([fn, args]);
        return cache[cid] = Object.hasOwn(cache, cid) ? cache[cid] : fn(...args);            
    }
    
    exec.clearCache = () => void (cache = {});
    
    return exec;
}
