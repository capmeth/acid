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

    log.info(`{:emph:hot-reload} is enabled`);

    if (sock.port !== port)
    {
        sock.close();

        let wss = new WebSocketServer({ port });
        let send = msg => wss.clients.forEach(cli => cli.send(msg));
        let close = async () => (sock = voidSock, new Promise(accept => wss.close(accept)))
    
        return sock = { close, send, port };
    }

    return sock;
}
