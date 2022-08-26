const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send({ message: 'Unauthorized' });
  } else {
    jwt.verify(req.headers.authorization, 'secret', (err, decoded) => {
      if (decoded) {
        delete decoded.data.password;
        res.locals.user = decoded.data;
        next();
      } else {
        res.status(401).send({ message: 'Unauthorized' });
      }
    });
  }
};
