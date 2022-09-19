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
 *      summary: Get all the currently user's posts
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Posts'
 *        400: 
 *          description: Error getting all the current user's posts
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
 * @swagger
 * /api/posts/user/posts:
 *    post:
 *      tags: ['Post Controller']
 *      summary: Create a post for the current user
 *      requestBody:
 *        description: The post to add to create
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      responses:
 *        200:
 *          description: Success creating post
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        400: 
 *          description: Error creating post
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
 * @swagger
 * /api/posts/post/{postId}:
 *    delete:
 *      tags: ['Post Controller']
 *      summary: Delete the current user's post
 *      parameters:
 *        - $ref: '#/components/parameters/postIdParam'
 *      responses:
 *        200:
 *          description: Successfully deleted the current user's post
 *        404: 
 *          description: Error delete current user's post
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
 * @swagger
 * /api/posts:
 *    get:
 *      tags: ['Post Controller']
 *      summary: Get all posts from the database
 *      responses:
 *        200:
 *          description: Success getting all posts from the database
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Posts'
 *        400: 
 *          description: Error getting all posts from the database
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
 * @swagger
 * /api/posts/filter:
 *    get:
 *      tags: ['Post Controller']
 *      summary: Get all posts from the database that match the filter
 *      parameters:
 *        - $ref: '#/components/parameters/categoryQuery'
 *        - $ref: '#/components/parameters/conditionQuery'
 *      responses:
 *        200:
 *          description: Success getting all posts from the database that match the filter
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Posts'
 *        400: 
 *          description: Error getting all posts from the database that match the filter
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

/**
 * @swagger
 * /api/posts/filter/category/names:
 *    get:
 *      tags: ['Post Controller']
 *      summary: Get all filter options for the category filter
 *      responses:
 *        200:
 *          description: Success getting all filter options for the category filter
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/FilterOptions'
 *        400: 
 *          description: Error getting all filter options for the category filter
 */
router.get('/filter/category/names', async (req, res) => {
  try {
    let categoryNames = postService.getAllCategoryNames();
    return res.status(200).send(categoryNames);
  } catch (err) {
    return res.status(400).send(err);
  }
});

/**
 * @swagger
 * /api/posts/filter/condition/names:
 *    get:
 *      tags: ['Post Controller']
 *      summary: Get all filter options for the condition filter
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/FilterOptions'
 *        400: 
 *          description: Error getting all filter options for the condition filter
 */
router.get('/filter/condition/names', async (req, res) => {
  try {
    let conditionNames = postService.getAllConditionNames();
    return res.status(200).send(conditionNames);
  } catch (err) {
    return res.status(404).send(err);
  }
});

/**
 * @swagger
 * /api/posts/search:
 *    get:
 *      tags: ['Post Controller']
 *      summary: Get all posts that contained the search query param
 *      parameters:
 *        - $ref: '#/components/parameters/searchQuery'
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Posts'
 *        400: 
 *          description: Error getting all filter options for the condition filter
 */
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
 * @swagger
 * /api/posts/user/{username}/posts:
 *    get:
 *      tags: ['Post Controller']
 *      summary: Get all of a user's posts
 *      parameters:
 *        - $ref: '#/components/parameters/usernameParam'
 *      responses:
 *        200:
 *          description: Success getting all of a user's posts
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Posts'
 *        404: 
 *          description: Error getting all of a user's posts
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
 * @swagger
 * /api/posts/post/{postId}:
 *    get:
 *      tags: ['Post Controller']
 *      summary: Get a post
 *      parameters:
 *        - $ref: '#/components/parameters/postIdParam'
 *      responses:
 *        200:
 *          description: Success getting a post
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        404: 
 *          description: Error getting a post
 */
router.get('/post/:postId', async (req, res) => {
  try {
    let post = await postService.getPost(req.params.postId);
    return res.status(200).send(post);
  } catch (err) {
    return res.status(404).send(err);
  }
});

/**
 * @swagger
 * /api/posts/post/{postId}:
 *    update:
 *      tags: ['Post Controller']
 *      summary: Update a post's status
 *      parameters:
 *        - $ref: '#/components/parameters/postIdParam'
 *      responses:
 *        200:
 *          description: Success getting a post
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        404: 
 *          description: Error getting a post
 */
router.put('/post/:postId', async (req, res) => {
  try {
    await postService.updatePostStatus(req.params.postId, req.body);
    return res.status(200).send('Successfully updated post');
  } catch (err) {
    return res.status(404).send(err);
  }
});

module.exports = router;
