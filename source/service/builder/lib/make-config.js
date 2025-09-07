import { jss, proxet } from '#utils'


/**
    Generates client config exports.

    @return { string }
      JS export file.
*/
export default function(config, sections, assets)
{
    let { cobe, output, server, watch } = config;

    let lines = [];
    let cfg = proxet({}, name => jss(config[name]));

    lines.push(`import { mapExtensions } from '#utils'`);

    lines.push(`export let assetTypes = ${cfg.assetTypes}`);
    lines.push(`export let bundle = ${jss(output.name)}`);
    lines.push(`export let hljsc = ${cfg.hljs}`);
    lines.push(`export let labels = ${cfg.labels}`);
    lines.push(`export let logo = ${cfg.logo}`);
    lines.push(`export let namespace = ${cfg.namespace}`);
    lines.push(`export let rootSection = ${cfg.rootSection}`);
    lines.push(`export let socket = ${cfg.socket}`);
    lines.push(`export let storage = ${cfg.storage}`);
    lines.push(`export let hrMode = ${server.enabled && watch.enabled}`);
    lines.push(`export let tagLegend = ${cfg.tagLegend}`);
    lines.push(`export let title = ${cfg.title}`);
    lines.push(`export let tocDepth = ${cfg.tocDepth}`);
    lines.push(`export let version = ${cfg.version}`);

    lines.push(`export let sections = ${jss(sections)}`);
    lines.push(`export let assets = ${jss(assets)}`);

    lines.push(`export let cobe = await mapExtensions(${jss(cobe)})`);

    return lines.join('\n');
}
