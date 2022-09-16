const helperService = require('./helper.service');
const db = require('../models');
const Post = db.posts;
const { readFileSync } = require('fs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * Get Logged in users posts
 * @param {User Obj} currentUser The current User
 */
exports.findAllPostsForUser = async currentUser => {
  try {
    return await currentUser.getPosts();
  } catch (err) {
    let errOutput = "Error getting user's posts: " + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Logged in user create a new post
 */
exports.createNewPost = async (currentUser, newPost) => {
  try {
    return await currentUser.createPost(newPost);
  } catch (err) {
    let errOutput = 'Error creating post: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Update a Post's status
 * @param {number} postId
 * @param {{status: string}} postStatus
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
 * Logged in user deleting one of their posts
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
 * Get all Posts
 */
exports.findAll = async searchQuery => {
  try {
    if (!searchQuery) return await Post.findAll();
    return await Post.findAll({
      where: {
        title: {
          [Op.like]: `%${searchQuery}%`
        }
      }
    });
  } catch (err) {
    let errOutput = 'Error getting posts: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

/**
 * Get one post
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
 *
 * @param {*} category
 * @returns
 */
const getPostsOfCategory = async category => {
  try {
    return await Post.findAll({ where: { category: category } });
  } catch (error) {
    let errOutput = 'Error getting posts of category: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

exports.getAllCategoryNames = () => {
  const filename = './mock-data-services/instruments-list.txt';
  const contents = readFileSync(filename, 'utf-8');
  let instrumentsList = JSON.parse(contents);
  return instrumentsList.sort();
};

const getPostsOfCondition = async condition => {
  try {
    return Post.findAll({ where: { condition: condition } });
  } catch (error) {
    let errOutput = 'Error getting posts by condition: ' + err;
    return helperService.sendRejectedPromiseWith(errOutput);
  }
};

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
