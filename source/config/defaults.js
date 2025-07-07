import fs from 'node:fs'
import path from 'node:path'
import jsyaml from 'js-yaml'
import { hackson } from '#node/hosted.js'
import paths from '#paths'


/*
    Default Config Options
    ---------------------------------------------------------------------------
*/
let config = {};


/**
    Included asset groups.

    @type { array }
*/
config.assetGroups = [ 'documents', 'components' ];

/**
    Default CoBE configuration.
*/
config.cobe =
{ 
    noHide: false,
    noHighlight: false
};

/**
    CoBE language-type handling specs.

    @type { array }
*/
config.cobeSpecs = [];

/**
    HighlightJs configuration.

    @type { object }
*/
config.hljs =
{
    theme: 'a11y-light',
    version: '11.11.1'
}

/**
    Turn on the HTTP server?

    @type { boolean }
*/
config.httpServer = false;

/**
    Port from which to run doc server.

    @type { integer }
*/
config.httpServerPort = 3010;

/**
    The browser import map.

    @type { object }
*/
config.importMap = {};

/**
    Labels for various elements in the docsite.

    @type { object }
*/
config.labels = jsyaml.load(fs.readFileSync(path.join(paths.config, 'labels.yaml'), 'utf8'));

/**
    Array of HTML link strings or objects for the docsite.

    These are transformed into <link> tags for the html header.

    A string is assumed to be a stylesheet url and will be added as the 
    `href` for the tag.  Also, `rel="stylesheet"` will be added.

    default: `[]`

    @type { array }
*/
config.links = [];

/** 
    Logging control.

    default: `{}`

    @merges
    @type { object }
*/
config.logger =
{
    level: 'info',
    default: null,
    test: console.debug,
    info: console.info,
    warn: console.warn,
    fail: console.error,
    noChalk: false
};

/**
    Array of HTML metatag objects for the docsite.

    The default set of meta tags includes a charset of 'utf8', as well as
    author, description, and keywords from package.json.

    Setting this overrides (not merges with) the default value.

    @type { array }
*/
config.metas = 
[
    { charset: 'utf-8' },
    { name: 'author', content: hackson.author || 'unknown' },
    { name: 'description', content: hackson.description || 'ACID generated docsite.' },
    { name: 'keywords', content: hackson.keywords || 'components, documentation' }
];

/**
    Internal value used to prevent potential naming collisions.

    @ignore
    @type { string }
*/
config.namespace = 'acid';

/**
    Details for generated output.

    - `dir`: folder where all generated files go
    - `name`: name/prefix for bundle output file(s)

    @type { object }
*/
config.output = 
{
    dir: 'docs',
    name: hackson.name
};

/** 
    Source file parsing specs.

    @type { array }
*/
config.parsers =
[
    { exts: '.jsx', use: './extensions/ext-jsdoc' }
];

/** 
    Root path for the project.

    @type { string }
*/
config.root = process.cwd();

/** 
    Top of the hierarchy tree for `sections`.

    @type { string }
*/
config.rootSection = 'root';

/**
    Array of HTML script strings or objects for the docsite.

    A string is assumed to be a url will be added as `src` attribute.

    @type { array }
*/
config.scripts = [];

/**
    Defined navigation sections.

    @type { object }
*/
config.sections = 
{
    root:
    {
        title: 'Overview',
        overview: 'file:/readme.md',
        sections: [ 'components' ]
    },
    components:
    {
        title: 'Components',
        components: 
        { 
            include: path.join('**', '*.jsx'), 
            exclude: path.join('node_modules', '**')
        }
    }
};

/**
    For socket communication with browser.

    @type { integer }
*/
config.socket = 
{
    port: 3014,
    recoAttempts: 30,
    recoAttemptDelay: 1000
};

/**
    Storage setting for docsite user state.

    Must be one of "local", "session", or "none".

    @type { string }
*/
config.storage = 'local';

/**
    Docsite styling.

    @type { object }
*/
config.style = '#grayscape';

/** 
    Descriptions for tag `name`'s used by the components.

    Tags can be added to a component via a `@tags` tag in the component's 
    comments.

    @type { object }
*/
config.tagLegend = {};

/** 
    Name of the component library/project.

    @type { string }
*/
config.title = hackson.title;

/**
    Depth level for table of contents menu.
*/
config.tocDepth = 3;

/**
    Resolves the path to an example markdown file.

    When a component source file does not specify an `@example` file, this
    method will be called with the component source path (relative to 
    `root`) and should return the relative path to an example file if 
    available.

    By default, this function looks for a markdown (.md) file in the same 
    folder with the same name as the source file.

    @type { function }
*/
config.toExampleFile = [ [ '^(.+)\\.[^./]+$' ], '$1.md' ];

/** 
    Use only source filenames as component names?

    Forces ACID to ignore component names derived from source code 
    provided by the platform plugin.

    @type { boolean }
*/
config.useFilenameOnly = false;

/** 
    Current version of the component library/project.

    @type { string }
*/
config.version = `ver. ${hackson.version}`;

/** 
    Manages hot-reload for source/document changes.

    Note that files appearing in `sections` are not automatidally watched.

    - `on` (boolean): Turn on the watcher?
    - `delay` (number): debounce milliseconds before rebuilding content
    - `files.exclude` (string|array): path globs for files to exclude
    - `files.include` (string|array): path globs for files to include

    @type { object }
*/
config.watch =
{
    enabled: false,
    delay: 200,
    files:
    {
        include: path.join('**', '*.{js,jsx,md}'),
        exclude: path.join('node_modules', '**')
    }
}

export default config;
