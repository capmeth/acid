
export default
{
    root:
    {
        overview: 'file:/docsite/docs/index.md',
        sections: 
        [ 
            'start', 
            'layout',
            'styling',
            'tagging',
            'configure', 
            'integrate', 
            'components', 
            'credits' 
        ]
    },

    start:
    {
        title: 'Getting Started',
        overview: 'file:/docsite/docs/getting-started.md'
    },

    layout:
    {
        title: 'Layout',
        overview: 'file:/docsite/docs/docsite/layout.md'
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

    configure:
    {
        title: 'Configuration',
        overview: 'file:/docsite/docs/configuration/index.md',
        documents:
        [
            'docsite/docs/configuration/options.md',
            'docsite/docs/configuration/markdown.md',
            'docsite/docs/configuration/jsdoc.md',
            'docsite/docs/configuration/acid-cli.md'
        ]
    },

    credits:
    {
        title: 'Tech Credit',
        overview: 'file:/docsite/docs/misc/credits.md'
    },

    integrate:
    {
        overview: 'file:/docsite/docs/integration/index.md',
        documents:
        [
            'docsite/docs/integration/js-api.md',
            'docsite/docs/integration/parsers.md',
            'docsite/docs/integration/renderers.md',
            'docsite/docs/integration/test.md',
        ]
    },

    components:
    {
        title: 'Components',
        overview: 'file:/docsite/docs/components/index.md',
        sections: 
        [ 
            'components_app',
            'components_page',
            'components_nav',
            'components_element',
            'components_cobe',
            'components_asset',
            'components_filter'
        ]
    },

    components_app:
    {
        title: 'App Components',
        overview: 'Components that form the core of a docsite.',
        components: 'source/client/components/app/*.svt'
    },

    components_asset:
    {
        title: 'Asset Components',
        overview: 'Components that provide asset details.',
        components: 'source/client/components/asset/*.svt'
    },

    components_cobe:
    {
        title: 'CoBE Components',
        overview: 'Components that render code blocks.',
        components: 'source/client/components/cobe/*.svt'
    },

    components_element:
    {
        title: 'Basic Components',
        overview: 'Components that do menial tasks.',
        components: 'source/client/components/element/*.svt'
    },

    components_filter:
    {
        title: 'Filtering Components',
        overview: 'Components for filtering asset lists.',
        components: 'source/client/components/filter/*.svt'
    },

    components_nav:
    {
        title: 'Navigation Components',
        overview: 'Components that let you move about the site.',
        components: 'source/client/components/nav/*.svt'
    },

    components_page:
    {
        title: 'Page Components',
        overview: 'file:/docsite/docs/components/page/index-page.md',
        components: 'source/client/components/page/*.svt'
    }
}
