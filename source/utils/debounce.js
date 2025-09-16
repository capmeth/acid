
/**
    Debouncer.

    If `wait` is negative, `action` will be called immediately instead
    of being queded.
    
    @param { function } action
      Function to execute.
    @param { number } wait
      Milliseconds to timeout.
*/
export default function(action, wait = 0)
{
    let id = void 0, time = wait;
  
    let timer = function(...args)
    {
        timer.stop();

        let func = () => action.call(this, ...args);

        id = time >= 0 ? setTimeout(func, time) : (func(), id);        
    }
    
    timer.wait = (wait = 0) => (time = wait, timer);
    timer.stop = () => (clearTimeout(id), timer)
    
    return timer;
}
