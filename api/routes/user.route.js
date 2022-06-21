const express = require('express');
const router = express('Router');
const userController = require('../controllers/user.controller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Dealing with all users
 */
// get all users
router.get('', (req, res) => {
        const users = userController.findAll()
        .then((foundUsers) => {
            return res.status(200).json(foundUsers);
        })
        .catch((err) => {
            return res.status(400).send('Error fetching users: ' + err);
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


/**
 * Finding users with query
 */
router.get('/search', (req, res) => {});


router.post('/register', (req, res) => {
    const user = userController.createUser(req.body)
        .then((createdUser) => {
            let token = jwt.sign({data: createdUser}, 'secret')
            return res.status(200).send({
                status: 1, 
                data: createdUser,
                token: token
            });
        })
        .catch((err) => {

            return res.status(400).send({
                status: 0,
                data: `Error creating user: ${err}`
            });
        })
});


router.post('/login', (req, res) => {
    let {email, password} = req.body;
    const user = userController.getUserByEmail(email)
    .then((user) => {
        bcrypt.compare(password, user.password_hash, function(err, result) {
            console.log(password);
            console.log(user.password_hash);
            if (result){
                let token = jwt.sign({data: user}, 'secret')
                return res.status(200).send({
                    status: 1, 
                    data: user,
                    token: token
                });
            }
            else {
                return res.status(400).send({
                    status: 0,
                    data: `Error signing: ${err}`
                });
            }
        });
    })
    .catch((err) => {
        return res.status(400).send({
                    status: 0,
                    data: `Error signing: ${err}`
                });
    });
});


// export user router
module.exports = router;
