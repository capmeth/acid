import fs from 'node:fs';
import { createServer } from "node:http"
import path from "node:path"
import mtype from './mime-types.js'


export default function({ output })
{
    let homefile = path.join(output.dir, `${output.name}.html`);
    let mimetype = file => mtype[path.extname(file).slice(1).toLowerCase()]

    let presponse = url => 
    {
        if (url === '/') url += `${output.name}.html`;
        
        let file = path.join(output.dir, url);
        if (!fs.existsSync(file)) file = homefile;

        return [ 200, fs.createReadStream(file), mimetype(file) ];
    };


    return createServer((req, res) => 
    {
        let [ statusCode, stream, mimeType ] = presponse(req.url);

        res.writeHead(statusCode, 
        {
            'Cache-Control': 'no-cache',
            'Content-Type': mimeType
        });

        if (statusCode === 200) 
            stream.pipe(res);
        else if (statusCode === 404)
            res.end('404 Not Found');
    });
}
