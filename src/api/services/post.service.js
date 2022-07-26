const db = require('../models');
const Post = db.posts;

const sendRejectedPromise = (errOutput) => {
    console.error(errOutput);
    return Promise.reject(errOutput);
}

/**
 * Get Logged in users posts
 * @param {User Obj} currentUser The current User
 */
exports.getAllPostsForUser = async (currentUser) => {
    try {
        return await currentUser.getPosts();
    } catch (err) {
        let errOutput = 'Error getting user\'s posts: ' + err;
        return sendRejectedPromise(errOutput);
    }
}


/**
 * Logged in user create a new post
 */
exports.createNewPost = async (currentUser, newPost) => {
    try {
        return await currentUser.createPost(newPost);
    } catch (err) {
        let errOutput = 'Error creating post: ' + err;
        return sendRejectedPromise(errOutput);
    }
};


/**
 * Update a Post's status
 * @param {number} postId 
 * @param {{status: string}} postStatus 
 */
exports.updatePostStatus = async (postId, postStatus) => {
    try {
        let post = await Post.update({status: postStatus.status}, {where: {id: postId}});
        if (!post) throw `Post with id of ${postId} does not exist`
        return await Post.findByPk(postId);
    } catch (err) {
        let errOutput = 'Error updating post: ' + err;
        return sendRejectedPromise(errOutput);
    }
};


/**
 * Logged in user deleting one of their posts
 */
exports.deletePost = async (currentUser, postId) => {
    try {
        await Post.destroy({where: {id: postId, userId: currentUser.id}});
        return Promise.resolve('Deleted successfully');
    } catch (err) {
        let errOutput = 'Error deleting post: ' + err;
        return sendRejectedPromise(errOutput);
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
        return sendRejectedPromise(errOutput);
    }
};


/**
 * Get one post
 */
exports.getPost = async (postId) => {
    try {
        let post = await Post.findByPk(postId);
        if (!post) throw `Post with id of ${postId} does not exist`
        return post
    } catch (err) {
        let errOutput = 'Error getting post: ' + err;
        return sendRejectedPromise(errOutput);
    }
};