exports.logger = (req, res, next) => {
    const requestOutput = `>> ${req.method} http://${req.headers.host}${req.originalUrl}`
    switch(req.method) {
        case 'GET': console.log(colorize(requestOutput).magenta);
        break;

        case 'POST': console.log(colorize(requestOutput).green);
        break;

        case 'PUT': console.log(colorize(requestOutput).yellow);
        break;

        case 'DELETE': console.log(colorize(requestOutput).red);
        break;

        default: console.log(colorize(requestOutput).white);
    }
    
    // req.body ? console.log(`\t${req.body}`) : null;
    console.log(`\t${req.body}`);
    next();
};

/**
 * function for adding color to console log text
 * @param  {...any} args 
 * @returns 
 */
const colorize = (...args) => ({
    black: `\x1b[30m${args.join(' ')}`,
    red: `\x1b[31m${args.join(' ')}`,
    green: `\x1b[32m${args.join(' ')}`,
    yellow: `\x1b[33m${args.join(' ')}`,
    blue: `\x1b[34m${args.join(' ')}`,
    magenta: `\x1b[35m${args.join(' ')}`,
    cyan: `\x1b[36m${args.join(' ')}`,
    white: `\x1b[37m${args.join(' ')}`,
    bgBlack: `\x1b[40m${args.join(' ')}\x1b[0m`,
    bgRed: `\x1b[41m${args.join(' ')}\x1b[0m`,
    bgGreen: `\x1b[42m${args.join(' ')}\x1b[0m`,
    bgYellow: `\x1b[43m${args.join(' ')}\x1b[0m`,
    bgBlue: `\x1b[44m${args.join(' ')}\x1b[0m`,
    bgMagenta: `\x1b[45m${args.join(' ')}\x1b[0m`,
    bgCyan: `\x1b[46m${args.join(' ')}\x1b[0m`,
    bgWhite: `\x1b[47m${args.join(' ')}\x1b[0m`
  });