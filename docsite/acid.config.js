import path from 'node:path'
import sections from './sections.js'


/**
    ACID configuration for documenting the ACID application.

    How meta is that!
*/
export default
{
    namespace: "metasite",
    title: "A Component Interface Documenter",

    copy: { files: path.join("source", "images", "acid.png"), to: 'acid.png' },

    output: "web",
    cobe: 
    [
        { types: [ "svelte", "svt" ], use: "svelte-render", mode: "edit" }
    ],
    hljs: 
    { 
        aliases: { jsx: [ "svelte", "svt"] },
        theme: 'kimbie-dark'
    },

    links: { href: "acid.png", rel: "icon", type: "image/x-icon" },

    sections,

    tagLegend: 
    {
        "cobe": "Part of the CoBE component family.",
        "conditional": "No render output when certain condition(s) fail.",
        "custom": "Replaceable component (id: {info}).",
        "delegate": "Passes content snippet to `use` snippet prop.",
        "extra-props": "Unused props are passed to <{info}>.",
        "inject": "Injects #{info} CSS from theme.",
        "uses": "Uses custom component (id: {info})."
    },

    toAssetId: [ [ "^(?:source[/]client[/]components|docsite[/]docs)[/](.+?)[.][^./]+$" ], "$1" ],
    toExampleFile: [ [ "^source[/]client[/](.+?)[.][^./]+$" ], "docsite/docs/$1.md" ],

    importMap: 
    { 
        "#bundle": "./site-bundle.js"
    },

    server: { port: 3005 },
    socket: { port: 3009 },
    watch: 
    { 
        files: 
        [
            path.join("source", "client", "components", "**", "*.svt"),
            path.join("source", "client", "**", "*.js"),
            path.join("docsite", "docs", "**", "*.md")
        ] 
    },

    style: 
    [ 
        '#acidic',
        'file:/docsite/acid.style.css' 
    ]
}
