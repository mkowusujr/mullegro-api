exports.logger = (req, res, next) => {
    console.log(`>> ${req.method} http://${req.headers.host}${req.originalUrl}`);
    req.body ? console.log(`\t${req.body}`) : null;
    next();
};