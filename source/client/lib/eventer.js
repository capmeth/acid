
/**
    Creates an new event emitter.

    the returned objec includes:
    - `on(name, fn)`: add a listener for event name
    - `off(name, fn)`: remove a listener from event name
    - `fire(name, ...args)`: dispatch a named event
    - `last(name)`: get data from most recent named event 

    @return { object }
      Event emission interface.
*/
export default function()
{
    let events = {}, data = {};
    let evts = name => events[name] ??= []

    let fire = (name, ...args) => (data[name] = args, evts(name).forEach(fn => fn(...args)))
    let last = name => data[name] || []
    let on = (name, fn) => { typeof fn === 'function' && evts(name).push(fn); }
    let off = (name, fn) => 
    {
        let fns = evts(name), index = fns.indexOf(fn);
        index >= 0 && fns.splice(index, 1);
    }

    return { fire, last, on, off };
}
