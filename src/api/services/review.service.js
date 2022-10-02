const db = require('../models');
const Review = db.reviews;
const helperService = require('./helper.service');

/**
 * Create a new review
 * @param {User} user The user making the review
 * @param {number} postId The id of the post being reviewed
 * @param {Review} review The review being made
 * @returns The created review
 */
exports.createReview = (user, postId, review) => {
  try {
  } catch (error) {
    let errOutput = 'Error creating review: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Fetches the Review matching the specified id
 * @param {number} reviewId The review identifier
 * @returns The Review matching the id
 */
exports.getReview = reviewId => {
  try {
  } catch (error) {
    let errOutput = 'Error fetching review: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Update an existing review
 * @param {User} user The user making the review
 * @param {number} postId The id of the post being reviewed
 * @param {Review} review The review being made
 * @returns The updated review
 */
exports.updateReview = (user, postId, review) => {
  try {
  } catch (error) {
    let errOutput = 'Error updating review: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Gets all the reviews that the specified user
 * has made.
 * @param {string} username The user's username
 * @returns A list of reviews a user has made
 */
exports.getAllReviewsMadeByUser = username => {
  try {
  } catch (error) {
    let errOutput = 'Error fetching reviews: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Gets all the reviews on posts made by the specified user
 * has made.
 * @param {string} username The user's username
 * @returns A list of reviews a user has made
 */
exports.getAllReviewsOnPostsByUser = username => {
  try {
  } catch (error) {
    let errOutput = 'Error fetching review: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Gets all the reviews that the specified user
 * has made.
 * @param {string} username The user's username
 * @returns The gnerates stats for a user
 */
exports.generateStatsForUser = username => {
  try {
  } catch (error) {
    let errOutput = 'Error generating stats for user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};
