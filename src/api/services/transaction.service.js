const helperService = require('./helper.service');

exports.addTotranscations = async (user) => {
  try {
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
