import scopes from '#source/service/styler/scopes.js'
import config from '#docsite/acid.config.js'


let jss = value => JSON.stringify(value);
// virtual files for doc bundle build
export default
{
    './config': `export default ${jss(config)}`,
    './scopes': `export default ${jss(scopes)}`
}
