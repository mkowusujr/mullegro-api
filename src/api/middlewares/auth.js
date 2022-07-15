const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send({message: "Unauthorized"});
    }
    else {
        jwt.verify(req.headers.authorization, "secret", (err, decoded) => {
            if (decoded){
                res.locals.user = decoded.data;
                console.log('decoded user is ' + JSON.stringify(res.locals.user, null, 4))
                next();
            }
            else {
                res.status(401).send({message: "Unauthorized"});
            }
        });
    }
};