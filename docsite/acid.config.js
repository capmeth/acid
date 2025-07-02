import path from 'node:path'
import sections from './sections.js'


/**
    ACID configuration for documenting the ACID application.

    How meta is that!
*/
export default
{
    namespace: "metasite",
    title: "Another Component Interface Documenter (ACID)",

    outputDir: "web",
    cobeSpecs: 
    [
        { types: "handlebars", use: "./extensions/ext-handlebars", mode: "edit" },
        // { types: "svelte", use: "acid-render-svelte/renderer", mode: "edit" }
    ],
    parsers: { exts: ".svt", use: "./extensions/ext-jsdoc" },
    hljs: 
    { 
        aliases: { jsx: 'htm' },
        languages: 'handlebars'
    },

    sections,

    tagLegend: 
    {
        "extra-props": "Unused props are passed to <{info}>.",
        "group": "Belongs to {info} component group.",
        "no-style": "This component is not themable.",
        "region": "Region aware."
    },

    toExampleFile: [ [ "^source[/]client[/](.+?)[.][^./]+$" ], "docsite/docs/$1.md" ],

    importMap:
    {
        "#bundle": "./acid-bundle.js",
        "svelte": "https://esm.sh/svelte@5.34.7",
        // "svelte/internal/": "https://esm.sh/svelte@5.34.7/es2022/internal/"
        "svelte/internal/client": "https://esm.sh/svelte@5.34.7/es2022/internal/client.mjs",
        "svelte/internal/disclose-version": "https://esm.sh/svelte@5.34.7/es2022/internal/disclose-version.mjs",
        "svelte/internal/flags/legacy": "https://esm.sh/svelte@5.34.7/es2022/internal/flags/legacy.mjs"
    },

    httpServerPort: 3005,
    socket: { port: 3009 },
    watch: 
    { 
        files: 
        [
            path.join("source", "client", "**", "*.{js,svt}"),
            path.join("docsite", "docs", "**", "*.md")
        ] 
    },
    logger: { level: "test" },

    style: { sheets: [ '#grayscape', 'file:/docsite/acid.style.css' ], merge: true }
}
