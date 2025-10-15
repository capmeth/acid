import controller from './controller.js'
import getLogger from '../logging/index.js'


/**
    Common application entry point for programmatic and cli access.

    Configuration `options` can be passed as
    - a configuration object
    - or a pathname to a configuration file.

    If `options` is a filepath, a promise is returned.

    @param { string | object | function } options
      Configuration elements.
    @return { object }
      - `run` (func): start the app
*/
let service = (...options) => controller(options, service.root)

service.root = process.cwd();
service.logger = config => global.log = getLogger(config)
service.logger();

export default service
