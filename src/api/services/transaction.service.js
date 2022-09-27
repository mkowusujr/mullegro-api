const db = require('../models');
const Post = db.posts;
const Transaction = db.transactions;
const helperService = require('./helper.service');

/**
 * Adds a transaction to the user's transaction history
 * @param {User} user The User data object
 * @returns The Transaction added to the user's transaction history
 */
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

/**
 * Gets the user's full transaction history
 * @param {User} user The User data object
 * @returns The user's transaction object
 */
exports.getFullTransactionHistory = async user => {
  try {
    return await user.getTransactions({include: Post});
  } catch (error) {
    errorOutput = 'Error getting transaction history: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

/**
 * Gets a transaction from the user's transaction history
 * @param {number} transactionId The transaction's id
 * @returns The fetched transaction
 */
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
