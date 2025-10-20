import { WebSocketServer } from 'ws'
import { jss, uid } from '#utils';


/*
    Creates a WebSocketServer using configured port.
*/
export default function socketer(config)
{
    let { server, socket: { port }, watch } = config;

    // no web socket needed if http server and watch disabled
    let enabled = server.enabled && watch.enabled;
    // used to identify the current app build
    let buildId = uid.hex(performance.now());

    let wss;

    let start = async () =>
    {
        if (enabled && wss?.options.port !== port)
        {
            await close();

            return new Promise(accept => 
            {
                wss = new WebSocketServer({ port });
                wss.on('connection', client => 
                {
                    log.test('ws: client connection established');
                    client.send(jss({ buildId }));
                });
                wss.on('listening', () => 
                {
                    log.info(`{:emph:hot-reload} is enabled via port {:emph:${port}}`);
                    accept();
                });
                wss.on('error', err => log.warn(`ws: {:emph:${err}}`));
            });
        } 
    }

    let send = msg => 
    {
        if (wss?.clients.size)
        {
            let { clients } = wss;

            log.test(`ws: sending {:emph:${msg}} message to {:emph:${clients.size}} connected clients`);
            clients.forEach(cli => cli.send(jss({ message: msg, buildId })));
        }
    }

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
