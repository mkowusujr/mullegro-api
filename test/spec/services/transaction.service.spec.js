const transactionService = require('../../../src/api/services/transaction.service');
const userService = require('../../../src/api/services/user.service');
const cartService = require('../../../src/api/services/cart.service');

describe('Transaction Service', () => {
  it('should be created', () => {
    expect(transactionService).toBeTruthy();
  });

  let db, Post, dummyUser, dummyPosts;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      Post = db.posts;
      await db.sequelize.sync({ force: true });
      jest.spyOn(console, 'error').mockImplementation(jest.fn());;

      dummyUser = await userService.createUser({
        name: 'Dummy User',
        address: 'USA',
        username: 'dummy_username',
        email: 'dummay@email.com',
        password: 'dummyPassword'
      });

      await Post.bulkCreate(
        [
          {
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          },
          {
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Acceptable',
            category: 'Clarinet',
            status: 'Available'
          },
          {
            title: 'Dummy Post3',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          }
        ],
        { returning: true }
      );
      dummyPosts = await Post.findAll();
    } catch (error) {
      throw error;
    }
  });

  describe('addToTransactions', () => {
    it("adds a transaction to a user's transaction history", async () => {
      try {
        let itemCount = 0,
          totalAmount = 0;

        for (let i = 0; i < dummyPosts.length; i++) {
          await cartService.addToCart(dummyUser, dummyPosts[i].id);
          itemCount += 1;
          totalAmount += dummyPosts[i].price;
        }

        let transaction = await transactionService.addToTransactions(dummyUser);

        expect(transaction.itemCount).toEqual(itemCount);
        expect(transaction.totalAmount).toEqual(totalAmount);
        expect(transaction.posts.length).toEqual(3);
        expect(transaction.posts[0].status).toBe('Sold');
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let dummyInvalidUser = {};
        let response = await transactionService.addToTransactions(
          dummyInvalidUser
        );
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('GetFullTransactionHistory', () => {
    it("gets all a user's transactions", async () => {
      try {
        for (let i = 0; i < dummyPosts.length; i++) {
          await cartService
            .addToCart(dummyUser, dummyPosts[i].id)
            .then(async () => {
              await transactionService.addToTransactions(dummyUser);
            });
        }

        let transactions = await transactionService.getFullTransactionHistory(
          dummyUser
        );

        expect(transactions.length).toEqual(3);
        transactions.forEach(transaction => {
          expect(transaction.totalAmount).toBeTruthy();
          expect(transaction.itemCount).toBeTruthy();
        });
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        let dummyInvalidUser = {};
        let response = await transactionService.getFullTransactionHistory(
          dummyInvalidUser
        );
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });

  describe('GetTransaction', () => {
    it("gets a transcation from a user's transaction history", async () => {
      try {
        for (let i = 0; i < dummyPosts.length; i++) {
          await cartService.addToCart(dummyUser, dummyPosts[i].id);
          await transactionService.addToTransactions(dummyUser);
        }
        let transactionId = 2;
        let transaction = await transactionService.getTransaction(
          transactionId
        );

        expect(transaction.id).toEqual(transactionId);
        expect(transaction.totalAmount).toBeTruthy();
        expect(transaction.itemCount).toBeTruthy();
      } catch (error) {
        throw error;
      }
    });
    it('throws an error if there is an issue', async () => {
      try {
        invalidTransactionId = 404;
        let response = await transactionService.getTransaction(
          invalidTransactionId
        );
        if (response || !response) throw new Error("Didn't throw error");
      } catch (error) {
        expect(console.error).toHaveBeenCalled();
      }
    });
  });
});
