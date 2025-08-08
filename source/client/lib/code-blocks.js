import { bundle } from '#config'


let url = new URL(`${bundle}-examples.js`, new URL(import.meta.url));

let blocks = await import(url).then(mod => mod.default);
// mapped by id
export let ids = blocks.reduce((o, b) => ({ ...o, [b.id]: b }), {});
