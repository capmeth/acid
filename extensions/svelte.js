import { mount, unmount } from 'svelte';
import { compile } from 'svelte/compiler'


let insmap = new Map();

export default function ()
{
    let render = async ({ source, partition, modulize, el }) =>
    {
        let { code, template } = partition(source);

        let body = !(code && template) ? source :
        `
            ${template}

            <script>
            ${code}
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
