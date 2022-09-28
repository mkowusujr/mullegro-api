const request = require('supertest');
const server = require('../../../src/server');
const cartController = require('../../../src/api/controllers/cart.controller');
const userService = require('../../../src/api/services/user.service');
const cartService = require('../../../src/api/services/cart.service');
const jwtMaker = require('../helpers/create-jwt');

describe('Cart Controller', () => {
  it('should be created', () => {
    expect(cartController).toBeTruthy();
  });

  let db, Post, dummyUser, dummyPosts, token;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      await db.sequelize.sync({ force: true });
      Post = db.posts;
      User = db.users;
      spyOn(console, 'log');
      spyOn(console, 'error');

      dummyUser = await userService.createUser({
        name: 'Dummy User',
        address: 'USA',
        username: 'dummy_username',
        email: 'dummay@email.com',
        password: 'dummyPassword'
      });

      dummyPosts = await Post.bulkCreate(
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

      token = jwtMaker.createJwt(dummyUser);
    } catch (error) {
      fail(error);
    }
  });

  describe("endpoint: '/api/cart', ", () => {
    describe('HTTP GET method', () => {
      it('should require authorization', async () => {
        try {
          const response = await request(server).get('/api/cart');
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it("should get all the items in a user's cart", async () => {
        try {
          await cartService.addToCart(dummyUser, dummyPosts[0].id);
          await cartService.addToCart(dummyUser, dummyPosts[1].id);
          await cartService.addToCart(dummyUser, dummyPosts[2].id);

          const response = await request(server)
            .get('/api/cart')
            .set('Content-category', 'application/json')
            .set('Authorization', token);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.totalAmount).toBeTruthy();
          expect(response.body.itemCount).toBeTruthy();
          expect(response.body.posts.length).toEqual(dummyPosts.length);
        } catch (error) {
          fail(error);
        }
      });
    });

    describe('HTTP POST method', () => {
      it('should require authorization', async () => {
        try {
          const response = await request(server).post('/api/cart');
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it("should add a post to a user's cart", async () => {
        try {
          let post = { id: 1 };
          const response = await request(server)
            .post('/api/cart')
            .set('Content-category', 'application/json')
            .set('Authorization', token)
            .send(post);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 400 response if there is an issue', async () => {
        try {
          let badPost = {};

          const response = await request(server)
            .post('/api/cart')
            .set('Content-category', 'application/json')
            .set('Authorization', token)
            .send(badPost);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(400);
        } catch (error) {
          fail(error);
        }
      });
    });

    describe('HTTP DELETE method', () => {
      it('should require authorization', async () => {
        try {
          const response = await request(server).delete('/api/cart');
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it("empty the user's cart", async () => {
        try {
          await cartService.addToCart(dummyUser, dummyPosts[0].id);
          await cartService.addToCart(dummyUser, dummyPosts[1].id);
          await cartService.addToCart(dummyUser, dummyPosts[2].id);

          const response = await request(server)
            .delete('/api/cart')
            .set('Content-category', 'application/json')
            .set('Authorization', token);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
        } catch (error) {
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/cart/post/:id', ", () => {
    describe('HTTP DELETE method', () => {
      it('should require authorization', async () => {
        try {
          const response = await request(server).delete('/api/cart/post/1');
          expect(response.status).toEqual(401);
        } catch (error) {
          fail(error);
        }
      });
      it("should remove an item for a user's cart", async () => {
        try {
          await cartService.addToCart(dummyUser, dummyPosts[0].id);
          await cartService.addToCart(dummyUser, dummyPosts[1].id);

          const response = await request(server)
            .delete('/api/cart/post/1')
            .set('Content-category', 'application/json')
            .set('Authorization', token);

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
        } catch (error) {
          fail(error);
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          const response = await request(server)
            .delete('/api/cart/post/400')
            .set('Content-category', 'application/json')
            .set('Authorization', token);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          fail(error);
        }
      });
    });
  });
});
