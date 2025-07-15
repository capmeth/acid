import { glob } from 'glob'


/*
    Creates a file list from include/exclude in `files`.
*/
export default async function (files, cwd)
{
    let { include = [], exclude: ignore = [] } = files || {};
    return glob(include, { ignore, cwd });
}
