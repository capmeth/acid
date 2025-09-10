import chalk from 'chalk'


let chalkRe = /\{:([a-z.]+?)?:((?:(?!\{:[a-z.]+?:.+?\}).)+?)\}/gsi;
let order = [ 'test', 'info', 'warn', 'fail' ];

let cacheFn = {};
let chalkFn = expr => cacheFn[expr] ||= new Function('chalk', `return chalk.${expr};`)(chalk)

export default function(logger)
{
    let { colors, name, noChalk, level } = logger;

    let main = logger.default || console.log;
    let levels = (i => i >= 0 ? order.slice(i) : [])(order.indexOf(level))
    let toms = m => typeof m === 'function' ? m() : m;

    let inter = (message, level) =>
    {
        if (typeof message === 'string')
        {
            let theme = colors[level] || {};

            while (chalkRe.test(message))
            {
                message = message.replace(chalkRe, (...args) => 
                {
                    let [ mods, text ] = args.slice(1);
                    return noChalk || !mods ? text : chalkFn(theme[mods] || mods)(text);
                });
            }
        }

        return message;
    } 

    /**
        Sends log message output to configured logger(s).

        To add chalk to a message use `{:mods:text}` replacement format in a
        message.

        @param { string } msg
          String to be logged.
        @param { string } level 
          One of 'test', 'info', 'warn', or 'fail'. 
    */
    let send = (msg, level) => 
    {
        if (!level)
            return main(inter(toms(msg)));

        if (levels.includes(level) && logger[level])
        {
            msg = toms(msg);
            msg = `{:main:${name}:${level} - ${msg}}`;
            return logger[level](inter(msg, level));
        }

        if (level === 'fail') 
            return main(`A failure message occurred.  Turn on "fail" level logging to see errors.`);
    }

    let log = message => send(message)

    log.test = message => send(message, 'test')
    log.info = message => send(message, 'info')
    log.warn = message => send(message, 'warn')
    log.fail = message => send(message, 'fail')

    return log;
}
