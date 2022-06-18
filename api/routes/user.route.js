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
    .get((req, res) => {
        const fetchUser = userController.getUser(req.params.userId)
        .then((fetchedUser) => {
            res.status(200).json(fetchedUser);
        })
        .catch((err) => {
            res.status(400).send('error fetching user: ' + err);
        })
    })
    // update user with id
    .put((req, res) => {})
    // delete user with id
    .delete((req, res) => {
        console.log(req.params.userId)
        const deleteUser = userController.deleteUser(req.params.userId)
        .then((deletedUser) => {
            res.status(200).json(deletedUser);
        })
        .catch((err) => {
            res.status(400).send('error creating user: ' + err);
        })
    })

/**
 * Finding users with query
 */
router.get('/search', (req, res) => {})

// export user router
module.exports = router;
