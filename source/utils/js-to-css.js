import is from './is.js'


let commaRe = /\s*,\s*/;
let skipRe = /^(?:html|body|:root|&::?[a-z-]+)$/
let pseudoRe = /^&::?[a-z-]+$/
let noren = ':not(.renbox *)';

/**
    Converts an object stylesheet to a CSS string.

    The object is walked recursively to process each property into a CSS
    declaration or statement.

    The reach of some selectors must be limited in order to protect the CoBE 
    render boxes.  For this, a protective (limiting) pseudo-class is appended
    to them to prevent them from selecting elements within the render box.

    Given the limitations of the CSS ":not" pseudo-class, it is crucial that
    the limiting class be placed directly on every selector with CSS 
    declarations.

    To make this happen, the `limit` parameter, when set to `true`, forces a
    check in the styles declaration block for sub blocks having declarations.
    For each that does, its "key" has the limiting class appended as long as 
    the key is not a directive and is not "body", "html", or ":root"

    If `limit` is `false`, the limiting class is not applied.  However, once a
    selector starting with ":global" is encountered `limit` becomes `true` for
    that declaration block and its descendants.

    @param { object } styles
      The style object to be converted.
    @param { boolean } limit
      Start off with limiting ruleset reach?
    @return { string }
      A CSS stylesheet.
*/
export default function (styles, limit)
{
    let limitKey = (k, l) => l && !skipRe.test(k) && !k.endsWith(noren) ? k + noren : k

    let jsToCss = (styles, limit) =>
    {
        let reducer = (string, key) =>
        {
            let value = styles[key];

            if (is.nonao(value))
            {
                let limited = limit && useProtection(value);

                key.split(commaRe).forEach(k => 
                {
                    let val = `{\n${jsToCss(value, limit || k.startsWith(':global'))}}`;
                    string += `${limitKey(k, limited)}\n${val}\n`;
                });
            }
            else if (is.array(value)) // CSS directives
            {
                value.forEach(val => 
                {
                    let isObj = is.nonao(val);
                    val = isObj ? `{\n${jsToCss(val, limit)}}` : `${val};`;
                    string += `${key}${isObj ? '\n' : ' '}${val}\n`;
                });
            }
            else if (is(value))
            {
                string += `${key}: ${value};\n`;
            }

            return string;
        }

        return Object.keys(styles).reduce(reducer, '');
    }

    return jsToCss(styles, limit);
}

let useProtection = val =>
{
    let finder = key => 
    {
        // CSS declarations
        if (!is.nonao(val[key])) return true;
        // CSS pseudo classes
        if (pseudoRe.test(key)) return true;

        return false;
    }

    return Object.keys(val).findIndex(finder) >= 0;
}
