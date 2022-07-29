exports.sendRejectedPromise = (errOutput) => {
    console.error(errOutput);
    return Promise.reject(new Error(errOutput));
}