

export default function(level, data)
{
    let { code, message } = data;

    if (level === 'warn')
    {
        if (code === 'CIRCULAR_DEPENDENCY')
        {
            // filter annoying svelte internal warnings
            if (message.indexOf('node_modules/svelte/src') >= 0)
                data.message = `svelte internal warning(s) suppressed`;
        }
    }

    return send(level, data);
}

let send = (level, data) =>
{
    let { code, message } = data;
    let key = `${level}-${message}`;

    if (key !== send.last)
    {
        let msg = `${code}: ${message}`;

        switch (level)
        {
            case 'debug': log.test(msg); break;
            case 'info': log.info(msg); break;
            case 'warn': log.warn(msg); break;
            case 'error': log.fail(JSON.stringify(data)); break;
        }

        send.last = key;
    }
}
