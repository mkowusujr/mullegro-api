const helperService = require('./helper.service');

exports.addTotranscations = async (user) => {
  try {
    let userCart = await user.getCart();
    let posts = await userCart.getPosts();

    let transaction = await user.createTransaction({
      dateString: new Date().toLocaleDateString(),
      totalAmount: 0,
      itemCount: 0
    });

    posts.forEach(async (post) => {
      transaction.totalAmount += post.price;
      transaction.itemCount += 1;
      await transaction.addPost(post);
    });
    await userCart.removePosts();
    await transaction.save();
    return transaction;
  } catch (error) {
    errorOutput = 'Error creating transaction history: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};

exports.getFullTransactionHistory = async (user) => {
  try {
    return await user.getTransactions();
  } catch (error) {
    errorOutput = 'Error getting transaction history: ' + error;
    return helperService.sendRejectedPromiseWith(errorOutput);
  }
};
