const db = require('../models');
const Post = require('../models/post')


/**
 * Get Logged in users posts
 * @param {User Obj} currentUser The current User
 */
exports.getAllPostsForUser = async (currentUser) => {
    try {
        return await currentUser.getPosts();
    } catch (err) {
        let errOutput = 'Error getting user\'s posts: ' + err;
        console.error(errOutput);
        return Promise.reject(errOutput);
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
        console.error(errOutput);
        return Promise.reject(errOutput);
    }
    
};


/**
 * Logged in user updating one of their posts
 */
exports.updatePost = async (currentUser, postId, updatedPost) => {
    try {
        return await Post.Update(updatedPost, {where: {
            id: postId,
            userId: currentUser.id
        }});
    } catch (err) {
        let errOutput = 'Error updating post: ' + err;
        console.error(errOutput);
        return Promise.reject(errOutput);
    }
};


/**
 * Update a Post's status
 * @param {number} postId 
 * @param {string} postStatus 
 */
exports.updatePostStatus = async (postId, postStatus) => {
    try {
        await Post.Update({status: postStatus}, {where: {id: postId}})
    } catch (err) {
        let errOutput = 'Error updating post: ' + err;
        console.error(errOutput);
        return Promise.reject(errOutput);
    }
};


/**
 * Logged in user deleting one of their posts
 */
exports.deletePost = async (currentUser, postId) => {
    try {
        await Post.destroy({where: {
                id: postId,
                userId: currentUser.id
            }});
        return Promise.resolve();
    } catch (err) {
        let errOutput = 'Error deleting post: ' + err;
        console.error(errOutput);
        return Promise.reject(errOutput);
    }
};


/**
 * Get all Posts
 */
exports.getAllPosts = async () => {
    try {
        return await Post.findAll();
    } catch (err) {
        let errOutput = 'Error getting posts: ' + err;
        console.error(errOutput);
        return Promise.reject(errOutput);
    }
};


/**
 * Get one post
 */
exports.getPost = async (postId) => {
    try {
        return await Post.findByPk(postId);
    } catch (err) {
        let errOutput = 'Error getting post: ' + err;
        console.error(errOutput);
        return Promise.reject(errOutput);
    }
};