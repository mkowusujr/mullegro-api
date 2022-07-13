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
        let username = res.locals.user.username;
        let user = await userController.getUserByUsername(username);
        let usersPosts = await postController.getAllPostsForUser(user);
        return res.status(200).send(usersPosts);
    } catch (err){
        return res.status(400).send(err);
    }
})
.post(auth.verifyToken, async (req, res) => {
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
router.route('/user/posts/post/:postId')
.put(auth.verifyToken, (req, res) => {

})
.delete(auth.verifyToken, async (req, res) => {
    try {
        await postController.deletePost(req.params.postId);
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
router.get('/post/:id', async (req, res) => {
    try {
        let post = await postController.getPost(req.params.id);
        return res.status(200).send(post);
    } catch (err){
        return res.status(400).send(err);
    }
});


module.exports = router;