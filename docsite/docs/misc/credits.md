
There's some truly awesome stuff out there in the Javascript world, and I am especially thankful to the authors and contributors of the apps & tools listed here in this document for their contributions to the Javascript playground we all know and love!

# Technology Stack

Here are some details about the tech used in the ACID application.


## [commander](https://www.npmjs.com/package/commander)

Commander is a command-line interface (CLI) generator.

The `acid` CLI tool is made with Commander.


## [glob](https://www.npmjs.com/package/glob)

Glob is a string pattern filename matcher.

All of the multi-file configuration settings use Glob for enhanced file selection. 


## [highlightjs](https://highlightjs.org)

HighlightJs is a syntax highlighter for the web.

Code highlighting in docsite code blocks is managed by HighlightJs.


## [js-yaml](https://www.npmjs.com/package/js-yaml)

An excellent YAML parser.

JsYaml parses markdown front-matter and makes *.yaml* config files possible.


## [rollup](https://rollupjs.org)

Rollup is an amazing web-bundling platform.

Rollup is used in several ways, but mainly to assemble docsite assets into a functioning website.


## [svelte](https://svelte.dev)

Svelte is a learning curve agnostic (mostly) UI component platform for building web applications.

Generated docsites are built on the Svelte platform.


## [takedown](https://www.npmjs.com/package/takedown)

Takedown is a customizable CommonMark-compliant markdown parser.

Markdown files and code comment descriptions are processed through Takedown.


# Development Stack

A few more acknowledgements for tools working behind the scenes that helped to bring ACID to life!


## [ava](https://www.npmjs.com/package/ava)

AVA is a minimimal, easy-to-setup test runner.

AVA handles the unit testing for the ACID platform.


## [eslint](https://eslint.org)

The well known linter that helps keep code clean and relevant.

ESLint keeps tabs on potential problems in ACID code.


## [node](http://nodejs.org)

Node is the ubiquitous Javascript development platform.

Node provides the foundation for building and developing the ACID application.


## [npm](http://www.npmjs.com)

The champion Javascript package manager, Nervous Purple Monkeys. :laugh:

NPM is used for managing dependencies and general project management.


## [sinon](https://sinonjs.org)

Sinon is a great tool stubbing functions and spying on them.

Sinon handles some of the more complicated aspects of unit testing.
