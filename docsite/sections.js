
export default
{
    root:
    {
        overview: 'file:/docsite/docs/index.md',
        sections: 
        [ 
            'start', 
            'learn',
            'tutorials',
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

    learn:
    {
        overview: 'Understand the basics of creating a docsite for your project.',
        documents:
        [
            'docsite/docs/docsite/structure.md',
            'docsite/docs/docsite/styling.md',
            'docsite/docs/docsite/tagging.md',
            'docsite/docs/docsite/authoring.md'
        ]
    },

    tutorials:
    {
        title: 'How-tos',
        overview: 'Guides to help with common setup scenarios',
        documents: 
        [
            'docsite/docs/tutorials/basic-setup.md',
            'docsite/docs/tutorials/cobe-code-injection.md'
        ]
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
            'docsite/docs/integration/components.md'
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
