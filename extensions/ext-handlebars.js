import handlebars from 'handlebars'


export default function (context)
{
    context ??= {};

    let generate = (template, context) => handlebars.compile(template)(context);

    let render = async ({ source, imports, modulize, el }) =>
    {
        let { code, template } = source;
        // escape ticks
        template = template.replaceAll('`', '\\`');

        let body =
        `
            ${imports}

            export default function (tc, __generate)
            {
                ${code}

                return __generate(\`${template}\`, { ...bundle, ...tc });
            }
        `;
        
        let mod = await modulize(body);

        el.innerHTML = mod.default(context, generate);
    }

    return { render };
}
