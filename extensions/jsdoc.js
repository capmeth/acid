import fs from 'node:fs/promises'
import { is } from '#utils'


/*
    JsDoc-only parser plugin.
*/
export default function ()
{
    // captures JsDoc comments in Js and HTML form.
    let commentRe = /(?<=^|\n)\s*\/\*\*[^*].*?\*\/|<!--\*.+?-->\s*(?=\n|$)/gs;

    return async (file, data, docson) =>
    {
        let source = await fs.readFile(file, { encoding: 'utf8' });
        let result, parsed = [];
        
        // parse all comments in source
        while (result = commentRe.exec(source)) parsed.push(docson(result[0]));

        // find the component related comment
        let mainComment = 
            parsed.find(item => item.kind === 'component') ||
            parsed.find(item => !item.kind);
        
        // abort here if there is no component comment
        if (!mainComment) return;

        parsed.splice(parsed.indexOf(mainComment), 1);
        // update the data proxy
        data.self = mainComment;

        // look for props
        for (let item of parsed)
        {
            if (is.string(item.name) && item.name !== '' && item.kind === 'prop')
                data.prop = item;            
        }
    }
}
