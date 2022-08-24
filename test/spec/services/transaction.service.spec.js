const transactionService = require('../../../src/api/services/transaction.service');
const userService = require('../../../src/api/services/user.service');
const cartService = require('../../../src/api/services/cart.service');

describe('Transaction Service', () => {
  it('should be created', () => {
    expect(transactionService).toBeTruthy();
  });

  let db,
    Post,
    dummyUser,
    dummyPosts,
    dateString = new Date().toLocaleDateString();

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      Post = db.posts;
      await db.sequelize.sync({ force: true });
      spyOn(console, 'error');

      dummyUser = await userService.createUser({
        name: 'Dummy User',
        address: 'USA',
        username: 'dummy_username',
        email: 'dummay@email.com',
        password: 'dummyPassword'
      });

      await Post.create({
        title: 'Dummy Post',
        price: 100.0,
        description: 'This is an instrument',
        condition: 'Good',
        address: 'USA',
        type: 'Clarinet',
        status: 'Not Sold'
      });

      await Post.create({
        title: 'Dummy Post 2',
        price: 100.0,
        description: 'This is an instrument',
        condition: 'Mid',
        address: 'CANADA',
        type: 'Clarinet',
        status: 'Not Sold'
      });
      await Post.create({
        title: 'Dummy Post3',
        price: 100.0,
        description: 'This is an instrument',
        condition: 'Good',
        address: 'JAPAN',
        type: 'Clarinet',
        status: 'Not Sold'
      });

      dummyPosts = await Post.findAll();

      let userCart = await dummyUser.getCart();

      dummyPosts.forEach(async (post) => {
        await userCart.addPost(post.id);
      });
    } catch (error) {
      fail(error);
    }
  });

  describe('AddTotranscations', () => {
    it("adds a transaction to a user's transaction history", async () => {
      try {
        let transaction = await transactionService.addTotranscations(dummyUser);
        let transactionPosts = await transaction.getPosts();
        let itemCount = 3,
          totalAmount = 300;
        expect(transaction.itemCount).toEqual(itemCount);
        expect(transaction.totalAmount).toEqual(totalAmount);
        expect(transaction.dateString).toEqual(dateString);
        expect(transactionPosts.length).toEqual(3);
      } catch (error) {
        fail(error);
      }
    });
    xit('throws an error if there is an issue', async () => {
      try {
        let dummyInvalidUser = {};
        let response = await transactionService.addTotranscations(
          dummyInvalidUser
        );
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  xdescribe('GetFullTransactionHistory', () => {
    it("gets all a user's transactions", async () => {
      try {
        dummyPosts.forEach(async (post) => {
          await cartService.addToCart(dummyUser, post.id);
          await transactionService.addTotranscations(dummyUser);
        });

        let transactions = await transactionService.getFullTransactionHistory(
          dummyUser
        );

        expect(transactions.length).toEqual(3);
        transactions.forEach((transaction) => {
          expect(transaction.dateString).toBeTruthy();
          expect(transaction.totalAmount).toBeTruthy();
          expect(transaction.itemCount).toBeTruthy();
        });
      } catch (error) {
        fail(error);
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let dummyInvalidUser = {};
        let response = await transactionService.getFullTransactionHistory(
          dummyInvalidUser
        );
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  xdescribe('GetTransaction', () => {
    it("gets one transcation from a user's transaction history", async () => {
      try {
        dummyPosts.forEach(async (post) => {
          await cartService.addToCart(dummyUser, post.id);
          await transactionService.addTotranscations(dummyUser);
        });
        let transactionId = 2;
        let transaction = await transactionService.GetTransaction(
          dummyUser,
          transactionId
        );

        expect(transaction.id).toEqual(transactionId);
        expect(transaction.dateString).toBeTruthy();
        expect(transaction.totalAmount).toBeTruthy();
        expect(transaction.itemCount).toBeTruthy();
      } catch (error) {
        fail(error);
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let dummyInvalidUser = {},
          invalidTransactionId = 404;
        let response = await transactionService.GetTransaction(
          dummyInvalidUser,
          invalidTransactionId
        );
        if (response || !response) fail("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });
});
