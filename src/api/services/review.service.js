const db = require('../models');
const Review = db.reviews;
const Post = db.posts;
const helperService = require('./helper.service');
const userService = require('./user.service');
const postService = require('./post.service');

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
 * Gets the review belonging to the specified post
 * @param {number} postId The post identifier
 * @returns The review belonging to post
 */
exports.getRevieBelongingPost = async postId => {
  try {
    let post = await postService.getPost(postId);
    if (!post) throw `Post with id of ${postId} does not exist`
    return await post.getReview();
  } catch (error) {
    let errorOutput = 'Error fetching review: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
}

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
    let emptyReview = {
    rating: 0
    }
    let reviews = [];
    let postsByUser = await user.getPosts();

    for (let i = 0; i < postsByUser.length; i++) {
      let review = await postsByUser[i].getReview();
      if (review) {
        reviews.push(review);
      }
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
    let generatedStats = {
      averageRating: 0,
      totalPostsMade: 0,
      totalPostsSold: 0,
      totalPostsAvailable: 0
    }

    let user = await userService.getUserByUsername(username);

    let reviewsOnPostsByUser = await this.getAllReviewsFromPostsMadeByUser(
      username
    );

    let allPostsBelongingToUser = await user.getPosts();

    let soldPostsBelongingToUser = await Post.findAll({
      where: {
        userId: user.id,
        status: 'Sold'
      }
    });

    let availablePostsBelongingToUser = await Post.findAll({
      where: {
        userId: user.id,
        status: 'Available'
      }
    });

    let ratingSum = 0;
    let  totalRatings = 0;
    if (reviewsOnPostsByUser && reviewsOnPostsByUser.length != 0){
      reviewsOnPostsByUser.forEach(review => {
        ratingSum += review.rating;
        totalRatings += 1;
      });
    }
    
    let averageRating = totalRatings == 0? 0 : (ratingSum / totalRatings);

    generatedStats = {
      averageRating: averageRating,
      totalPostsMade: allPostsBelongingToUser.length ?? 0,
      totalPostsSold: soldPostsBelongingToUser.length ?? 0,
      totalPostsAvailable: availablePostsBelongingToUser.length ?? 0
    }
    
    return generatedStats;
  } catch (error) {
    let errorOutput = 'Error generating stats for user: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};
