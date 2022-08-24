const express = require('express');
const router = express('Router');

// middleware
const logger = require('../middlewares/logger');
router.use(logger.logger);

// setup routes
router.use('/users', require('./user.controller'));
router.use('/posts', require('./post.controller'));
router.use('/cart', require('./cart.controller'));

module.exports = router;
