import chalk from 'chalk'


let chalkRe = /\{:([a-z.]+?)?:(.+?)\}/gi;
let get = (obj, name) => name.split('.').reduce((o, n) => o[n], obj)
let lm = { test: '', info: 'cyanBright', warn: 'yellow', fail: 'redBright' };
let order = [ 'test', 'info', 'warn', 'fail' ];

export default function(config)
{
    let { logger, namespace } = config, { noChalk, level } = logger;

    let main = logger.default || console.log;
    let levels = (i => i >= 0 ? order.slice(i) : [])(order.indexOf(level))

    let inter = message =>
    {
        if (typeof message === 'string')
        {
            return message.replace(chalkRe, (...args) => 
            {
                let [ mods, text ] = args.slice(1);
                return noChalk || !mods ? text : get(chalk, mods)(text);
            });
        }

        return message;
    } 

    /**
        Sends log message output to configured logger(s).

        To add chalk to a message use `{mods:text}` replacement format in a
        message.

        @param { string } msg
          String to be logged.
        @param { string } lvl 
          One of 'test', 'info', 'warn', or 'fail'. 
    */
    let send = (msg, lvl) => 
    {
        if (lvl)
        {
            if (levels.includes(lvl) && logger[lvl])
            {
                if (lvl === 'fail') msg = `{:${lm[lvl]}:${msg}}`;
                let string = `${namespace}:{:${lm[lvl]}:${lvl}} - ${msg}`;
                return logger[lvl](inter(string));
            }
            else if (lvl === 'fail')
            {
                main(`A failure message occurred.  Turn on "fail" level logging to see errors.`);
            }
        }
        else
        {
            return main(inter(msg));
        }
    }

    let log = message => send(message)

    log.test = message => send(message, 'test')
    log.info = message => send(message, 'info')
    log.warn = message => send(message, 'warn')
    log.fail = message => send(message, 'fail')

    return log;
}
