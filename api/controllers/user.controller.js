const db = require("../models");
const bcrypt = require('bcrypt');
const User = db.users;

async function usernameExists (username) {
    user = await User.findOne({
        attributes: ['name','email', 'username', 'address', 'password_hash'],
        where: {
            username: username
        }
    });
    if (user) {
        return true;
    }
    else {
        return false
    }
}

exports.createUser = async (userObj) => {
    let doesUsernameExist = await usernameExists(userObj.username);
    if (doesUsernameExist) {
        throw `User with ${userObj.username} already exists`;
    }
    else {
        return await User.create({
        name: `${userObj.firstname} ${userObj.lastname}`,
        username: userObj.username,
        address: userObj.address,
        email: userObj.email
        })
        .then((createdUser) => {
            // hashing the password and added it to the created user
            bcrypt.hash(userObj.password_1, 10, (err, hash) => {
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
    }
};

exports.getUser = async (userId) => {
    return await User.findByPk(
        userId,
        {attributes: ['name', 'username', 'email','address']}
        )
    // check if user exists first
    .then((fetchedUser) => {
        if (fetchedUser != null)
            return fetchedUser;
        else 
            throw `User with id of ${userId} doesn't exist`;
    })
    // if exists return it
    .then((fetchedUser) => {
        console.log('>> Fetched user:\n' + JSON.stringify(fetchedUser, null, 4));
        return fetchedUser;
    })
    .catch((err) => {
        console.error('>> Error fetching user: ' + err);
        throw `User with id of ${userId} doesn't exist`;
    })
};

exports.getUserByEmail = async (userEmail) => {
    return await User.findOne({
        attributes: ['name','email', 'username', 'address', 'password_hash'],
        where: {
            email: userEmail
        }
    })
    // check if user exists first
    .then((fetchedUser) => {
        if (fetchedUser != null)
            return fetchedUser;
        else 
            throw `User with email of ${userEmail} doesn't exist`;
    })
    // if exists return it
    .then((fetchedUser) => {
        console.log('>> Fetched user:\n' + JSON.stringify(fetchedUser, null, 4));
        return fetchedUser;
    })
    .catch((err) => {
        console.error('>> Error fetching user: ' + err);
        throw `User with email of ${userEmail} doesn't exist`;
    })
};

exports.getUserByUsername = async (username) => {
    return await User.findOne({
        attributes: ['name','email', 'username', 'address', 'password_hash'],
        where: {
            username: username
        }
    })
    // check if user exists first
    .then((fetchedUser) => {
        if (fetchedUser != null)
            return fetchedUser;
        else 
            throw `User with username of ${username} doesn't exist`;
    })
    // if exists return it
    .then((fetchedUser) => {
        console.log('>> Fetched user:\n' + JSON.stringify(fetchedUser, null, 4));
        return fetchedUser;
    })
    .catch((err) => {
        console.error('>> Error fetching user: ' + err);
        throw `User with username of ${username} doesn't exist`;
    })
};

exports.getUserAcctDetails = async (email_or_username) => {
    if (email_or_username.includes('@'))
        return this.getUserByEmail(email_or_username);
    else
        return this.getUserByUsername(email_or_username);
};

exports.findAll = async () => {
    return await User.findAll()
    .catch((err) => {
        console.error('>> Error fetching all users: ' + err);
    })
};

exports.deleteUser = async (username) => {
    const deleteResult = await User.destroy({where: {username: username}})
    // check if user exists
    .then((deleteResult) => {
        if (deleteResult == 0){
            throw `User with username of ${username} doesn't exist`;
        }
    })
    .catch((err) => {
        console.error('>> Error fetching user: ' + err);
        throw `User with username of ${username} doesn't exist`;
    });
};
