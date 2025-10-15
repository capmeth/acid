import { WebSocketServer } from 'ws'


let voidSock = { close: () => void 0, send: () => void 0 };
let sock = voidSock;

/*
    Creates a WebSocketServer using configured port.
*/
export default function socketer(config)
{
    let { server, socket: { port }, watch } = config;

    let enabled = server.enabled && watch.enabled;

    // no web socket needed if http server and watch disabled
    if (!enabled) return (sock.close(), sock);

    if (sock.port !== port)
    {
        sock.close();

        let wss = new WebSocketServer({ port });
        let send = msg => wss.clients.forEach(cli => cli.send(msg));
        let close = () => new Promise(accept =>
        {
            sock = voidSock;
            wss.on('close', () => (log.info('the socket server has stopped'), accept()))
            // ws docs seem to be lacking on how to gracefully terminate socket server
            wss.clients.forEach(client => client.close());
            wss.close(); 
        });

        wss.on('listening', () => log.info(`{:emph:hot-reload} is enabled ({:emph:using port #${port}})`));
        wss.on('error', err => log.warn(`websocket error: {:emph:${err}}`));
    
        return sock = { close, send, port };
    }

    return sock;
}
