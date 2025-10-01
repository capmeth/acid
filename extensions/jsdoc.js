import fs from 'node:fs/promises'


/*
    JsDoc-only parser plugin.
*/
export default function ()
{
    // captures JsDoc comments in Js and HTML form.
    let commentRe = /(?<=^|\n)\s*\/\*\*[^*].*?\*\/|<!--\*.+?-->\s*(?=\n|$)/gs;

    return async (file, docson) =>
    {
        let source = await fs.readFile(file, { encoding: 'utf8' });
        let result, parsed = [];
        
        // parse all comments in source
        while (result = commentRe.exec(source)) parsed.push(docson(result[0]));

        // find the component related comment
        let data = 
            parsed.find(item => item.kind === 'component') ||
            parsed.find(item => !item.kind);
        
        if (data) 
            parsed.splice(parsed.indexOf(data), 1);
        else
            data = {};

        // look for props
        for (let item of parsed)
        {
            if (item.name && typeof item.name === 'string' && item.kind === 'prop')
                (data.props ||= []).push(item);
        }

        return data;
    }
}
