
/*
    Rewrite package.json for publish.
*/

import fs from 'fs/promises'
import packson from './package.json' with { type: 'json' }

let pubson = 
{
    name: packson.name,
    version: packson.version,
    description: packson.description,
    title: packson.title,
    author: packson.author,
    license: packson.license,
    keywords: packson.keywords,
    homepage: packson.homepage,
    logo: packson.logo,
    type: packson.type,
    dependencies: packson.dependencies,
    main: packson.main,
    imports: packson.imports,
    exports: packson.exports,
    bin: packson.bin,
    files: packson.files,
    repository: packson.repository,
}

await fs.writeFile('package-save.json', JSON.stringify(packson, null, 4), 'utf8');
await fs.writeFile('package.json', JSON.stringify(pubson, null, 4), 'utf8');
