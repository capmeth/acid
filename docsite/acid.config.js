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

    output: "web",
    cobe: 
    [
        { types: [ "svelte", "svt" ], use: "svelte-render", mode: "edit" }
    ],
    hljs: 
    { 
        aliases: { jsx: [ 'svelte', 'svt'] }
    },

    sections,

    tagLegend: 
    {
        "extra-props": "Unused props are passed to <{info}>.",
        "group": "Belongs to {info} component group.",
        "no-style": "This component is not themable.",
        "region": "Region aware."
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

    style: [ '#grayscape', 'file:/docsite/acid.style.css' ]
}
