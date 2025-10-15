import { confine, is } from '#utils'
import definition from './definition.js'



export default function (emport)
{
    /**
        The configurator function.

        When `spec` is
        - a string, convert to a 1-item array
        - an array, use it to import a plugin function
        - a function, pass it `data.config`
        - an object, assign it to `data.config`

        If `data.config.plugins` array exists, recursively call this function with
        each element of the array and the same `data` object.

        @param { string | array | function | object } spec
          Configuration specification.
        @param { object } data
          Configuration root object.
    */
    let configure = async (spec, data) =>
    {
        if (is.string(spec)) spec = [ spec ];

        let param;

        if (is.array(spec))
        {
            spec = await emport(spec[0]).then(mod => mod.default);
            param = spec[1];
        }

        if (is.func(spec))
            await spec(data.config, param);
        else
            data.config = spec;

        let { configs } = data.config;

        // to infinity if `configs` is not deleted here
        if (configs && delete data.config.configs) 
        {
            /* eslint-disable-next-line no-await-in-loop */
            for (let config of configs) await configure(config, data);
            // above, `plugins` must be applied sequentially (and therefore synchronously)
        }

        return data;
    }

    return spec => configure(spec, confine(definition));
}
