import path from 'node:path'
import { spawn } from 'node:child_process'


let launched = false;

export default function (config)
{
    let { launchBrowser, server } = config;

    let url = `http://localhost:${server.port}`;
    launchBrowser &&= server.enabled;
    
    return async () =>
    {
        if (!launched && launchBrowser)
        {
            return new Promise(accept => 
            {
                let child = spawn(getCommand(), [ url ], { detached: true });
                launched = true;

                child.on('exit', () => 
                {
                    log.test(`default browser opened to {:emph:${url}}`);
                    accept();
                });
                child.on('error', err => 
                {
                    log.warn(`unable to launch default browser: {:emph:${err}}`);
                    accept();
                });    
            });
        }
    }
}

let getCommand = () =>
{
    switch(process.platform) 
    {
        case 'darwin': // macOS
            return `open`;
        case 'win32': // windows
            return `start`;
        default: // linux/unix
            return `xdg-open`;
    }
}
