const express = require('express');
const router = express('Router');

const userController = require('../controllers/user.controller');

router.route('')
    .get(async (req, res) => {
        
        res.status(200).send('Welcome to the Mullegro Api')
    });

module.exports = router;
