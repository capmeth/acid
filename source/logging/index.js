import confine from '../utils/confine/index.js'
import definition from './definition.js'
import defaults from './defaults.js'
import logger from './logger.js'


/**
    Returns a logger based on configuration.

    @param { object } config
      Logger configuration.
    @return { Proxy }
      Controlled configuration object.
*/
export default function (config)
{
    let data = confine(definition);

    data.logger = defaults;
    if (config) data.logger = config || {};

    return logger(data.logger);
}
