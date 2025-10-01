import { on } from 'svelte/events'
import { namespace as ns, socket } from '#config'


export default function()
{
    let { port, recoAttempts, recoAttemptDelay } = socket;
    let tries = 0;

    let reload = () => location.reload()
    let success = () => (tries = 0, console.info(`Successfully connected to ${ns} server.`))
    let connect = () =>
    {
        let socket = new window.WebSocket(`ws://localhost:${port}`);
        
        on(socket, 'close', reconnect);
        on(socket, 'open', success);
        on(socket, 'message', reload);
    }
    let reconnect = () => 
    {
        tries ++;
        if (tries <= recoAttempts) 
        {
            console.info(`Trying to reconnect to ${ns} server... ${tries}`);
            setTimeout(connect, recoAttemptDelay);
        }
        else
        {
            console.info(`I gave up after trying ${recoAttempts} times to reconnect with ${ns} server.`);
        }
    }

    connect();
}
