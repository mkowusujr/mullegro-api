const express = require('express');
const router = express('Router');
const auth = require('../middlewares/auth');
const postController = require('../controllers/post.controller');
const userController = require('../controllers/user.controller');


/**
 * Logged in user getting and making new posts
 */
router.route('/user/posts')
.get(auth.verifyToken, async (req, res) => {
    try {
        let usersPosts = await postController.getAllPostsForUser(
            await userController.getCurrentUser(res)
        );
        return res.status(200).send(usersPosts);
    } catch (err){
        return res.status(400).send(err);
    }
})
.post(auth.verifyToken, async (req, res) => {
    try {
        let usersPost = await postController.createNewPost(
            await userController.getCurrentUser(res), req.body
        );
        return res.status(200).send(usersPost);
    }
    catch (err){
        return res.status(400).send(err);
    }
});


/**
 * Logged in user modifying their posts
 */
router.route('/user/posts/post/:postId')
.put(auth.verifyToken, async (req, res) => {
    try {
        await postController.updatePost(
            await userController.getCurrentUser(res), 
            req.params.postId, 
            req.body
        );
        return res.status(200).send('Successfully updated post');
    } catch (err) {
        return res.status(400).send(err);
    }
})
.delete(auth.verifyToken, async (req, res) => {
    try {
        await postController.deletePost(
            await userController.getCurrentUser(res), req.params.postId
        );
        return res.status(200).send('Successfully deleted post');
    } catch (err){
        return res.status(400).send(err);
    }
});


/**
 * Get all Posts
 */
router.get('', async (req, res) =>{
    try {
        let allPosts = await postController.getAllPosts();
        return res.status(200).send(allPosts);
    } catch (err){
        return res.status(400).send(err);
    }
});


/**
 * Get all a users post
 */
router.get('users/user/:username/posts', async (req, res) => {
    try {
        let user = await userController.getUserByUsername(req.params.username);
        let usersPosts = await postController.getAllPostsForUser(user);
        return res.status(200).send(usersPosts);
    } catch (err){
        return res.status(400).send(err);
    }
})


/**
 * Get one post
 */
router.route('/post/:id')
.get(async (req, res) => {
    try {
        let post = await postController.getPost(req.params.id);
        return res.status(200).send(post);
    } catch (err){
        return res.status(400).send(err);
    }
})
.put(async (req, res) => {
    try {
        await postController.updatePostStatus(req.params.id, req.body);
        return res.status(200).send('Successfully updated post');
    } catch (err){
        return res.status(400).send(err);
    }
})


module.exports = router;