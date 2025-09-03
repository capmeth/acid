
let repRe = /\{(\w+)\}/g;

export default (str, reps = {}) => str.replace(repRe, (match, first) => reps[first] ?? reps.__default ?? match)
