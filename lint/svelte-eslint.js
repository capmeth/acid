import path from 'node:path';
import svelte from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
import globals from './globals.js'


export default
{
    name: 'ACID Svelte Linter',
    // eslint does not have support for absolute paths
    files: [ path.join('source', 'client', '**', '*.svt') ],

    plugins: { svelte },

    languageOptions: 
    {
        parser: svelteParser,
        parserOptions: { extraFileExtensions: [ '.svt' ] },
        globals
    }, 

    rules:
    {
        'svelte/button-has-type': [ 'warn' ],
        'svelte/html-closing-bracket-new-line': [ 'warn' ],
        'svelte/html-closing-bracket-spacing': [ 'warn' ],
        'svelte/html-quotes': [ 'warn', { prefer:'double' } ],
        'svelte/html-self-closing': [ 'warn', 'default' ],
        'svelte/infinite-reactive-loop': [ 'warn' ],
        'svelte/no-add-event-listener': [ 'warn' ],
        'svelte/no-at-debug-tags': [ 'error' ],
        'svelte/no-at-html-tags': [ 'off' ],
        'svelte/no-dom-manipulating': [ 'warn' ],
        'svelte/no-dupe-else-if-blocks': [ 'error' ],
        'svelte/no-dupe-on-directives': [ 'error' ],
        'svelte/no-dupe-style-properties': [ 'error' ],
        'svelte/no-dupe-use-directives': [ 'error' ],
        'svelte/no-extra-reactive-curlies': [ 'error' ],
        'svelte/no-immutable-reactive-statements': [ 'warn' ],
        'svelte/no-inline-styles': [ 'off', { allowTransitions: true } ],
        'svelte/no-inner-declarations': [ 'off' ],
        'svelte/no-inspect': [ 'warn' ],
        'svelte/no-not-function-handler': [ 'warn' ],
        'svelte/no-object-in-text-mustaches': [ 'warn' ],
        'svelte/no-raw-special-elements': [ 'error' ],
        'svelte/no-reactive-functions': [ 'error' ],
        'svelte/no-reactive-literals': [ 'error' ],
        'svelte/no-reactive-reassign': [ 'error', { props: true } ],
        'svelte/no-restricted-html-elements': [ 'off' ],
        'svelte/no-shorthand-style-property-overrides': [ 'warn' ],
        'svelte/no-spaces-around-equal-signs-in-attribute': [ 'error' ],
        'svelte/no-store-async': [ 'error' ],
        'svelte/no-svelte-internal': [ 'error' ],
        'svelte/no-target-blank': [ 'error', { allowReferrer: false, enforceDynamicLinks: "always" } ],
        'svelte/no-top-level-browser-globals': [ 'warn' ],
        'svelte/no-trailing-spaces': [ 'off' ],
        'svelte/no-unknown-style-directive-property': [ 'warn' ],
        'svelte/no-unnecessary-state-wrap': [ 'error' ],
        'svelte/no-unused-class-name': [ 'off' ], // CSS is assigned during build
        'svelte/no-unused-props': [ 'warn' ],
        'svelte/no-unused-svelte-ignore': [ 'warn' ],
        'svelte/no-useless-children-snippet': [ 'error' ],
        'svelte/no-useless-mustaches': [ 'error' ],
        'svelte/prefer-class-directive': [ 'warn', { prefer: 'empty' } ],
        'svelte/prefer-style-directive': [ 'warn' ],
        'svelte/prefer-writable-derived': [ 'warn' ],
        'svelte/require-each-key': [ 'warn' ],
        'svelte/require-event-dispatcher-types': [ 'off' ], 
        'svelte/require-event-prefix': [ 'warn', { checkAsyncFunctions: false } ],
        'svelte/require-optimized-style-attribute': [ 'warn' ],
        'svelte/shorthand-attribute': [ 'warn', { prefer: 'always' } ],
        'svelte/shorthand-directive': [ 'warn', { prefer: 'always' } ],
        'svelte/sort-attributes': [ 'off' ],
        'svelte/spaced-html-comment': [ 'off', 'always' ],
        'svelte/valid-each-key': [ 'warn' ],
        'svelte/valid-style-parse': [ 'error' ],
    }
}
