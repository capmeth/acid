import { bundle } from '#config'


let { origin } = new URL(import.meta.url);
let url = new URL(`${bundle}-examples.js`, origin);

let blocks = await import(url).then(mod => mod.default);
// mapped by id
export let ids = blocks.reduce((o, b) => ({ ...o, [b.id]: b }), {});
