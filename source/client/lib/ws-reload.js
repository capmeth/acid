import { on } from 'svelte/events'
import { namespace as ns, socket } from '#config'


export default function()
{
    let { hostname } = new URL(import.meta.url);
    let { port, recoAttempts, recoAttemptDelay } = socket;
    let build, tries = 0;

    let receive = evt => 
    {
        let { message, buildId } = JSON.parse(evt.data);

        if (message === 'reload' || (build ??= buildId) !== buildId)
            location.reload();
    }
    let success = () => (tries = 0, console.info(`Successfully connected to ${ns} server.`))
    let connect = () =>
    {
        let socket = new window.WebSocket(`ws://${hostname}:${port}`);
        
        on(socket, 'close', reconnect);
        on(socket, 'open', success);
        on(socket, 'message', receive);
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
