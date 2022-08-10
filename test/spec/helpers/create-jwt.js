const jwt = require('jsonwebtoken');
exports.createJwt = (dummyUser) => {
let token = jwt.sign({ data: dummyUser }, 'secret');
return token;
}