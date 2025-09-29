import pathTransformer from '#lib/path-transformer.js'
import { ident } from '#utils'


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
    Finalizes configuration settings for ACID.

    This comes after all manual and extension settings have been applied.
*/
export default config =>
{
    let { hljs, links, metas, output, parsers, scripts } = config;

    parsers.unshift({ types: '*', use: '#exts/jsdoc' });

    if (hljs.theme)
    {
        links.push(hljsCdn.theme.replace(repRe, repFn(hljs)));
        scripts.push(hljsCdn.source.replace(repRe, repFn(hljs)));
        hljs.languages.forEach(lang => scripts.push(hljsCdn.lang.replace(repRe, repFn({ ...hljs, lang }))));
    }
    
    metas.push({ name: 'generator', content: 'ACID' });

    config.toAssetId = pathTransformer(config.toAssetId) || ident;
    config.toAssetName = pathTransformer(config.toAssetName) || ident;
    config.toExampleFile = pathTransformer(config.toExampleFile) || (() => null);

    config.importMap =
    {
        "svelte": "https://esm.sh/svelte@5.34.7",
        "svelte/animate": "https://esm.sh/svelte@5.34.7/animate",
        "svelte/attachments": "https://esm.sh/svelte@5.34.7/attachments",
        "svelte/compiler": "https://esm.sh/svelte@5.34.7/compiler",
        "svelte/easing": "https://esm.sh/svelte@5.34.7/easing",
        "svelte/events": "https://esm.sh/svelte@5.34.7/events",
        "svelte/motion": "https://esm.sh/svelte@5.34.7/motion",
        "svelte/reactivity": "https://esm.sh/svelte@5.34.7/reactivity",
        "svelte/store": "https://esm.sh/svelte@5.34.7/store",
        "svelte/transition": "https://esm.sh/svelte@5.34.7/transition",

        "svelte/internal/client": "https://esm.sh/svelte@5.34.7/internal/client",
        "svelte/internal/disclose-version": "https://esm.sh/svelte@5.34.7/internal/disclose-version",
        "svelte/internal/flags/legacy": "https://esm.sh/svelte@5.34.7/internal/flags/legacy",

        "svelte-render": `./${output.name}-svelte-render.js`
    }
}
