import path from 'node:path'


/*
    Utilities to access the dependent (hosted) application.
*/

let root = process.cwd();

export let toHostedPath = (...segs) => path.join(root, ...segs)

export let hackson = await import(path.join(root, 'package.json'), { with: { type: 'json' } }).then(x => x.default);
