const express = require('express');
const router = express('Router');
const userService = require('../services/user.service');
const reviewService = require('../services/review.service');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /api/reviews/user/reviews:
 *    post:
 *      tags: ['Review Controller']
 *      summary: Creates a new review
 *      requestBody:
 *        description: The review to create
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Review'
 *      responses:
 *        200:
 *          description: Successfully added created review
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 *        400:
 *          description: Error creating review
 */
router.post('/user/reviews', auth.verifyToken, async (req, res) => {
  try {
    let currentUser = await userService.getCurrentUser(res);
    let review = req.body;
    let createdReview = await reviewService.createReview(currentUser, review);
    res.status(200).send(createdReview);
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 * /api/reviews/review/{reviewId}:
 *    post:
 *      tags: ['Review Controller']
 *      summary: Fetches the Review matching the specified id
 *      parameters:
 *        - $ref: '#/components/parameters/reviewIdParam'
 *      responses:
 *        200:
 *          description: Successfully added created review
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 *        400:
 *          description: Error fetching review
 */
router.get('/review/:reviewId', async (req, res) => {
  try {
    let reviewId = req.params.reviewId;
    let fetchedReview = await reviewService.getReview(reviewId);
    res.status(200).send(fetchedReview);
  } catch (error) {
    res.status(404).send(error);
  }
});

/**
 * @swagger
 * /api/reviews/post/{postId}/review:
 *    post:
 *      tags: ['Review Controller']
 *      summary: Fetches the Review belonging to the specified post
 *      parameters:
 *        - $ref: '#/components/parameters/postIdParam'
 *      responses:
 *        200:
 *          description: Successfully added created review
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 *        400:
 *          description: Error fetching review
 */
 router.get('/post/:postId/review', async (req, res) => {
  try {
    let postId = req.params.postId;
    let fetchedReview = await reviewService.getRevieBelongingPost(postId);
    res.status(200).send(fetchedReview);
  } catch (error) {
    res.status(404).send(error);
  }
});

/**
 * @swagger
 * /api/reviews/review/{reviewId}:
 *    put:
 *      tags: ['Review Controller']
 *      summary: Updates an existing review
 *      parameters:
 *        - $ref: '#/components/parameters/reviewIdParam'
 *      responses:
 *        200:
 *          description: Successfully added updated the review
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Review'
 *        400:
 *          description: Error updating review
 */
router.put('/review/:reviewId', auth.verifyToken, async (req, res) => {
  try {
    let currentUser = await userService.getCurrentUser(res);
    let reviewId = req.params.reviewId;
    let updatedReviewDetails = req.body;
    let updateReview = await reviewService.updateReview(
      currentUser,
      reviewId,
      updatedReviewDetails
    );
    res.status(200).send(updateReview);
  } catch (error) {
    res.status(404).send(error);
  }
});

/**
 * @swagger
 * /api/reviews/user/${username}/posts/reviews:
 *    post:
 *      tags: ['Review Controller']
 *      summary: Gets all the reviews on posts made by the specified user has made
 *      parameters:
 *        - $ref: '#/components/parameters/usernameParam'
 *      responses:
 *        200:
 *          description: Successfully added fetched reviews
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Reviews'
 *        404:
 *          description: Error fetching reviews
 */
router.get('/user/:username/posts/reviews', async (req, res) => {
  try {
    let username = req.params.username;
    let reviews = await reviewService.getAllReviewsFromPostsMadeByUser(
      username
    );
    res.status(200).send(reviews);
  } catch (error) {
    res.status(404).send(error);
  }
});

/**
 * @swagger
 * /api/reviews/user/${username}/reviews:
 *    post:
 *      tags: ['Review Controller']
 *      summary: Gets all the reviews that the specified user has made
 *      parameters:
 *        - $ref: '#/components/parameters/usernameParam'
 *      responses:
 *        200:
 *          description: Successfully added fetched reviews
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Reviews'
 *        404:
 *          description: Error fetching reviews
 */
router.get('/user/:username/reviews', async (req, res) => {
  try {
    let username = req.params.username;
    let reviews = await reviewService.getAllReviewsMadeByUser(username);
    res.status(200).send(reviews);
  } catch (error) {
    res.status(404).send(error);
  }
});

/**
 * @swagger
 * /api/reviews/user/${username}/stats:
 *    post:
 *      tags: ['Review Controller']
 *      summary: should generate the stats for a user
 *      parameters:
 *        - $ref: '#/components/parameters/usernameParam'
 *      responses:
 *        200:
 *          description: Successfully added fetched reviews
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Stats'
 *        404:
 *          description: Error fetching reviews
 */
router.get('/user/:username/stats', async (req, res) => {
  try {
    let username = req.params.username;
    let stats = await reviewService.generateStatsForUser(username);
    res.status(200).send(stats);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
