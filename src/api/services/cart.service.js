const db = require('../models/index');
const Post = db.posts;
const helperService = require('./helper.service');

const verifyUserHasCart = async user => {
  let userCart = await user.getCart();
  if (!userCart) throw `User with id of ${user.id} doesn\'t have a cart`;
};

const verifyPostExists = async postId => {
  let post = await Post.findByPk(postId);
  if (!post) throw `Post with id of ${postId} does not exist`;
};

exports.createCart = async user => {
  try {
    await user.createCart();
    return Promise.resolve('Created cart successfully');
  } catch (error) {
    let errorOutput = 'Error creating cart: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.addToCart = async (user, postId) => {
  try {
    await verifyUserHasCart(user);
    await verifyPostExists(postId);

    let userCart = await user.getCart();
    await userCart.addPost(postId);

    return Promise.resolve(
      `Successfully added post with id ${postId} to cart belonging to user with id of ${user.id}`
    );
  } catch (error) {
    let errorOutput = 'Error adding to cart: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.removeFromCart = async (user, postId) => {
  try {
    await verifyUserHasCart(user);
    await verifyPostExists(postId);

    let userCart = await user.getCart();
    await userCart.removePost(postId);

    return Promise.resolve(
      `Successfully removed post with id ${postId} to cart belonging to user with id of ${user.id}`
    );
  } catch (error) {
    let errorOutput = 'Error adding to cart: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getCartItems = async user => {
  try {
    await verifyUserHasCart(user);
    let userCart = await user.getCart();
    return await userCart.getPosts();
  } catch (error) {
    let errorOutput = "Error gettinf user's cart items: " + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.clearCart = async user => {
  try {
    await verifyUserHasCart(user);
    let userCart = await user.getCart();
    await userCart.removePosts();
    return Promise.resolve('Successfully cleared cart');
  } catch (error) {
    let errorOutput = 'Error clearing cart: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};
