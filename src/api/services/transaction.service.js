const helperService = require('./helper.service');
// const cartService = require('./cart.service');
const db = require('../models');
const post = require('../models/post');
const Post = db.posts;
const Cart = db.carts;
const User = db.users;
const Transaction = db.transactions;
const verifyUserHasCart = async (user) => {
  let userCart = await user.getCart();
  if (!userCart) throw `User with id of ${user.id} doesn\'t have a cart`;
};
exports.addTotranscations = async (user) => {
  try {
    await verifyUserHasCart(user);

    let userCart = await user.getCart();
    let posts = await userCart.getPosts();
    let totalAmount = 0,
      itemCount = 0;

    posts.forEach((post) => {
      totalAmount += post.price;
      itemCount += 1;
    });

    let transaction = await user.createTransaction({
      dateString: new Date().toLocaleDateString(),
      totalAmount: totalAmount,
      itemCount: itemCount
    });
    posts.forEach(async (post) => {
      await transaction.addPost(post);
    });

    return transaction;
  } catch (error) {
    errorOutput = 'Error creating transaction history: ' + error;
    helperService.sendRejectedPromiseWith(errorOutput);
  }
};
