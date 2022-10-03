const helperService = require('./helper.service');
const db = require('../models');
const Post = db.posts;
const { readFileSync } = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Gets all the posts belonging to the logged in user
 * @param {User} user The User data object
 * @param {boolean} isCurrentUser Whether or not the user is the
 * the current logged in user
 * @returns All the posts belonging to the logged in user
 */
exports.findAllPostsForUser = async (user, isCurrentUser) => {
  try {
    return isCurrentUser
      ? await user.getPosts()
      : await user.getPosts({ where: { status: 'Available' } });
  } catch (err) {
    let errOutput = "Error getting user's posts: " + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Creates a new post from the current user
 * @param {User} currentUser The User data object
 * @param {Post} newPost The Post data object
 * @returns The created post
 */
exports.createNewPost = async (currentUser, newPost) => {
  try {
    newPost.status = 'Available';
    return await currentUser.createPost(newPost);
  } catch (err) {
    let errOutput = 'Error creating post: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Update a Post's status
 * @param {number} postId The post's id
 * @param {{status: string}} postStatus The post's new status
 * @returns THe updated Post
 */
exports.updatePostStatus = async (postId, postStatus) => {
  try {
    let post = await Post.update(
      { status: postStatus.status },
      { where: { id: postId } }
    );
    if (post[0] == 0) throw `Post with id of ${postId} does not exist`;
    return await Post.findByPk(postId);
  } catch (err) {
    let errOutput = 'Error updating post: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Deletes a user's post
 * @param {User} currentUser The User data object
 * @param {Post} postId The post's id
 * @returns  A message about whether the function executed succesfully
 */
exports.deletePost = async (currentUser, postId) => {
  try {
    let post = await Post.findOne({
      where: { id: postId, userId: currentUser.id }
    });
    if (!post) throw `Post with id of ${postId} does not exist`;
    await post.destroy();
    return Promise.resolve('Deleted successfully');
  } catch (err) {
    let errOutput = 'Error deleting post: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Finds all the posts whose title matches the search query if there is
 * a query, or all the posts in the database if otherwise
 * @param {string} searchQuery The query to use to search for posts with
 * @returns A list of Post objects
 */
exports.findAll = async searchQuery => {
  try {
    if (!searchQuery)
      return await Post.findAll({ where: { status: 'Available' } });
    return await Post.findAll({
      where: {
        title: {
          [Op.like]: `%${searchQuery}%`
        },
        status: 'Available'
      }
    });
  } catch (err) {
    let errOutput = 'Error getting posts: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Gets a post by id
 * @param {number} postId The post's id
 * @returns The fetched Post
 */
exports.getPost = async postId => {
  try {
    let post = await Post.findByPk(postId);
    if (!post) throw `Post with id of ${postId} does not exist`;
    return post;
  } catch (err) {
    let errOutput = 'Error getting post: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Gets all the posts that match the category
 * @param {string} category The post's category
 * @returns A list of posts that match the category
 */
const getPostsOfCategory = async category => {
  try {
    return await Post.findAll({
      where: {
        category: category,
        status: 'Available'
      }
    });
  } catch (error) {
    let errOutput = 'Error getting posts of category: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Gets all the category options
 * @returns A list of the category options
 */
exports.getAllCategoryNames = () => {
  const filename = './mock-data-services/instruments-list.txt';
  const contents = readFileSync(filename, 'utf-8');
  let instrumentsList = JSON.parse(contents);
  return instrumentsList.sort();
};

/**
 * Gets all the posts that match the condition
 * @param {string} condition The post's condition
 * @returns A list of posts that match the condition
 */
const getPostsOfCondition = async condition => {
  try {
    return Post.findAll({
      where: {
        condition: condition,
        status: 'Available'
      }
    });
  } catch (error) {
    let errOutput = 'Error getting posts by condition: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Gets all the condition options
 * @returns A list of the condition options
 */
exports.getAllConditionNames = () => {
  const conditionOptions = [
    'New',
    'Renewed',
    'Used - Like New',
    'Used - Very Good',
    'Used - Good',
    'Used - Acceptable'
  ];
  return conditionOptions;
};

/**
 * Filters out a list of posts
 * @param {string} queryCategory The post's category
 * @param {string} queryCondition The post's status
 * @returns The list of filtered posts
 */
exports.filterPosts = async (queryCategory, queryCondition) => {
  try {
    let filteredPosts = [];

    let postsByCategory = await getPostsOfCategory(queryCategory);

    let postsByCondition = await getPostsOfCondition(queryCondition);
    filteredPosts.push(postsByCondition);

    filteredPosts = [...postsByCategory, ...postsByCondition];
    return filteredPosts;
  } catch (error) {
    let errOutput = 'Error filtering posts: ' + error;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};
