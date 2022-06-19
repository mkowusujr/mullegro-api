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
            return res.status(200).json(foundUsers);
        })
        .catch((err) => {
            return res.status(400).send('Error fetching users: ' + err);
        })
    })
    // create user
    .post((req, res) => {
        const user = userController.createUser(req.body)
        .then((createdUser) => {
            return res.status(200).json(createdUser);
        })
        .catch((err) => {
            return res.status(400).send('Error creating user: ' + err);
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
            return res.status(200).json(fetchedUser);
        })
        .catch((err) => {
            return res.status(400).send('Error fetching user: ' + err);
        })
    })
    // delete user with id
    .delete((req, res) => {
        const deleteUser = userController.deleteUser(req.params.userId)
        .then(() => {
            return res.status(200).send(`Successfully deleted user with id of ${req.params.userId}`);
        })
        .catch((err) => {
            return res.status(400).send('Error deleting user: ' + err);
        })
    });

router.route('/user/:userId/password')
    .all((req, res, next) => {
        // check if correct password was sent in body
        const fetchedUser = userController
            .checkUserPassword(req.params.userId, req.body)
            // console.log(fetchedUser)
            .then(() => {
                // console.log(`${result}`);
                // if (result){
                //     console.log(`${result} next`);
                next();
                // }
                // else {
                    // console.log(`why`);
                    // }
            })
            .catch((err) => {
                console.error('is this the error ' + err);
                res.status(400).send('Error: Incorrect Password');
            })
    })
    .get((req, res) => {
        return res.status(200).send('Hello World');
    })
    .put((req, res) => {

    });

router.put('/user/:userId/email', (req, res) => {

});


/**
 * Finding users with query
 */
router.get('/search', (req, res) => {})


// export user router
module.exports = router;
