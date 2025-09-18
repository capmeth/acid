import path from 'node:path'
import sections from './sections.js'


/**
    ACID configuration for documenting the ACID application.

    How meta is that!
*/
export default
{
    namespace: "acidoc",
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

    labels: 
    { 
        label_content: 'Documentation'
    },

    sections,

    tagLegend: 
    {
        "cobe": "Is part of the CoBE component family",
        "conditional": "Does not render output when certain condition(s) fail",
        "custom": "Is a replaceable component ({info})",
        "delegate": "Passes content snippet to `use` snippet prop",
        "extra-props": "Passes unused props to <{info}>",
        "inject": "Injects {info} CSS from theme files",
        "uses": "Uses replaceable UI component ({info})"
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
