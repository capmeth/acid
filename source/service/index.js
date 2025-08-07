import fs from 'node:fs'
import parseFile from '#lib/parse-file.js'
import { is } from '#utils'
import { assign, defaults } from '../config/index.js'
import controller from './controller.js'
import getLogger from '../logging/index.js'


/**
    Common application entry point for programmatic and cli access.

    Configuration `options` can be passed as
    - a configuration object
    - or a pathname to a configuration file.

    If `options` is a filepath, a promise is returned.

    @param { string | object } options
      Configuration filename or configuration object.
    @param { object } cliopts
      Additional configuration options (usually from CLI).
    @return { object | promise }
      Is or resolves to an object with
      - `start` (func): start the app
      - `extend` (func): extend the app
*/
let service = (options, cliopts) =>
{
    let merge = data => cliopts ? assign(defaults, data, cliopts).config : data;
    let serve = config => controller(merge(config), options)
    
    if (is.string(options) && fs.existsSync(options)) 
        return parseFile(options).then(serve);

    return is.nonao(options) ? serve(options) : serve();
}

service.logger = config => global.log = getLogger(config)
service.logger();

export default service
