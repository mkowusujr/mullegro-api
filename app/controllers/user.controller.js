const db = require("../models");
const User = db.users;

exports.createUser = (user) => {
    return User.create({
        name: user.name,
        location: user.location,
        email: user.email,
        password_hash: user.password_hash
    })
    .then((user) => {
        console.log(">> Created comment: " + JSON.stringify(user, null, 4));
        return user;
    })
    .catch((err) => {
        console.log('Error  creating user:' + err);
    })
};