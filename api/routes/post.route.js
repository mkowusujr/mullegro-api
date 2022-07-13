const express = require('express');
const router = express('Router');
const auth = require('../middlewares/auth');
const user = require('../models/user');
const postController = require('../controllers/post.controller');
const userController = require('../controllers/user.controller');
/**
 * Logged in user getting and making new posts
 */
router.route('/user/posts')
.get(async (req, res) => {
    try {
        let user = await userController.getUserByUsername('www');
        let usersPosts = await postController.getCurrentUserPosts(user);
        return res.status(200).send(usersPosts);
    } catch (err){
        return res.status(400).send(err);
    }
})
.post(async (req, res) => {
    try {
        let user = await userController.getUserByUsername('www');
        let usersPost = await postController.createNewPost(user, req.body);
        return res.status(200).send(usersPost);
    }
    catch (err){
        return res.status(400).send(err);
    }
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