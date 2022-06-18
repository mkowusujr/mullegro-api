const db = require("../models");
const User = db.users;

exports.createUser = (userObj) => {
    return User.create({
        name: userObj.name,
        address: userObj.address,
        email: userObj.email,
        password_hash: userObj.password_hash
    })
    .then((createdUser) => {
        userOb = createdUser;
        delete userObj.password_hash;
        console.log(">> Created user:\n" + JSON.stringify(userObj, null, 4));
        return createdUser;
    })
    .catch((err) => {
        console.log('>> Error  creating user:' + err);
    })
};