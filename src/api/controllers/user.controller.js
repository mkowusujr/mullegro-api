const express = require('express');
const router = express('Router');
const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');

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
    let { email_or_username, password } = req.body;
    let user = await userService.getUser(email_or_username);
    console.info(password);
    console.info(user.password);
    let isCorrectPassword = await bcrypt.compare(password, user.password);
    if (isCorrectPassword) {
      delete user.password_hash;
      let token = jwt.sign({ data: user }, 'secret');
      return res.status(200).send({
        data: user,
        token: token
      });
    }
  } catch (error) {
    return res.status(400).send(`Error signing: ${error}`);
  }
});

/**
 * Get looged in user's details
 */
router.get('/user/details', auth.verifyToken, (req, res) => {
  return res.status(200).send({
    status: 1,
    data: res.locals.user
  });
});

/**
 * Get all users
 */
router.get('', async (req, res) => {
  try {
    foundUsers = await userService.findAll();
    return res.status(200).json(foundUsers);
  } catch (err) {
    return res.status(400).send('Error fetching users: ' + err);
  }
});

/**
 * Dealing with one user
 */
router
  .route('/user/:username')
  .get(async (req, res) => {
    try {
      let fetchedUser = await userService.getUserByUsername(
        req.params.username
      );
      return res.status(200).json(fetchedUser);
    } catch (error) {
      return res.status(400).send('Error fetching user: ' + err);
    }
  })
  .delete(async (req, res) => {
    try {
      await userService.deleteUser(req.params.username);
      return res
        .status(200)
        .send(`Successfully deleted user with id of ${req.params.userId}`);
    } catch (err) {
      return res.status(400).send('Error deleting user: ' + err);
    }
  });

/**
 * Finding users with query
 */
router.get('/search', (req, res) => {});

// export user router
module.exports = router;
