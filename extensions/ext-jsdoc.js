import fs from 'node:fs/promises'
import { is } from '#utils'
import docson from '../source/service/loader/docson.js'
import doxie from '../source/service/loader/doxie.js'


/*
    JsDoc-only parser plugin.
*/
export default function ()
{
    // captures JsDoc comments in Js and HTML form.
    let commentRe = /(?<=^|\n)\s*\/\*\*[^*].*?\*\/|<!--\*.+?-->\s*(?=\n|$)/gs;

    return async (file, data) =>
    {
        let source = await fs.readFile(file, { encoding: 'utf8' });
        let result, parsed = [];
        
        while (result = commentRe.exec(source)) 
            parsed.push(docson(result[0], doxie()));

        // find the component related comment
        let mainComment = 
            parsed.find(item => item.kind === 'component') ||
            parsed.find(item => !item.kind);
        
        // stop here if there is no component comment
        if (!mainComment) return;

        parsed.splice(parsed.indexOf(mainComment), 1);
        // update the data proxy
        data.self = mainComment;

        // look for props
        for (let item of parsed)
        {
            if (is.string.notBlank(item.name) && item.kind === 'prop')
                data.prop = item;
        }
    }
}
