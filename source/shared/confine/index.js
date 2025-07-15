import AcidConfigError from '../error/AcidConfigError.js'
import is from '../is.js'
import helpers from './helpers.js'


/**
    Constructs a restricted object.

    @param { object } prints
      Blueprints for the restricted object.
    @param { object } target
      Target object.
*/
export default function (prints, target)
{
    target ||= is.array(prints) ? [] : {};

    /**
        Governs object manipulation to adhere to a set of (blue) `prints`.

        @param { object | array | function } object
          Proxy target object.
        @param { object } at
          Name and path for proxer level.
        @return { Proxy }
          Governed object.
    */
    let proxer = (object, at) =>
    {
        let id = (path, name = path) => 
        {
            if (!at) return { name, path };
            return { name: `${at.name}.${name}`, path: `${at.path}.${path}` };
        }

        let propSpec = (target, prop) =>
        {
            let toSpec = at => 
            {
                let value = prints[at.path];
                
                let spec = { at, target, prop };
                
                if (is.func(value)) spec.test = value;
                if (is.plain(value)) spec = { ...value, ...spec };
                
                return spec;
            }

            let at = id(prop);
            return prints[at.path] ? toSpec(at) : toSpec(id('*', prop));
        }

        let useDefault = spec => is.undef(spec.default) ? void 0 : verify(spec, spec.default)

        let verifyAll = (target, values, start = 0) => 
            values.map((value, index) => verify(propSpec(target, start + index), value))

        return new Proxy(object, 
        {
            get(target, prop)
            {
                // don't mess with symbols
                if (is.symbol(prop)) return target[prop];
                // validate elements added to arrays
                if (is.array(target))
                {
                    if (prop === 'push')
                        return (...args) => target.push(...verifyAll(target, args, target.length))
                    if (prop === 'unshift')
                        return (...args) => target.unshift(...verifyAll(target, args, 0))
                    if (prop === 'splice')
                        return (s, d, ...args) => target[prop](s, d, ...verifyAll(target, args, s))
                }

                if (!is.undef(target[prop])) return target[prop];

                return target[prop] = useDefault(propSpec(target, prop));
            },

            set(target, prop, value)
            {                
                target[prop] = verify(propSpec(target, prop), value);
                return true;
            }
        });
    }

    let verify = (spec, value) =>
    {
        let { at, prop, target, test } = spec;

        let result = is.func(test) ? test(helpers(at.name, value)) : null;
        // throw if validation error message returned
        if (is.string(result)) throw new AcidConfigError(result);

        let final = value = is.func(result) ? result() : value;

        if (is.plain(value))
        {                    
            final = (spec.merge && target[prop]) || proxer({}, at);
            Object.keys(value).forEach(k => final[k] = value[k]);
        }                
        else if (is.array(value))
        {
            final = (spec.merge && target[prop]) || proxer([], at);
            final.push(...value);
        }

        return final;
    }

    return proxer(target);
}
