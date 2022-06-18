const express = require('express');
const router = express('Router');
const userController = require('../controllers/user.controller');

/**
 * Dealing with all users
 */
router.route('')
    // get all users
    .get((req, res) => {
        const users = userController.findAll()
        .then((foundUsers) => {
            res.status(200).json(foundUsers);
        })
        .catch((err) => {
            res.status(400).send('error creating user: ' + err);
        })
    })
    // create user
    .post((req, res) => {
        const user = userController.createUser(req.body)
        .then((createdUser) => {
            res.status(200).json(createdUser);
        })
        .catch((err) => {
            res.status(400).send('error creating user: ' + err);
        })
    });

/**
 * Dealing with one user
 */
router.route('/user/:userId')
    // get user with id
    .get((res, req) => {})
    // update user with id
    .put((res, req) => {})
    // delete user with id
    .delete((res, req) => {})

/**
 * Finding users with query
 */
router.get('/search', (res, req) => {})

// export user router
module.exports = router;
