import { WebSocketServer } from 'ws'


/*
    Creates a WebSocketServer using configured port.
*/
export default function socketer(config)
{
    let { server, socket: { port }, watch } = config;

    // no web socket needed if http server and watch disabled
    let enabled = server.enabled && watch.enabled;
    let wss;

    let start = async () =>
    {
        if (enabled && wss?.options.port !== port)
        {
            close();

            wss = new WebSocketServer({ port });
            wss.on('listening', () => log.info(`{:emph:hot-reload} is enabled via port {:emph:${port}}`));
            wss.on('error', err => log.warn(`websocket error: {:emph:${err}}`));            
        } 
    }

    let send = msg => wss?.clients.forEach(cli => cli.send(msg))

    let close = async () =>
    {
        if (wss)
        {
            return new Promise(accept => 
            {
                wss.on('close', () => (log.info('the socket server has stopped'), accept()))
                // ws docs seem to be lacking on how to gracefully terminate socket 
                // server, but I think this is it
                wss.clients.forEach(client => client.close());
                wss.close(); 

                wss = void 0;
            });
        }
    };

    return { close, send, start };
}
