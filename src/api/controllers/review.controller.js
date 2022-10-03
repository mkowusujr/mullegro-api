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
 *          description: Error creating review
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

module.exports = router;
