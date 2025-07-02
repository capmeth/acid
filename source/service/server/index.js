import create from './create.js'


export default function(config)
{
    let { httpServer, httpServerPort, title } = config;
    let server = create(config);

    let onError = fn => server.on('error', fn)

    let start = async () => 
    {
        if (!httpServer) return;

        return new Promise(accept => server.listen(httpServerPort, accept)).then(() => 
        {
            showbanner();
            
            let theTitle = `{:greenBright:${title}}`;
            let thePort = `{:whiteBright:${httpServerPort}}`;

            log(`the ${theTitle} docsite server is now listening on port ${thePort}.\n`);
        });
    }

    let stop = async () => new Promise(accept => server.listening && server.close(accept))

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
