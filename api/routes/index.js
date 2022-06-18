const express = require('express');
const router = express('Router');

// setup routes
router.use('/users', require('./user.route'));
router.use('/posts', require('./post.route'));
router.use('/cart', require('./cart.route'));
router.use('/transactions', require('./transaction.route'));

module.exports = router;
