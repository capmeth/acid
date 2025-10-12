/**
    Module Utilities
    ---------------------------------------------------------------------------
    A module must
    - not depend on (import) any other code in the project outside of their 
      peers right here in this folder.
    - be able to work on either the server or the client (browser).
    - must not use the global `log`

    External dependencies are ok.
*/
export { default as aiter } from './aiter.js'
export { default as attrsToObject } from './attrs-to-object.js'
export { default as cacher } from './cacher.js'
export { default as confine } from './confine/index.js'
export { default as ctja } from './css-to-json-array.js'
export { default as debounce } from './debounce.js'
export { default as equals } from './equals.js'
export { default as importString } from './import-string.js'
export { default as inter } from './inter.js'
export { default as is } from './is.js'
export { default as jss } from './json-string.js'
export { default as jsToCss } from './js-to-css.js'
export { default as mapComment } from './map-comment.js'
export { default as mapExtensions } from './map-extensions.js'
export { default as modulize } from './modulize.js'
export { default as objectToAttrs } from './object-to-attrs.js'
export { default as of } from './of.js'
export { default as proxet } from './proxet.js'
export { default as remowned } from './remowned.js'
export { default as rescape } from './rescape.js'
export { default as sarf } from './search-replacer.js'
export { default as sorter } from './sorter.js'
export { default as test } from './confine/validators.js'
export { default as uid } from './uid.js'
export { default as uncomment } from './uncomment.js'


/**
    Shorthand Utilities
    ---------------------------------------------------------------------------
    Wrappers of existing functionality for ease of use.
*/
export let ident = value => value
export let nil = () => null
