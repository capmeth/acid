import fs from 'node:fs';
import { createServer } from "node:http"
import path from "node:path"
import mtype from './mime-types.js'


export default function({ output })
{
    let presponse = url => 
    {
        if (url.endsWith('/')) url += `${output.name}.html`;
        let file = path.join(output.dir, url);

        let exists = fs.existsSync(file)
        let ext = path.extname(file).slice(1).toLowerCase();
        let stream = exists ? fs.createReadStream(file) : null;

        return [ exists ? 200 : 404, stream, mtype[ext] ];
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
