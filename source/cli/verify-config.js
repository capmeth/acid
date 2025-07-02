import parseFile from '#node/parse-file.js';
import definition from '../config/definition.js'
import confine from '../shared/confine/index.js'


/**
    Verifies a config file.

    @param { string } file
      File to verify.
*/
export default async file =>
{
    return parseFile(file)
        .then(data => confine(definition).config = data)
        .catch(err => console.log(err.message));    
}
