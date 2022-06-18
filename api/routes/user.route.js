const express = require('express');
const router = express('Router');

// middleware
const logger = require('../middlewares/logger');
router.use(logger.logger);

/**
 * Dealing with all users
 */
router.route('')
    // get all users
    .get((req, res) => {})
    // create user
    .post((req, res) => {});

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