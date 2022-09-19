const db = require('../models');
const Post = db.posts;
const Transaction = db.transactions;
const helperService = require('./helper.service');

exports.addToTransactions = async user => {
  try {
    let userCart = await user.getCart();
    let posts = await userCart.getPosts();
    if (posts.length == 0) throw 'Cart is empty';

    let transaction = await user.createTransaction({
      dateString: new Date().toLocaleDateString(),
      totalAmount: 0,
      itemCount: 0
    });

    posts.forEach(async post => {
      transaction.totalAmount += post.price;
      transaction.itemCount += 1;
      await transaction.addPost(post);
    });
    await transaction.save();

    posts.forEach(async post => {
      await userCart.removePost(post);
      await userCart.save();
    });

    return await this.getTransaction(transaction.id);
  } catch (error) {
    errorOutput = 'Error creating transaction history: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getFullTransactionHistory = async user => {
  try {
    return await user.getTransactions();
  } catch (error) {
    errorOutput = 'Error getting transaction history: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getTransaction = async transactionId => {
  try {
    let transaction = await Transaction.findByPk(transactionId, {
      include: Post
    });
    if (!transaction)
      throw `Transaction with id ${transactionId} doesn't exist`;
    return transaction;
  } catch (error) {
    errorOutput = 'Error getting transaction history: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};
