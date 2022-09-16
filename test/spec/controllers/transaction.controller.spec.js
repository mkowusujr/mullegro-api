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

  let db,
    Post,
    dummyUser,
    dummyPosts,
    dateString = new Date().toLocaleDateString(),
    token;

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
            condition: 'Good',
            address: 'USA',
            category: 'Clarinet',
            status: 'Not Sold'
          },
          {
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Mid',
            address: 'CANADA',
            category: 'Clarinet',
            status: 'Not Sold'
          },
          {
            title: 'Dummy Post3',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Good',
            address: 'JAPAN',
            category: 'Clarinet',
            status: 'Not Sold'
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
          expect(response.body.dateString).toEqual(dateString);
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
            expect(transaction.dateString).toBeTruthy();
            expect(transaction.totalAmount).toBeTruthy();
            expect(transaction.itemCount).toBeTruthy();
          });
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/transactions/:transactionId', ", () => {
    describe('HTTP GET method', () => {
      it('should require authorization', async () => {
        try {
          const response = await request(server).get('/api/transactions/1');
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it("gets a transcation from a user's transaction history", async () => {
        try {
          for (let i = 0; i < dummyPosts.length; i++) {
            await cartService
              .addToCart(dummyUser, dummyPosts[i].id)
              .then(async () => {
                await transactionService.addToTransactions(dummyUser);
              });
          }
          let transactionId = 2;

          const response = await request(server)
            .get(`/api/transactions/${transactionId}`)
            .set('Content-category', 'application/json')
            .set('Authorization', token);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.id).toEqual(transactionId);
          expect(response.body.dateString).toBeTruthy();
          expect(response.body.totalAmount).toBeTruthy();
          expect(response.body.itemCount).toBeTruthy();
        } catch (error) {
          fail(error);
        }
      });
    });
  });
});
