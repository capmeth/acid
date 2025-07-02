import { labels } from '#config'


let repRe = /\{(\w+)\}/g;

export default function (string, reps = {})
{
    string = labels[string] ?? string;
    return string.replace(repRe, (match, first) => reps[first] ?? match);
}
