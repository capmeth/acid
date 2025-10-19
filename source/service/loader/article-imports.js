import { pascalCase } from 'change-case'


let embedRe = /^embed\//;
/** 
    Creates import declarations for markdown documents from specific entries in
    the given importmap (`map`).

    An import declaration for CoBE is always included.

    @param { object } map
      Keys starting with `embed/` are included.
    @return { string }
      Import statements for the document.
*/
export default function (map)
{
    let imports = `import CoBEditor from '#stable/cobe/Editor'\n`;

    let reducer = (str, cid) => 
    {
        if (embedRe.test(cid) && map[cid]) 
            return str + `import ${pascalCase(cid.replace(embedRe, ''))} from '#custom/${cid}'\n`;
        
        return str;
    }

    return Object.keys(map).reduce(reducer, imports);
}
