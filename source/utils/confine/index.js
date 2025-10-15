import { AcidROOperationError, AcidValidateError } from '#source/errors.js'
import is from '../is.js'
import of from '../of.js'
import helpers from './helpers.js'


/**
    Constructs a restricted object.

    Use `assign` to intercept values being set on the controlled object.
    It does not provide control with array mutator operations (push, 
    splice, unshift, etc.).

    If `apply` throws, no value was assigned.

    @param { object } prints
      Blueprints for the restricted object.
    @param { funcion } assign
      Makes final assessment of the value to be assigned.
*/
export default function (prints, assign)
{
    assign ||= ({ apply, spec, value, verify }) => apply(verify(spec, value))
    // assign ||= (apply, value) => apply(value)

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
        let id = (path, name, value) => 
        {
            if (at)
            {
                name = `${at.name}.${name}`;
                path = `${at.path}.${path}`;
            }

            if (!is.undef(value))
            {
                // new path based on specific type of value
                let testpath = `${path}<${of(value)}>`;
                if (prints[testpath]) path = testpath;
            }            

            return { name, path };
        }

        let propSpec = (target, prop, value) =>
        {
            let toSpec = at => 
            {
                let value = prints[at.path];
                
                let spec = { at, target, prop };
                
                if (is.func(value)) spec.test = value;
                if (is.plain(value)) spec = { ...value, ...spec };
                if (is.string(value)) spec = toSpec({ ...at, path: value });
                
                return spec;
            }

            let at = id(prop, prop, value);
            return prints[at.path] ? toSpec(at) : toSpec(id('*', prop, value));
        }

        let verifyItems = (target, values, start = 0) => 
        {
            let reducer = (array, value, index) =>
            {
                let spec = propSpec(target, start + index, value);
                let apply = value => array.push(value);

                assign({ apply, spec, value, verify });
                return array;
            }

            return values.reduce(reducer, []);
        }

        return new Proxy(object, 
        {
            get(target, prop)
            {
                // don't mess with symbols
                if (is.symbol(prop)) return target[prop];
                // validate elements added to arrays
                if (is.array(target))
                {
                    switch (prop)
                    {
                        case 'copyWithin':
                        case 'fill':
                        case 'pop':
                        case 'reverse':
                        case 'shift':
                        case 'sort':
                            return () => { throw new AcidROOperationError(prop); }
                        case 'push':
                            return (...args) => target.push(...verifyItems(target, args, target.length))
                        case 'splice':
                            return (s, d, ...args) => target.splice(s, d, ...verifyItems(target, args, s))
                        case 'unshift':
                            return (...args) => target.unshift(...verifyItems(target, args, 0))
                    }
                }

                if (is.undef(target[prop]))
                {
                    let spec = propSpec(target, prop);

                    if (!is.undef(spec.default)) 
                        target[prop] = verify(spec, spec.default);
                }

                return target[prop];
            },

            set(target, prop, value)
            {
                let spec = propSpec(target, prop, value);
                let apply = value => target[prop] = value;

                assign({ apply, spec, value, verify });
                return true;
            }
        });
    }

    let verify = ({ at, immutable, merge, prop, target, test }, value) =>
    {
        let result = null;

        if (immutable === true && !is.undef(target[prop]))
            result = new AcidValidateError('value cannot be changed', at.name);
        else if (is.func(test))
            result = test(helpers(at.name, value));

        // throw if validation error message returned
        if (result instanceof AcidValidateError) throw result;

        let final = value = is.func(result) ? result() : value;

        if (prints[at.path])
        {
            if (is.plain(value))
            {                    
                final = (merge && target[prop]) || proxer({}, at);
                Object.keys(value).forEach(k => final[k] = value[k]);
            }                
            else if (is.array(value))
            {
                final = (merge && target[prop]) || proxer([], at);
                final.push(...value);
            }
        }

        return final;
    }

    return proxer({});
}
