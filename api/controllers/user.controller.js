const db = require("../models");
const bcrypt = require('bcrypt');
const User = db.users;

exports.createUser = async (userObj) => {
    return await User.create({
        name: userObj.name,
        address: userObj.address,
        email: userObj.email
    })
    .then((createdUser) => {
        // hashing the password and added it to the created user
        bcrypt.hash(userObj.password_hash, 10, (err, hash) => {
            createdUser.password_hash = hash;
            createdUser.save();
        });

        // removed password field and return obj to console for debugging
        userObj = createdUser;
        delete userObj.password_hash;
        console.log(">> Created user:\n" + JSON.stringify(userObj, null, 4));
        
        // return created user
        return userObj;
    })
    .catch((err) => {
        console.error('>> Error creating user: ' + err);
    })
};

exports.getUser = async (userId) => {
    return await User.findByPk(userId)
    // check if user exists first
    .then((fetchedUser) => {
        if (fetchedUser != null){
            return fetchedUser
        } 
        else {
            throw `User with id of ${userId} doesn't exist`;
        }
    })
    // if exists return it
    .then((fetchedUser) => {
        console.log('>> Fetched user:\n' + JSON.stringify(fetchedUser, null, 4));
        return fetchedUser;
    })
    .catch((err) => {
        console.error('>> Error fetching user: ' + err);
    })
}

exports.findAll = async () => {
    return await User.findAll()
    .catch((err) => {
        console.error('>> Error fetching all users: ' + err);
    })
};

exports.deleteUser = async (userId) => {
    const deleted = await User.destroy({where: {id: userId}});
    console.log(deleted);
    // return await User.findByPk(userId)
    // .catch((err) => {
    //     console.error('>> Error fetching user: ' + err);
    // })
}