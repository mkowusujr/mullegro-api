const helperService = require('./helper.service');
const db = require('../models');
const bcrypt = require('bcrypt');
const User = db.users;

const failIfUsernameExists = async (username) => {
  user = await User.findOne({ where: { username: username } });
  if (user) throw `User with the username ${userObj.username} already exists`;
};

const failIfEmailExists = async (userEmail) => {
  user = await User.findOne({ where: { email: userEmail } });
  if (user) throw `User with the email ${userObj.username} already exists`;
};

const encryptPassword = async (newUser) => {
  // let bcryptSalt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hashSync(newUser.password, 10);
  await newUser.save();
};

exports.createUser = async (user) => {
  return await failIfUsernameExists(user.username)
    .then(async () => await failIfEmailExists(user.email))
    .then(async () => {
      let createdUser = await User.create(user);
      await encryptPassword(createdUser);
      return createdUser;
    })
    .catch(() => helperService.sendRejectedPromiseWith('Error creating user'));
};

exports.getUserById = async (userId) => {
  try {
    let fetchedUser = await User.findByPk(userId);
    if (!fetchedUser) throw `User with id of ${userId} doesn't exist`;
    return fetchedUser;
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getUserByEmail = async (userEmail) => {
  try {
    let fetchedUser = await User.findOne({ where: { email: userEmail } });
    if (!fetchedUser) throw `User with email of ${userEmail} doesn't exist`;
    return fetchedUser;
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getUserByUsername = async (username) => {
  try {
    let fetchedUser = await User.findOne({ where: { username: username } });
    if (!fetchedUser) throw `User with username of ${userEmail} doesn't exist`;
    return fetchedUser;
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getUser = async (email_or_username) => {
  try {
    if (email_or_username.includes('@'))
      return this.getUserByEmail(email_or_username);
    else return this.getUserByUsername(email_or_username);
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
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
};

exports.getAuthorizedUser = async (loginObject) => {
  try {
    let { email_or_username, password } = loginObject;
    let user = await this.getUser(email_or_username);
    let isCorrectPassword = await bcrypt.compareSync(password, user.password);
    if (isCorrectPassword) {
      return await User.findByPk(user.id, {
        attributes: ['name', 'username', 'email', 'address']
      });
    } else {
      throw 'Incorrect Password';
    }
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.findAll = async () => {
  try {
    return await User.findAll();
  } catch (error) {
    let errorOutput = 'Error fetching all users: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.deleteUser = async (user) => {
  try {
    await user.destroy();
    return Promise.resolve('Deleted successfully');
  } catch (error) {
    let errorOutput = "User doesn't exist";
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};
