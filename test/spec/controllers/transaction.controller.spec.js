const request = require('supertest');
const server = require('../../../src/server');
const transactionController = require('../../../src/api/controllers/transaction.controller');
const userService = require('../../../src/api/services/user.service');
const cartService = require('../../../src/api/services/cart.service');
const transactionService = require('../../../src/api/services/transaction.service');
const jwtMaker = require('../helpers/create-jwt');

describe('Transaction Controller', () => {
  it('should be created', () => {
    expect(transactionController).toBeTruthy();
  });

  let db, Post, dummyUser, dummyPosts, token;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      Post = db.posts;
      await db.sequelize.sync({ force: true });
      spyOn(console, 'log');
      spyOn(console, 'error');

      dummyUser = await userService.createUser({
        name: 'Dummy User',
        address: 'USA',
        username: 'dummy_username',
        email: 'dummay@email.com',
        password: 'dummyPassword'
      });
      token = jwtMaker.createJwt(dummyUser);

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
      fail(error);
    }
  });

  describe("endpoint: '/api/transactions', ", () => {
    describe('HTTP POST method', () => {
      it('should require authorization', async () => {
        try {
          const response = await request(server).post('/api/transactions');
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it("adds a transaction to a user's transaction history", async () => {
        try {
          let itemCount = 0,
            totalAmount = 0;

          for (let i = 0; i < dummyPosts.length; i++) {
            await cartService.addToCart(dummyUser, dummyPosts[i].id);
            itemCount += 1;
            totalAmount += dummyPosts[i].price;
          }

          const response = await request(server)
            .post('/api/transactions')
            .set('Content-category', 'application/json')
            .set('Authorization', token);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.itemCount).toEqual(itemCount);
          expect(response.body.totalAmount).toEqual(totalAmount);
          expect(response.body.posts.length).toEqual(3);
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 400 response if there is an issue', async () => {
        try {
          const response = await request(server)
            .post('/api/transactions')
            .set('Content-category', 'application/json')
            .set('Authorization', token);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(400);
        } catch (error) {
          fail(error);
        }
      });
    });

    describe('HTTP GET method', () => {
      it('should require authorization', async () => {
        try {
          const response = await request(server).get('/api/transactions');
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it("gets all a user's transactions", async () => {
        try {
          for (let i = 0; i < dummyPosts.length; i++) {
            await cartService
              .addToCart(dummyUser, dummyPosts[i].id)
              .then(async () => {
                await transactionService.addToTransactions(dummyUser);
              });
          }

          const response = await request(server)
            .get('/api/transactions')
            .set('Content-category', 'application/json')
            .set('Authorization', token);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(3);
          response.body.forEach(transaction => {
            expect(transaction.totalAmount).toBeTruthy();
            expect(transaction.itemCount).toBeTruthy();
          });
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/transactions/transaction/:transactionId', ", () => {
    describe('HTTP GET method', () => {
      it('should require authorization', async () => {
        try {
          const response = await request(server).get(
            '/api/transactions/transaction/1'
          );
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it("gets a transaction from a user's transaction history", async () => {
        try {
          await cartService
            .addToCart(dummyUser, dummyPosts[0].id)
            .then(async () => {
              await transactionService.addToTransactions(dummyUser);
            })
            .then(async () => {
              let transactionId = 1;

              const response = await request(server)
                .get(`/api/transactions/transaction/${transactionId}`)
                .set('Content-category', 'application/json')
                .set('Authorization', token);

              expect(console.log).toHaveBeenCalled();
              expect(response.status).toEqual(200);
              expect(response.body.id).toEqual(transactionId);
              expect(response.body.totalAmount).toEqual(100);
              expect(response.body.itemCount).toEqual(1);
              expect(response.body.posts.length).toEqual(1);
            });
        } catch (error) {
          fail(error);
        }
      });
    });
  });
});
