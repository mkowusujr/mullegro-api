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

    return Promise.resolve({
      message: `Successfully added post with id ${postId} to cart belonging to user with id of ${user.id}`
    });
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

    let post = await Post.findByPk(postId);
    await userCart.removePost(postId);
    await userCart.save();

    return Promise.resolve({
      message: `Successfully removed post with id ${postId} to cart belonging to user with id of ${user.id}`
    });
  } catch (error) {
    let errorOutput = 'Error adding to cart: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getCart = async user => {
  try {
    await verifyUserHasCart(user);
    let userCart = await user.getCart({
      include: Post
    });

    userCart.itemCount = await userCart.posts.length;
    userCart.totalAmount = 0;
    await userCart.posts.forEach(post => {
      userCart.totalAmount += post.price;
    });

    await userCart.save();
    return userCart;
  } catch (error) {
    let errorOutput = "Error getting user's cart: " + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.clearCart = async user => {
  try {
    await verifyUserHasCart(user);
    let userCart = await user.getCart();

    let posts = await userCart.getPosts();
    posts.forEach(async post => await userCart.removePost(post));

    await userCart.save();
    return Promise.resolve({ message: 'Successfully cleared cart' });
  } catch (error) {
    let errorOutput = 'Error clearing cart: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};
