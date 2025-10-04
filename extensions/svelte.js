import { mount, unmount } from 'svelte';
import { compile } from 'svelte/compiler'


let insmap = new Map();

export default function ()
{
    let render = async ({ source, imports, el }) =>
    {
        let { code, template } = partition(source);

        let body = !(code && template) ? source :
        `
            ${template}

            <script>
            ${code}
            </script>
        `;

        if (imports) body +=
        `
            <script module>
            ${imports}
            </script>
        `;

        body = compile(body, { generate: 'dom', hmr: false }).js.code;

        let { default: Component } = await modulize(body);
        // remove any already mounted component
        if (insmap.has(el)) unmount(insmap.get(el));
        // mount the new component
        insmap.set(el, mount(Component, { target: el }))
    }

    return { render };
}

let modulize = code => import(`data:text/javascript,${encodeURIComponent(code)}`);

let partRe = /(?:^|\n)\s*(?<tmp><.+)$/s;
/**
    Converts source to a string object and attaches `template` and `code`
    partitions (if possible).

    @param { string } source
      The code to partition.
    @param { object }
      The same `source` with properties for split parts.
*/
let partition = source =>
{
    let result = source.match(partRe);
    let template = result ? result.groups.tmp.trim() : '';
    let code = result ? source.replace(template, '').trim() : '';

    return { code, template };
}
