const db = require('../models');
const Post = require('../models/post')


/**
 * Get loggin in users posts
 */
exports.getCurrentUserPosts = async (currentUser) => {
    return await currentUser.getPosts()
    .then((posts) => {
        return posts;
    })
    .catch((err) => console.error(err));
};


/**
 * Loggin in user create a new post
 */
exports.createNewPost = async (currentUser, newPost) => {
    let createdPost = await currentUser.createPost(newPost);
    return createdPost;
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
exports.getPost = async () => {

};