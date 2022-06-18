const express = require('express');
const router = express('Router');

// middleware
const logger = require('../middlewares/logger');
router.use(logger.logger);

router.route('')
    .get((req, res) => {
        res.status(200).json({'greeting': 'Getting Users'});
    })
    .post((req, res) => {
        res.status(200).json(req.body);
    });

module.exports = router;