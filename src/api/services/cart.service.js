const db = require('../models/index');
const Cart = db.carts;
const Post = db.posts;
const helperService = require('./helper.service');

exports.createCart = async (user) => {
    try {
        await user.createCart();
        return Promise.resolve('Created cart successfully');
    } catch (error) {
        let errorOutput = 'Error creating cart: ' + error;
        return helperService.sendRejectedPromiseWith(errorOutput);
    }
}

exports.addToCart = async (user, postId) => {
    try {
        let userCart = await user.getCart();
        if (!userCart) throw `User with id of ${user.id} doesn\'t have a cart`;
        
        let post = await Post.findByPk(postId)
        if(!post)  throw `Post with id of ${postId} does not exist`;
        
        await userCart.addPost(postId);
        return Promise.resolve(`Successfully add post with id ${postId} to cart belonging to user with id of ${user.id}`)
    } catch (error) {
        let errorOutput = 'Error adding to cart: ' + error;
        return helperService.sendRejectedPromiseWith(errorOutput);
    }
}