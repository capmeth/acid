import { is } from '#utils'


let spaceRe = /\s+/
let repRe = /\{([a-z]+)\}/gi;
let repFn = data => (m, n) => data[n] || m

let hljsCdn =
{
    // UNPKG https://unpkg.com/:package@:version/:file
    source: 'https://unpkg.com/@highlightjs/cdn-assets@{version}/highlight.min.js',
    theme: 'https://unpkg.com/@highlightjs/cdn-assets@{version}/styles/{theme}.min.css',
    lang: 'https://unpkg.com/@highlightjs/cdn-assets@{version}/languages/{lang}.min.js'
}

/**
    Generates the docsite html page.

    @param { object } config
      - `title` (string): for html title tag
      - `metas` (array[object]): html header meta tags
      - `links` (array[object]): html header link tags
      - `scripts` (array[object]): html header scripts
    @return { string }
      Complete HTML file content.
*/
export default function(config)
{
    let { hljs, importMap, links, metas, scripts, title } = config;

    // make copies of head content arrays before adding
    links = [ ...(links || []) ];
    metas = [ ...(metas || []) ];
    scripts = [ ...(scripts || []) ];

    metas.push({ name: 'generator', content: 'ACID' });
    if (hljs.theme) 
    {
        let { theme, version } = hljs, vars = { theme, version };
        links.unshift({ href: hljsCdn.theme.replace(repRe, repFn(vars)), rel: 'stylesheet' });
        hljs.languages.forEach(lang => scripts.unshift({ src: hljsCdn.lang.replace(repRe, repFn({ ...vars, lang })) }))
        scripts.unshift({ src: hljsCdn.source.replace(repRe, repFn(vars)) });
    }
    if (is.nonao.notEmpty(importMap))
    {
        let { imports, scopes, integrity, ...others } = importMap;
        // convenience to allow imports at top level
        importMap = { imports: { ...others, ...imports }, scopes, integrity };
        // import maps and shims must be loaded before other scripts
        scripts.unshift({ src: JSON.stringify(importMap, null, 4), type: 'importmap' });
        scripts.unshift({ src: 'https://ga.jspm.io/npm:es-module-shims@2.6.0/dist/es-module-shims.js', async: true });
    } 
    scripts.push({ src: `import("./acid-docsite.js").then(site => site.default())`, defer: true });

    let lines = [];

    lines.push(`<!DOCTYPE html>`);
    lines.push(`<html lang="en">`);
    lines.push(`<head>`);
    
    if (title) lines.push(`  <title>${title}</title>`);    

    if (metas.length) toMetas(metas, lines);
    if (links.length) toLinks(links, lines);    
    if (scripts.length) toScripts(scripts, lines);

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
        if(is.bool(value)) return value ? `${string} ${key}` : string;
        if (is(value)) return `${string} ${key}="${value}"`;
        return string;
    }

    return Object.keys(object).reduce(reducer, '');
}
