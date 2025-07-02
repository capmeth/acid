import { proxet } from '#utils'


let jss = value => JSON.stringify(value);

/**
    Generates renderer config exports.

    @param { object } config
      Docsite config object.
    @return { string }
      JS export file.
*/
export default function(config)
{
    let cfg = proxet({}, name => jss(config[name]));

    let lines = [];

    lines.push(`export let root = ${cfg.root}`);
    lines.push(`export let cobeSpecs = ${cfg.cobeSpecs}`);
    lines.push(`export let parsers = ${cfg.parsers}`);

    return lines.join('\n');
}
