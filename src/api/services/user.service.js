const helperService = require('./helper.service');
const db = require('../models');
const bcrypt = require('bcrypt');
const User = db.users;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const cartService = require('./cart.service');
const { faker } = require('@faker-js/faker');

/**
 * Checks if the new user's username is taken or not
 * Throws an error if it is
 * @param {string} username
 */
const failIfUsernameExists = async username => {
  let user = await User.findOne({ where: { username: username } });
  if (user) throw `User with the username ${userObj.username} already exists`;
};

/**
 * Checks if the new user's email is taken or not
 * Throws an error if it is
 * @param {string} userEmail
 */
const failIfEmailExists = async userEmail => {
  let user = await User.findOne({ where: { email: userEmail } });
  if (user) throw `User with the email ${userObj.username} already exists`;
};

/**
 * Encrypts the user's password
 * @param {User} newUser The User data object
 */
const encryptPassword = async newUser => {
  newUser.password = await bcrypt.hashSync(newUser.password, 10);
  await newUser.save();
};

/**
 * Creates a new user
 * @param {User} user The User data object
 * @returns The created User
 */
exports.createUser = async user => {
  return await failIfUsernameExists(user.username)
    .then(async () => await failIfEmailExists(user.email))
    .then(async () => {
      let createdUser = await User.create(user);
      await encryptPassword(createdUser);
      await cartService.createCart(createdUser);

      createdUser.profile_picture = faker.image.cats(500, 500, true);
      await createdUser.save();

      return createdUser;
    })
    .catch(err =>
      helperService.sendRejectedPromiseWith('Error creating user' + err)
    );
};

/**
 * Gets a user by their id
 * @param {number} userId The user's id
 * @returns The User object matching the id
 */
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

/**
 * Gets a user by their email
 * @param {string} userEmail
 * @returns The User object matching the email
 */
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

/**
 * Gets the user by their username
 * @param {string} username
 * @returns The User object matching the username
 */
exports.getUserByUsername = async username => {
  try {
    let fetchedUser = await User.findOne({ where: { username: username } });
    if (!fetchedUser) throw `User with username of ${username} doesn't exist`;
    return fetchedUser;
  } catch (error) {
    let errorOutput = 'Error fetching user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Gets a user with either email or username
 * @param {*} emailOrUsername Either the user's email or username
 * @returns The User object matching the email or username
 */
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

/**
 * Gets the user stored in the request object
 * @param {Request} res The http request object
 * @returns The User object stored in the request object
 */
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

/**
 * Gets the user matching the login info
 * @param {*} loginObject
 * @returns The User object that matches the login info
 */
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

/**
 * Finds all the users whose username matches the search query if there is
 * a query, or all the users in the database if otherwise
 * @param {string} searchQuery The query to use to search for users with
 * @returns A list of User objects
 */
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

/**
 * Deletes a user by email or username
 * @param {string} emailOrUsername Either the user's email or username
 * @returns A message about whether the function executed succesfully
 */
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

/**
 * Updates the current user's information
 * @param {User} currentUser The User data object
 * @param {User} updatedUserInfo The User data object
 * @returns The updated User data object
 */
exports.updateUser = async (currentUser, updatedUserInfo) => {
  try {
    currentUser = updatedUserInfo;
    await currentUser.save();
    return currentUser;
  } catch (error) {
    let errorOutput = "Error Updating User";
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
}
