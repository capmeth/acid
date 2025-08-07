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
    logo: 'acid.png',

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

    labels: { "page-home-title": "Homepage" },

    sections,

    tagLegend: 
    {
        "extra-props": "Unused props are passed to <{info}>.",
        "group": "Belongs to {info} component group.",
        "no-style": "This component cannot be styled.",
        "page": "Styling can be page specific.",
        "region": "Styling can be region specific."
    },

    toAssetId: [ [ "^(?:source[/]client[/]components|docsite[/]docs)[/](.+?)[.][^./]+$" ], "$1" ],
    toExampleFile: [ [ "^source[/]client[/](.+?)[.][^./]+$" ], "docsite/docs/$1.md" ],

    importMap: 
    { 
        "#bundle": "./site-bundle.js"
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

    style: [ '#acidic', 'file:/docsite/acid.style.css' ]
}
