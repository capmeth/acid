import path from 'node:path'
import sections from './sections.js'


/**
    ACID configuration for documenting the ACID application.

    How meta is that!
*/
export default
{
    namespace: "acidoc",

    copy: { files: path.join("source", "images", "acid.png"), to: 'acid.png' },

    output: "web",
    cobe: 
    [
        { types: [ "svelte", "svt" ], use: "svelte-render", mode: "edit" }
    ],
    cobeSvelte: true,
    hljs: 
    { 
        aliases: { jsx: [ "svelte", "svt"] },
        theme: 'kimbie-dark'
    },

    links: { href: "acid.png", rel: "icon", type: "image/x-icon" },

    labels: 
    { 
        label_content: 'Docsite'
    },

    sections,

    tagLegend: 
    {
        "cid": 
        {
            desc: 'Component ID is "{info}" for import or replacement',
            assign: ({ path, tid, uid }) => tid === 'cmp' && `${uid.split('-')[1]}/${path.name}`
        },
        "cobe": "Is part of the CoBE component family",
        "conditional": "Renders nothing when certain condition(s) fail",
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

    refLinks: 'file:/docsite/acid.refs.md',

    server: { port: 3030 },
    socket: { port: 3035 },
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
