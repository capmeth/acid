
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
            'comps_core', 
            'comps_shared', 
            'comps_custom', 
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
        title: 'Content Authoring Notes',
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
        title: 'Tagging',
        overview: 'file:/docsite/docs/docsite/tagging.md'
    },

    reference:
    {
        title: 'Quick Reference',
        overview: 'file:/docsite/docs/reference/index.md',
        documents:
        [
            'docsite/docs/reference/js-api.md',
            'docsite/docs/reference/options.md',
            'docsite/docs/reference/markdown.md',
            'docsite/docs/reference/jsdoc.md',
            'docsite/docs/reference/acid-cli.md'
        ]
    },

    credits:
    {
        title: 'Tech Credit',
        overview: 'file:/docsite/docs/misc/credits.md'
    },

    integrate:
    {
        title: 'Integration',
        overview: 'file:/docsite/docs/integration/index.md',
        documents:
        [
            'docsite/docs/integration/parsers.md',
            'docsite/docs/integration/renderers.md',
            'docsite/docs/integration/components.md',
        ]
    },

    comps_core:
    {
        title: 'Core Components',
        overview: 'file:/docsite/docs/components/core/index.md',
        components: 'source/client/components/core/**/*.svt'
    },

    comps_custom:
    {
        title: 'Custom Components',
        overview: 'file:/docsite/docs/components/custom/index.md',
        components: 'source/client/components/custom/**/*.svt'
    },

    comps_shared:
    {
        title: 'Shared Components',
        overview: 'file:/docsite/docs/components/shared/index.md',
        components: 'source/client/components/shared/**/*.svt'
    }
}
