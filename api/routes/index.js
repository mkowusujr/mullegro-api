const express = require('express');
const router = express('Router');

// middleware
const logger = require('../middlewares/logger');
router.use(logger.logger);

// setup routes
router.use('/api/users', require('./user.route'));
router.use('/api/posts', require('./post.route'));
router.use('/api/cart', require('./cart.route'));
router.use('/api/transactions', require('./transaction.route'));

module.exports = router;
