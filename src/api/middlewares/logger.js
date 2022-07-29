/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.logger = (req, res, next) => {
  const requestOutput = `>> ${req.method} http://${req.headers.host}${req.originalUrl}`;
  const bodyJSON = JSON.stringify(req.body, null, 2);

  logRequest(req.method, requestOutput, bodyJSON);
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

/**
 *
 * @param {*} requestMethod
 */
const logRequest = (requestMethod, requestOutput, bodyJSON) => {
  switch (requestMethod) {
    case 'GET':
      console.log(colorize(requestOutput).magenta);
      break;

    case 'POST':
      console.log(colorize(requestOutput + '\n>> Request Body:').green);
      console.log(`${bodyJSON}`);
      break;

    case 'PUT':
      console.log(colorize(requestOutput + '\n>> Request Body:').yellow);
      console.log(`${bodyJSON}`);
      break;

    case 'DELETE':
      console.log(colorize(requestOutput).red);
      break;

    default:
      console.log(colorize(requestOutput).white);
  }
};
