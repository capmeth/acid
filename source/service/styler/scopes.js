/*
    Variant IDs
    ---------------------------------------------------------------------------
    The styling boxes that everything in the site falls into.
*/
import { glob } from 'glob'
import path from 'node:path'
import paths from '#paths'


let variants = [];
let files = await glob(path.join('components', '**', '*.svt'), 
{
    cwd: paths.client,
    ignore:
    [
        path.join('components', 'app', 'Router.svt'),
        path.join('components', 'assets', '*.svt'),
        path.join('components', 'cobe', 'Code.svt'),
        path.join('components', 'cobe', 'Renbox.svt'),
        path.join('components', 'filter', 'Filtered.svt'),
        path.join('components', 'nav', 'Assets.svt'),
        path.join('components', 'nav', 'Content.svt'),
        path.join('components', 'nav', 'Primary.svt'),
        path.join('components', 'nav', 'Tree.svt'),
        path.join('components', 'page', '*.svt')
    ]
});

let re = /components\/(?:(?:(.+)\/)?([^\/]+))\.svt$/;

export let toScopeId = file => 
{
    if (re.test(file))
    {
        let [ cat = '', name ] = file.match(re).slice(1);
        return `.${cat}-${name.toLowerCase()}`;
    }
    return null;
}

files.forEach(file => variants.push(toScopeId(file)));

export default variants.sort();
