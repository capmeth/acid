import { existsSync } from 'node:fs'
import service from '../service/index.js'


/**
    Starts the docsite generation service.

    @param { string } file
      Path to app configuration file.
    @param { object } options
      Addtional config options to apply.
*/
export default async function(file, options)
{
    if (!existsSync(file))
    {
        console.error(`File ${file} does not exist.`);
        return void 0;
    }
    
    return service(file, options).start();
}
