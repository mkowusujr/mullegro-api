const express = require('express');
const router = express('Router');

const userController = require('../controllers/user.controller');

router.route('')
    .get(async (req, res) => {
        const user = await userController.createUser({
            name: 'Jane',
            location: 'Feeder Ln',
            email: 'somebody@something.com',
            password_hash: 'password_hash'
        });
        res.status(200).send('Hello World')
    });

module.exports = router;
