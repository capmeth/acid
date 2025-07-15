import { is } from '#utils'


let spaceRe = /\s+/
/**
    Generates the docsite html page.

    @param { object } config
      - `title`: for html title tag
      - `metas`: html header meta tags
      - `links`: html header link tags
      - `scripts`: html header scripts
      - `importMap`: html import specifiers
    @return { string }
      Complete HTML file content.
*/
export default function(config)
{
    let { importMap, links, metas, output, scripts, title } = config;
    let lines = [];

    lines.push(`<!DOCTYPE html>`);
    lines.push(`<html lang="en">`);
    lines.push(`<head>`);
    
    if (title) lines.push(`  <title>${title}</title>`);    

    if (metas.length) toMetas(metas, lines);
    if (links.length) toLinks(links, lines);

    if (Object.keys(importMap).length)
    {
        let { imports, scopes, integrity, ...others } = importMap;
        // convenience to allow imports at top level
        importMap = { imports: { ...others, ...imports }, scopes, integrity };
        // import maps and shims must be loaded before other scripts
        lines.push(`  <script src="https://ga.jspm.io/npm:es-module-shims@2.6.0/dist/es-module-shims.js" async></script>`);
        lines.push(`  <script type="importmap">${JSON.stringify(importMap, null, 4)}</script>`);
    } 

    if (scripts.length) toScripts(scripts, lines);

    lines.push(`  <script type="module">`);
    lines.push(`  let url = new URL("${output.name}-docsite.js", new URL(import.meta.url).origin);`);
    lines.push(`  import(url).then(site => site.default());`)
    lines.push(`  </script>`);

    lines.push(`</head>`);
    lines.push(`<body></body>`);
    lines.push(`</html>`);

    return lines.join('\n');
}

let toMetas = (list, lines) => list.forEach(item => lines.push(`  <meta ${toAttrs(item)} />`))
let toLinks = (list, lines) => list.forEach(item => lines.push(`  <link ${toAttrs(item)} />`))

let toScripts = (list, lines) =>
{
    list.forEach(item => 
    {
        let { src, content, ...rest } = item;
        // assume an inline script if src has whitespace
        if (spaceRe.test(src)) (content = src, src = null);
        
        lines.push(`  <script ${toAttrs({ ...rest, src })}>${content ?? ''}</script>`);
    });
}

let toAttrs = object => 
{
    let reducer = (string, key) => 
    {
        let value = object[key];
        if (is.bool(value)) return value ? `${string} ${key}` : string;
        if (is(value)) return `${string} ${key}="${value}"`;
        return string;
    }

    return Object.keys(object).reduce(reducer, '');
}
