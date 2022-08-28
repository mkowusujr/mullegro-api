const helperService = require('./helper.service');
const db = require('../models');
const bcrypt = require('bcrypt');
const User = db.users;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const cartService = require('./cart.service');

const failIfUsernameExists = async username => {
  user = await User.findOne({ where: { username: username } });
  if (user) throw `User with the username ${userObj.username} already exists`;
};

const failIfEmailExists = async userEmail => {
  user = await User.findOne({ where: { email: userEmail } });
  if (user) throw `User with the email ${userObj.username} already exists`;
};

const encryptPassword = async newUser => {
  newUser.password = await bcrypt.hashSync(newUser.password, 10);
  await newUser.save();
};

exports.createUser = async user => {
  return await failIfUsernameExists(user.username)
    .then(async () => await failIfEmailExists(user.email))
    .then(async () => {
      let createdUser = await User.create(user);
      await encryptPassword(createdUser);
      await cartService.createCart(createdUser);
      return createdUser;
    })
    .catch(err =>
      helperService.sendRejectedPromiseWith('Error creating user' + err)
    );
};

exports.getUserById = async userId => {
  try {
    let fetchedUser = await User.findByPk(userId);
    if (!fetchedUser) throw `User with id of ${userId} doesn't exist`;
    return fetchedUser;
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getUserByEmail = async userEmail => {
  try {
    let fetchedUser = await User.findOne({ where: { email: userEmail } });
    if (!fetchedUser) throw `User with email of ${userEmail} doesn't exist`;
    return fetchedUser;
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getUserByUsername = async username => {
  try {
    let fetchedUser = await User.findOne({ where: { username: username } });
    if (!fetchedUser) throw `User with username of ${userEmail} doesn't exist`;
    return fetchedUser;
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getUser = async emailOrUsername => {
  try {
    if (emailOrUsername.includes('@'))
      return this.getUserByEmail(emailOrUsername);
    else return this.getUserByUsername(emailOrUsername);
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getCurrentUser = async res => {
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

exports.getAuthorizedUser = async loginObject => {
  try {
    let { emailOrUsername, password } = loginObject;
    let user = await this.getUser(emailOrUsername);
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

exports.findAll = async searchQuery => {
  try {
    if (!searchQuery) return await User.findAll();
    return await User.findAll({
      where: {
        username: {
          [Op.like]: `%${searchQuery}%`
        }
      }
    });
  } catch (error) {
    let errorOutput = 'Error fetching all users: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.deleteUser = async emailOrUsername => {
  try {
    let user = await this.getUser(emailOrUsername);
    await user.destroy();
    return Promise.resolve('Deleted successfully');
  } catch (error) {
    let errorOutput = "User doesn't exist";
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};
