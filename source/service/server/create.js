import fs from 'node:fs';
import { createServer } from "node:http"
import path from "node:path"
import mtype from './mime-types.js'


export default function({ output, routing })
{
    let hash = routing === 'hash';
    let homefile = path.join(output.dir, `${output.name}.html`);
    let mimetype = file => mtype[path.extname(file).slice(1).toLowerCase()]

    let presponse = url => 
    {
        if (url === '/') url += `${output.name}.html`;
        
        let file = path.join(output.dir, url);
        let exists = fs.existsSync(file);

        if (hash && !exists) return [ 404, 'html' ];

        if (!exists) file = homefile;
        return [ 200, mimetype(file), fs.createReadStream(file) ];
    };


    return createServer((req, res) => 
    {
        let [ statusCode, mimeType, stream ] = presponse(req.url);

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
