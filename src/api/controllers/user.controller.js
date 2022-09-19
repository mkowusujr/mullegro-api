const express = require('express');
const router = express('Router');
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *      tags: ['User Controller']
 *      summary: Creating an account
 *      requestBody:
 *        description: The user to create
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUser'
 *      responses:
 *        200:
 *          description: Successfully created user
 *        400:
 *          description: Error trying to create user
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
 *      summary: Create a login token
 *      requestBody:
 *        description: The user's login credentials
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginInput'
 *      responses:
 *        200:
 *          description: Successfully logged in
 *        400:
 *          description: Error trying to login
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
 *    get:
 *      tags: ['User Controller']
 *      summary: Gets the current users properties
 *      security:
 *      - BearerAuth: []
 *      responses:
 *        200:
 *          description: A user
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Users'
 *        404:
 *          description: Error fetching users
 */
router.get('/user/details', auth.verifyToken, (req, res) => {
  return res.status(200).send(res.locals.user);
});

/**
 * @swagger
 * /api/users:
 *    get:
 *      tags: ['User Controller']
 *      summary: Get all users from the database
 *      responses:
 *        200:
 *          description: A list of all the users in the database
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Users'
 *        404:
 *          description: Error fetching users
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
 * /api/users/user/byId/{id}:
 *    get:
 *      tags: ['User Controller']
 *      summary: Get a user from the database by id
 *      parameters:
 *        - $ref: '#/components/parameters/userIdParam'
 *      responses:
 *        200:
 *          description: A user with the specified id
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        404:
 *          description: Error fetching users
 */
router.get('/user/byId/:id', async (req, res) => {
  try {
    let fetchedUser = await userService.getUserById(req.params.id);
    return res.status(200).send(fetchedUser);
  } catch (error) {
    return res.status(404).send('Error fetching user: ' + error);
  }
});

/**
 * @swagger
 * /api/users/user/{username}:
 *    get:
 *      tags: ['User Controller']
 *      summary: Get a user from the database by username
 *      parameters:
 *        - $ref: '#/components/parameters/usernameParam'
 *      responses:
 *        200:
 *          description: A user with the specified username
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        404:
 *          description: Error fetching users
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
 * /api/users/user/{username}:
 *    delete:
 *      tags: ['User Controller']
 *      summary: Delete a user from the database by username
 *      parameters:
 *        - $ref: '#/components/parameters/usernameParam'
 *      responses:
 *        200:
 *          description: Successfully deleted user
 *        404:
 *          description: Error deleting users
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
 * /api/users/search:
 *    get:
 *      tags: ['User Controller']
 *      summary: Search and retrieve all the users in the database whose username matched the search query
 *      parameters:
 *        - $ref: '#/components/parameters/searchQuery'
 *      responses:
 *        200:
 *          description: A list of users
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Users'
 *        404:
 *          description: Error fetching users
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
