const db = require('../models');
const Review = db.reviews;
const Post = db.posts;
const helperService = require('./helper.service');
const userService = require('./user.service');

/**
 * Creates a new review
 * @param {User} user The user making the review
 * @param {Review} review The review being made
 * @returns The created review
 */
exports.createReview = async (user, review) => {
  try {
    return await user.createReview(review);
  } catch (error) {
    let errorOutput = 'Error creating review: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Fetches the Review matching the specified id
 * @param {number} reviewId The review identifier
 * @returns The Review matching the id
 */
exports.getReview = async reviewId => {
  try {
    let review = await Review.findByPk(reviewId);
    if (!review) throw `Review with ${reviewId} doesn't exist`;
    return review;
  } catch (error) {
    let errorOutput = 'Error fetching review: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Updates an existing review
 * @param {User} user The user making the review
 * @param {number} reviewId The id of the review being modified
 * @param {Review} updatedReviewDetails The updated review details
 * @returns The updated review
 */
exports.updateReview = async (user, reviewId, updatedReviewDetails) => {
  try {
    let targetReview = await Review.findByPk(reviewId);

    if (targetReview.userId != user.id) {
      throw `This review doesn't belong to this User`;
    }

    targetReview.rating = updatedReviewDetails.rating;
    targetReview.description = updatedReviewDetails.description;
    targetReview.save();

    return await Review.findByPk(reviewId);
  } catch (error) {
    let errorOutput = 'Error updating review: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Gets all the reviews that the specified user
 * has made.
 * @param {string} username The user's username
 * @returns A list of reviews a user has made
 */
exports.getAllReviewsMadeByUser = async username => {
  try {
    let user = await userService.getUserByUsername(username);
    return user.getReviews();
  } catch (error) {
    let errorOutput = 'Error fetching reviews: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Gets all the reviews on posts made by the specified user
 * has made.
 * @param {string} username The user's username
 * @returns A list of reviews a user has made
 */
exports.getAllReviewsFromPostsMadeByUser = async username => {
  try {
    let user = await userService.getUserByUsername(username);
    let reviews = [];
    let postsByUser = await user.getPosts();

    for (let i = 0; i < postsByUser.length; i++) {
      reviews.push(await postsByUser[i].getReview());
    }

    return reviews;
  } catch (error) {
    let errorOutput = 'Error fetching review: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Gets all the reviews that the specified user
 * has made.
 * @param {string} username The user's username
 * @returns The gnerates stats for a user
 */
exports.generateStatsForUser = async username => {
  try {
    let user = await userService.getUserByUsername(username);

    let reviewsOnPostsByUser = await this.getAllReviewsFromPostsMadeByUser(
      username
    );

    let totalRatings = 0;
    reviewsOnPostsByUser.forEach(review => {
      totalRatings += review.rating;
    });

    let soldPostsBelongingToUser = await Post.findAll({
      where: {
        userId: user.id,
        status: 'Sold'
      }
    });

    let stats = {
      averageRating: totalRatings / reviewsOnPostsByUser.length,
      amountOfPostsSold: soldPostsBelongingToUser.length
    };

    return stats;
  } catch (error) {
    let errorOutput = 'Error generating stats for user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};
