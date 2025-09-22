
export default
{
    root:
    {
        overview: 'file:/docsite/docs/index.md',
        sections: 
        [ 
            'start', 
            'structure',
            'styling',
            'tagging',
            'authoring',
            'reference', 
            'integrate', 
            'faqs',
            'credits' 
        ]
    },

    start:
    {
        title: 'Getting Started',
        overview: 'file:/docsite/docs/getting-started.md'
    },

    authoring:
    {
        title: 'Markdown Documents',
        overview: 'file:/docsite/docs/docsite/authoring.md'
    },

    structure:
    {
        title: 'Site Structure',
        overview: 'file:/docsite/docs/docsite/structure.md'
    },

    styling:
    {
        title: 'Styling',
        overview: 'file:/docsite/docs/docsite/styling.md'
    },

    tagging:
    {
        title: 'Asset Tagging',
        overview: 'file:/docsite/docs/docsite/tagging.md'
    },

    reference:
    {
        title: 'Quick Reference',
        overview: 'file:/docsite/docs/reference/index.md',
        documents:
        [
            'docsite/docs/reference/options.md',
            'docsite/docs/reference/jsdoc.md',
            'docsite/docs/reference/markdown.md',
            'docsite/docs/reference/acid-cli.md',
            'docsite/docs/reference/js-api.md',
            'docsite/docs/reference/component-api.md'
        ]
    },

    credits:
    {
        title: 'Tech Credit',
        overview: 'file:/docsite/docs/misc/credits.md'
    },

    faqs:
    {
        title: 'FAQs',
        overview: 'file:/docsite/docs/misc/faqs.md'
    },

    integrate:
    {
        title: 'Integration',
        overview: 'file:/docsite/docs/integration/index.md',
        documents:
        [
            'docsite/docs/integration/parsers.md',
            'docsite/docs/integration/renderers.md',
        ],
        sections: 
        [ 
            'comps_stable', 
            'comps_custom'
        ]
    },

    comps_custom:
    {
        title: 'Custom Components',
        overview: 'file:/docsite/docs/components/custom/index.md',
        cobe: { types: 'svelte', mode: 'static' },
        components: 'source/client/components/custom/**/*.svt'
    },

    comps_stable:
    {
        title: 'Stable Components',
        overview: 'file:/docsite/docs/components/stable/index.md',
        cobe: { types: 'svelte', mode: 'static' },
        components: 'source/client/components/stable/**/*.svt'
    }
}
