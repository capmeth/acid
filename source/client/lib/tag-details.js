import { tagLegend } from '#config'


export default function (tag)
{
    let [ name, info ] = tag.split(':');
    return { name, info, ...tagLegend[name] };
}
