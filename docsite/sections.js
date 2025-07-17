
export default
{
    root:
    {
        overview: 'file:/docsite/docs/index.md',
        documents:
        [
            'docsite/docs/getting-started.md'
        ],
        sections: [ 'docsite', 'configure', 'integrate', 'credits' ]
    },

    docsite:
    {
        title: 'The Docsite',
        overview: 'file:/docsite/docs/docsite/index.md',
        documents:
        [
            'docsite/docs/docsite/sections.md',
            'docsite/docs/docsite/authoring.md',
            'docsite/docs/docsite/tagging.md',
            'docsite/docs/docsite/styling.md',
            'docsite/docs/docsite/api.md'
        ],
        sections: 'components'
    },

    configure:
    {
        title: 'Config Quick Reference',
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
            'components_element',
            'components_page',
            'components_asset',
            'components_cobe',
            'components_nav',
            'components_app'
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

    components_nav:
    {
        title: 'Navigation Components',
        overview: 'Components that let you move about the site.',
        components: 'source/client/components/nav/*.svt'
    },

    components_page:
    {
        title: 'Page Components',
        overview: 'file:/source/client/components/page/index-page.md',
        components: 'source/client/components/page/*.svt'
    }
}
