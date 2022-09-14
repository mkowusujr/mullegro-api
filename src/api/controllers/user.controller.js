const express = require('express');
const router = express('Router');
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const user = require('../models/user');

/**
 * @swagger
 * /api/users/register:
 *    post:
 *      tags: ['User Controller']
 *      description: Creating an account
 *      responses:
 *        200:
 *          description: Success
 */
router.post('/register', async (req, res) => {
  try {
    let createdUser = await userService.createUser(req.body);
    let token = jwt.sign({ data: createdUser }, 'secret');
    return res.status(200).send({
      data: createdUser,
      token: token
    });
  } catch (err) {
    return res.status(400).send(`Error creating user: ${err}`);
  }
});

/**
 * @swagger
 * /api/users/login:
 *    post:
 *      tags: ['User Controller']
 *      description: Create a login token
 *      responses:
 *        200:
 *          description: Success
 */
router.post('/login', async (req, res) => {
  try {
    let user = await userService.getAuthorizedUser(req.body);
    let token = jwt.sign({ data: user }, 'secret');
    return res.status(200).send({
      data: user,
      token: token
    });
  } catch (error) {
    return res.status(400).send(`Error signing: ${error}`);
  }
});

/**
 * @swagger
 * /api/users/user/details:
 *    post:
 *      tags: ['User Controller']
 *      description: Get the logged in user's details
 *      responses:
 *        200:
 *          description: Success
 */
router.get('/user/details', auth.verifyToken, (req, res) => {
  return res.status(200).send(res.locals.user);
});

/**
 * @swagger
 * /api/users:
 *    post:
 *      tags: ['User Controller']
 *      description: Get all users from the database
 *      responses:
 *        200:
 *          description: Success
 */
router.get('', async (req, res) => {
  try {
    foundUsers = await userService.findAll();
    return res.status(200).send(foundUsers);
  } catch (err) {
    return res.status(400).send('Error fetching users: ' + err);
  }
});

/**
 * @swagger
 * /api/users/user/byId/:id:
 *    post:
 *      tags: ['User Controller']
 *      description: Get a user from the database by id
 *      responses:
 *        200:
 *          description: Success
 */
router.get('/user/byId/:id', async (req, res) => {
  try {
    let fetchedUser = await userService.getUserById(req.params.id);
    return res.status(200).json(fetchedUser);
  } catch (error) {
    return res.status(404).send('Error fetching user: ' + error);
  }
});

/**
 * @swagger
 * /api/users/user/:username:
 *    post:
 *      tags: ['User Controller']
 *      description: Get a user from the database by username
 *      responses:
 *        200:
 *          description: Success
 */
router.get('/user/:username', async (req, res) => {
  try {
    let fetchedUser = await userService.getUserByUsername(req.params.username);
    return res.status(200).json(fetchedUser);
  } catch (error) {
    return res.status(404).send('Error fetching user: ' + error);
  }
});

/**
 * @swagger
 * /api/users/user/:username:
 *    post:
 *      tags: ['User Controller']
 *      description: Delete a user from the database by username
 *      responses:
 *        200:
 *          description: Success
 */
router.delete('/user/:username', async (req, res) => {
  try {
    await userService.deleteUser(req.params.username);
    return res
      .status(200)
      .send(`Successfully deleted user with id of ${req.params.userId}`);
  } catch (error) {
    return res.status(404).send('Error deleting user: ' + error);
  }
});

/**
 * @swagger
 * /api/users/user/:username:
 *    post:
 *      tags: ['User Controller']
 *      description: Search and retrieve all the users in the database whose username matched the search query
 *      responses:
 *        200:
 *          description: Success
 */
router.get('/search', async (req, res) => {
  try {
    let queryString = req.query.query;
    let users = await userService.findAll(queryString);
    return res.status(200).send(users);
  } catch (error) {
    return res.status(404).send('Error fetching users: ' + error);
  }
});

// export user router
module.exports = router;
