const express = require('express');
const router = express('Router');
const auth = require('../middlewares/auth');
const postService = require('../services/post.service');
const userService = require('../services/user.service');

/**
 * @swagger
 * /api/posts/user/posts:
 *    get:
 *      tags: ['Post Controller']
 *      description: Logged in user getting new posts
 *      responses:
 *        200:
 *          description: Success
 */
router.get('/user/posts', auth.verifyToken, async (req, res) => {
  try {
    let usersPosts = await postService.findAllPostsForUser(
      await userService.getCurrentUser(res)
    );
    return res.status(200).send(usersPosts);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Logged in user making new posts
 */
router.post('/user/posts', auth.verifyToken, async (req, res) => {
  try {
    let usersPost = await postService.createNewPost(
      await userService.getCurrentUser(res),
      req.body
    );
    return res.status(200).send(usersPost);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * Logged in user modifying their posts
 */
router.delete(
  '/user/posts/post/:postId',
  auth.verifyToken,
  async (req, res) => {
    try {
      await postService.deletePost(
        await userService.getCurrentUser(res),
        req.params.postId
      );
      return res.status(200).send('Successfully deleted post');
    } catch (err) {
      return res.status(404).send(err);
    }
  }
);

/**
 * Get all Posts
 */
router.get('', async (req, res) => {
  try {
    let allPosts = await postService.findAll();
    return res.status(200).send(allPosts);
  } catch (err) {
    return res.status(404).send(err);
  }
});

/**
 * Get all Posts
 */
router.get('/filter', async (req, res) => {
  try {
    let queryCategory = req.query.category ?? null;
    let queryCondition = req.query.condition ?? null;
    let allPosts = await postService.filterPosts(queryCategory, queryCondition);
    return res.status(200).send(allPosts);
  } catch (err) {
    return res.status(404).send(err);
  }
});

router.get('/search', async (req, res) => {
  try {
    let queryString = req.query.query;
    let posts = await postService.findAll(queryString);
    return res.status(200).send(posts);
  } catch (error) {
    return res.status(404).send('Error fetching posts: ' + error);
  }
});

/**
 * Get all a users post
 */
router.get('/users/user/:username/posts', async (req, res) => {
  try {
    let user = await userService.getUserByUsername(req.params.username);
    let usersPosts = await postService.findAllPostsForUser(user);
    return res.status(200).send(usersPosts);
  } catch (err) {
    return res.status(404).send(err);
  }
});

/**
 * Get one post
 */
router.get('/post/:id', async (req, res) => {
  try {
    let post = await postService.getPost(req.params.id);
    return res.status(200).send(post);
  } catch (err) {
    return res.status(404).send(err);
  }
});

/**
 * Update a post
 */
router.put('/post/:id', async (req, res) => {
  try {
    await postService.updatePostStatus(req.params.id, req.body);
    return res.status(200).send('Successfully updated post');
  } catch (err) {
    return res.status(404).send(err);
  }
});

module.exports = router;
