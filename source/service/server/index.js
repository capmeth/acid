import create from './create.js'


export default function(config)
{
    let { server: { enabled, port }, title } = config;
    let server = create(config);

    let onError = fn => server.on('error', fn)

    let start = async () => 
    {
        if (!enabled) return;

        return new Promise(accept => server.listen(port, accept)).then(() => 
        {
            showbanner();
            
            let theTitle = title ? `{:greenBright:${title}}` : `{:blueBright:Untitled}`;
            let thePort = `{:whiteBright:${port}}`;

            log(`the ${theTitle} docsite server is now listening on port ${thePort}.\n`);
        });
    }

    let close = callback =>
    {
        if (server.listening)
        {
            server.close(callback)
            server.closeAllConnections(); // ensure server close
        }

        callback();
    }

    let stop = async () => new Promise(close).then(() => log.info('the http server has stopped'))

    let serving = () => server.listening
        
    return { onError, serving, start, stop };
}

let showbanner = () =>
{
    log(
    `
     ::::::::::    ::::::::::   ::::::::::::  :::::::::::  
    :::      :::  :::      :::      ::::      :::      ::: 
    ::::::::::::  :::               ::::      :::      ::: 
    :::      :::  :::      :::      ::::      :::      ::: 
    :::      :::   ::::::::::   ::::::::::::  :::::::::::  
    `);
}
