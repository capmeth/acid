import path from 'node:path'


let filepath = path.join(process.cwd(), 'package.json');
let mod = await import(filepath, { with: { type: 'json' } });

export let hackson = mod.default;
