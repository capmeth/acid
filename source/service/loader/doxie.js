import { is } from '#utils'
import { tdComment } from './takedown.js'
import docson from './docson.js'


/*
    Returns a Proxy for building a component data file.
*/
let makeDoxie = notComp =>
{
    // proxy must remain free of helper methods
    // asset data properties only!
    let doxie = new Proxy({}, 
    {
        get(target, prop)
        {
            if (notComp) return target[prop];
            // protect array properties from direct access
            if (is.array(target[prop])) return [ ...target[prop] ];

            return target[prop];
        },

        set(target, prop, value)
        {
            switch (prop)
            {
                case 'comment':
                    docson(value, doxie);
                    break;

                case 'description': 
                    if (value) target[prop] = tdComment.parse(value).doc;
                    break;

                case 'self':
                    Object.keys(value).forEach(key => doxie[key] = value[key]);
                    break;

                case 'props':
                case 'tags':
                    if (!notComp && !is.array(value)) 
                        throw Error(`Asset proxy property '${prop}' must be an array.`);
                    // deliberate fallthrough here

                case 'prop':
                case 'tag':
                    if (notComp) throw Error(`An asset sub-proxy cannot have '${prop}' elements.`);
                    // deliberate fallthrough here

                case 'sees':
                    apply[prop](target, value);
                    break;

                default:
                    // do not set or update with `undefined`
                    if (!is.undef(value)) target[prop] = value;
            }

            return true;
        }
    });

    return doxie;
}

let tagCheckRe = /^([a-z0-9-]+)(?::([^\s]+))?$/;

let apply =
{
    prop: (target, value) => 
    {
        target.props ||= [];

        let doxie = makeDoxie(true);
        Object.keys(value).forEach(key => doxie[key] = value[key]);
        
        target.props.push(doxie);
    },

    props: (target, value) => 
    {
        target.props = [];
        value.forEach(val => apply.prop(target, val));
    },

    see: (target, value) =>
    {
        target.sees ||= [];
        if (is.nonao(value)) target.sees.push(value);
    },

    sees: (target, value) => 
    {
        target.sees = [];
        value.forEach(val => apply.see(target, val));
    },

    tag: (target, value) =>
    {
        target.tags ||= [];
        // tag must be well formed
        if (!tagCheckRe.test(value)) return;
        // tag must not already be included
        if (target.tags.includes(value)) return;
            
        target.tags.push(value);
    },

    tags: (target, value) => 
    {
        target.tags = [];
        value.forEach(val => apply.tag(target, val));
    }
}

export default makeDoxie
