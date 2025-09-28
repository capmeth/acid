
/*
    Default Logger Options
    ---------------------------------------------------------------------------
*/
let logger = {};


/**
    Primary and secondary coloring for log messages.

    @type { object }
*/
logger.colors =
{
    fail: 'redBright',
    info: { main: 'cyan', emph: 'cyanBright' },
    test: { main: 'gray', emph: 'white' },
    warn: { main: 'yellow', emph: 'yellowBright' } 
}

/**
    Default logger.

    @type { function }
*/
logger.default = null;

/** 
    Severity level.

    @type { object }
*/
logger.level = 'warn';

/**
    Fail level logger.

    @type { function }
*/
logger.fail = console.error;

/**
    Info level logger.

    @type { function }
*/
logger.info = console.info;

/**
    Logger name.

    @type { string }
*/
logger.name = 'acid';

/**
    Test level logger.

    @type { function }
*/
logger.test = console.debug;

/**
    Warn level logger.

    @type { function }
*/
logger.warn = console.warn;

/**
    Turn off log coloring?

    @type { boolean }
*/
logger.noChalk = false;

export default logger;
