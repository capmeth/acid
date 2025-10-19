
/**
    Debouncer.

    Function `action` is always queued via `setTimeout`.  If `wait` is not a 
    number or less than zero, it is set to `0` (queued for immediate 
    execution).
    
    @param { function } action
      Function to execute.
    @param { number } wait
      Milliseconds to timeout.
*/
export default function(action, wait)
{
    let id, time;
  
    let timer = function(...args)
    {
        timer.stop();
        id = setTimeout(() => action.call(this, ...args), time);        
    }
    
    timer.wait = wait => (time = wait >= 0 ? wait : 0, timer);
    timer.stop = () => (clearTimeout(id), timer)

    timer.wait(wait);
    
    return timer;
}
