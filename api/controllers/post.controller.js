const db = require('../models');
const Post = require('../models/post')


/**
 * Get loggin in users posts
 */
exports.getCurrentUserPosts = async (currentUser) => {
    try {
        let posts = await currentUser.getPosts();
        return posts;
    } catch (err) {
        let errOutput = 'Error getting user\'s posts: ' + err;
        console.error(errOutput);
        return Promise.reject(errOutput);
    }
};


/**
 * Loggin in user create a new post
 */
exports.createNewPost = async (currentUser, newPost) => {
    try {
        let createdPost = await currentUser.createPost(newPost);
        return createdPost;
    } catch (err) {
        let errOutput = 'Error creating post: ' + err;
        console.error(errOutput);
        return Promise.reject(errOutput);
    }
    
};


/**
 * Loggin in user updating one of their posts
 */
exports.updatePost = async (currentUser, postId, updatedPost) => {

};


/**
 * Loggin in user deleting one of their posts
 */
exports.deletePost = async (currentUser, postId) => {

};


/**
 * Get all Posts
 */
exports.getPosts = async () => {

};


/**
 * Get one post
 */
exports.getPost = async (postId) => {

};