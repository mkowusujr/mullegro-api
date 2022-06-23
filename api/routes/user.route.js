const express = require('express');
const router = express('Router');
const userController = require('../controllers/user.controller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');

/**
 * Creating an account
 */
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

/**
 * Login
 */
router.post('/login', (req, res) => {
    let {email_or_username, password} = req.body;
    console.log(email_or_username);
    const user = userController.getUserAcctDetails(email_or_username)
    .then((user) => {
        bcrypt.compare(password, user.password_hash, function(err, result) {
            delete user.password_hash;
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


/**
 * Get looged in user's details
 */
router.get('/user/details', auth.verifyToken, (req, res) => {
    return res.status(200).send({
        status: 1,
        data: res.locals.user
    });
})


/**
 * Get all users
 */
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
router.route('/user/:username')
    // get user with id
    .get((req, res) => {
        const fetchUser = userController.getUserByUsername(req.params.username)
        .then((fetchedUser) => {
            return res.status(200).json(fetchedUser);
        })
        .catch((err) => {
            return res.status(400).send('Error fetching user: ' + err);
        })
    })
    // delete user with id
    .delete((req, res) => {
        const deleteUser = userController.deleteUser(req.params.username)
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


// export user router
module.exports = router;
