import { kebabCase } from 'change-case'
import is from './is.js'



/**
    Converts an object stylesheet to a CSS string.

    @param { object } styles
      The style object to be converted.
    @return { string }
      A CSS stylesheet.
*/
let jsToCss = styles =>
{
    let sheet = '';

    let reducer = (string, key) =>
    {
        let value = styles[key];

        if (is(value)) 
        {
            let isRuleset = is.nonao(value);
            let keys = toSels(key, isRuleset);

            if (isRuleset)
            {
                value = ` { ${jsToCss(value)} }\n`;
                return string + keys.join(', ') + value;
            }
            else 
            {
                let map = key => key + `${key.startsWith('@') ? '' : ':'} ${value};\n`
                return string + keys.map(map).join('');
            }
        }

        return string;
    }

    return Object.keys(styles).reduce(reducer, sheet);
}

let attrRe = /^[a-z0-9_-]+$/i;
let commaRe = /\s*,\s*/;
let startRe = /^--|__/;

let toSels = (str, isRuleset) =>
{
    return str.split(commaRe).map(prop => 
    {
        if (attrRe.test(prop))
        {
            let kebab = kebabCase(prop);
            // because kebabing removes leading dashes (for CSS vars)
            if (startRe.test(prop) && !kebab.startsWith('--')) kebab = `--${kebab}`;

            prop = kebab;
        }
        
        if (isRuleset)
            prop = prop.replaceAll(':nrb', ':not(.renbox *)');
        
        return prop;
    });
}

export default jsToCss
