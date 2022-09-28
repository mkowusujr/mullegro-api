/**
 * Helper function to log errors to return rejected promisese
 * @param {string} errOutput The error message
 * @returns A rejected Promise
 */
exports.sendRejectedPromiseWith = errOutput => {
  console.error(errOutput);
  return Promise.reject(new Error(errOutput));
};
