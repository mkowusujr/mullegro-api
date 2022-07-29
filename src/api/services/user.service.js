const helperService = require('./helper.service');
const db = require("../models");
const bcrypt = require('bcrypt');
const User = db.users;

const failIfUsernameExists = async (username) => {
    user = await User.findOne({where: {username: username}});
    if (user) throw `User with ${userObj.username} already exists`;
}

const encryptPassword = async (newUser) => {
    let bcryptSalt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, bcryptSalt);
    await newUser.save();
}

exports.createUser = async (user) => {
    return await failIfUsernameExists(user.username)
    .then(async () => {
        let createdUser = await User.create(user);
        await encryptPassword(createdUser);
        return createdUser;
    })
    .catch( () => helperService.sendRejectedPromise('Error creating user'));
};

exports.getUser = async (userId) => {
    try {
        let fetchedUser = await User.findByPk(userId);
        if(!fetchedUser) throw `User with id of ${userId} doesn't exist`;
        return fetchedUser;
    } catch (error) {
        let errorOutput = 'Error fetching user: '+ error;
        return helperService.sendRejectedPromise(errorOutput);
    }
};

exports.getUserByEmail = async (userEmail) => {
    try {
        let fetchedUser = await User.findOne({where: {email: userEmail}});
        if (!fetchedUser) throw `User with email of ${userEmail} doesn't exist`;
        return fetchedUser;
    } catch (error) {
        let errorOutput = 'Error fetching user: ' + error;
        return helperService.sendRejectedPromise(errorOutput);
    }
};

exports.getUserByUsername = async (username) => {
    return await User.findOne({
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

exports.getCurrentUser = async (res) => {
    try {
        let username = res.locals.user.username;
        let user = await this.getUserByUsername(username);
        return user;
    } catch (err) {
        let errOutput = 'Error getting user: ' + err;
        console.error(errOutput);
        return Promise.reject(errOutput);
    }
    
}

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
