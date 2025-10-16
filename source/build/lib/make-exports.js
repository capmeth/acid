import path from 'node:path'


export default function(names)
{
    let list = names.map(name => 
    {
        let alias = path.basename(name, path.extname(name));
        let file = `export { default as ${alias} } from '${name}'`;

        return file;
    });
    
    return list.join('\n');
}
