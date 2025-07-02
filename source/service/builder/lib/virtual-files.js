import scopes from '#source/service/styler/scopes.js'


let jss = value => JSON.stringify(value);
// virtual files for doc bundle build
export default
{
    './scopes': `export default ${jss(scopes)}`
}
