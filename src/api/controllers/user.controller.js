const express = require('express');
const router = express('Router');
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const user = require('../models/user');

/**
 * Creating an account
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
 * Login
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
 * Get looged in user's details
 */
router.get('/user/details', auth.verifyToken, (req, res) => {
  return res.status(200).send(res.locals.user);
});

/**
 * Get all users
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
 * Dealing with one user
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
 * 
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
 * Finding users with query
 */
router.get('/search', (req, res) => {});

// export user router
module.exports = router;
