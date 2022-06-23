const express = require('express');
const router = express('Router');
const auth = require('../middlewares/auth');

/**
 * Logged in user getting and making new posts
 */
router.route('/users/user/posts')
.get(auth.verifyToken, (req, res) => {

})
.post(auth.verifyToken, (req, res) => {

});


/**
 * Logged in user modifying their posts
 */
router.route('/users/user/posts/:postId')
.put(auth.verifyToken, (req, res) => {

})
.delete(auth.verifyToken, (req, res) => {

});


/**
 * Get all Posts
 */
router.get('/posts', (req, res) =>{

});


/**
 * Get all a users post
 */
router.get('users/user/:username/posts', (req, res) => {

})


/**
 * Get one post
 */
router.get('/posts/post/:id', (req, res) => {

});


module.exports = router;