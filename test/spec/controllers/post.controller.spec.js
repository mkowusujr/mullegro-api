const server = require('../../../src/server');
const postController = require('../../../src/api/controllers/post.controller');
const request = require('supertest');
const jwtMaker = require('../helpers/create-jwt');

const checkToSeeIsPostObject = object => {
  expect(object.hasOwnProperty('id')).toBe(true);
  expect(object.hasOwnProperty('title')).toBe(true);
  expect(object.hasOwnProperty('price')).toBe(true);
  expect(object.hasOwnProperty('description')).toBe(true);
  expect(object.hasOwnProperty('condition')).toBe(true);
  expect(object.hasOwnProperty('category')).toBe(true);
  expect(object.hasOwnProperty('status')).toBe(true);
};

describe('Post Controller', () => {
  it('should be created', () => {
    expect(postController).toBeTruthy();
  });

  let db, Post, User;

  beforeEach(async () => {
    try {
      db = require('../../../src/api/models/index');
      await db.sequelize.sync({ force: true });
      Post = db.posts;
      User = db.users;
      jest.spyOn(console, 'log').mockImplementation(jest.fn());
      jest.spyOn(console, 'error').mockImplementation(jest.fn());
    } catch (error) {
      throw error;
    }
  });

  describe("'endpoint: /api/posts/post/:id', ", () => {
    describe('HTTP GET method', () => {
      it('can get a post', async () => {
        try {
          await Post.create({
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          });
          const response = await request(server)
            .get('/api/posts/post/1')
            .set('Content-Type', 'application/json');
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          checkToSeeIsPostObject(response.body);
        } catch (error) {
          throw error;
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          const response = await request(server)
            .get('/api/posts/post/2')
            .set('Content-Type', 'application/json');
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toBeCloseTo(404);
        } catch (error) {
          throw error;
        }
      });
    });
    describe('HTTP PUT method', () => {
      it('can update a post', async () => {
        try {
          await Post.create({
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          });
          let newStatus = { status: 'sold' };

          const response = await request(server)
            .put('/api/posts/post/1')
            .set('Content-Type', 'application/json')
            .send(newStatus);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.text).toBe('Successfully updated post');
        } catch (error) {
          throw error;
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          const response = await request(server)
            .put('/api/posts/post/2')
            .set('Content-Type', 'application/json');
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toBeCloseTo(404);
        } catch (error) {
          throw error;
        }
      });
    });
  });

  describe("endpoint: '/api/posts', ", () => {
    describe('HTTP GET method', () => {
      it("can get all of a user's post", async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          await dummyUser.createPost({
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Acceptable',
            category: 'Clarinet',
            status: 'Available'
          });
          await dummyUser.createPost({
            title: 'Dummy Post3',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          });
          await Post.create({
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          });

          const response = await request(server)
            .get(`/api/posts`)
            .set('Content-Type', 'application/json');
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(3);
          response.body.forEach(object => checkToSeeIsPostObject(object));
        } catch (error) {
          throw error;
        }
      });
    });
  });

  describe("endpoint: '/api/posts/users/user/:username/posts', ", () => {
    describe('HTTP GET method', () => {
      it("can get all of a user's post", async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          await dummyUser.createPost({
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Acceptable',
            category: 'Clarinet',
            status: 'Available'
          });
          await dummyUser.createPost({
            title: 'Dummy Post3',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          });
          await Post.create({
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          });

          const response = await request(server)
            .get(`/api/posts/users/user/${dummyUser.username}/posts`)
            .set('Content-Type', 'application/json');
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(2);
          response.body.forEach(object => checkToSeeIsPostObject(object));
        } catch (error) {
          throw error;
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          const response = await request(server)
            .get(`/api/posts/users/user/FAKE_USER/posts`)
            .set('Content-Type', 'application/json');
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          throw error;
        }
      });
    });
  });

  describe("endpoint: '/api/posts/user/posts', ", () => {
    describe('HTTP GET method', () => {
      it('it should require authorization', async () => {
        try {
          const response = await request(server).get('/api/posts/user/posts');
          expect(response.status).toEqual(401);
        } catch (error) {
          throw error;
        }
      });
      it("should get all of the logged in user's post", async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          await dummyUser.createPost({
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Acceptable',
            category: 'Clarinet',
            status: 'Available'
          });
          await dummyUser.createPost({
            title: 'Dummy Post3',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          });
          await Post.create({
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          });
          let token = jwtMaker.createJwt(dummyUser);

          const response = await request(server)
            .get(`/api/posts/user/posts`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(2);
          response.body.forEach(object => checkToSeeIsPostObject(object));
        } catch (error) {
          throw error;
        }
      });
    });
    describe('HTTP POST method', () => {
      it('it should require authorization', async () => {
        try {
          const response = await request(server).post('/api/posts/user/posts');
          expect(response.status).toEqual(401);
        } catch (error) {
          throw error;
        }
      });
      it('should create a new post ownered by the logged in user', async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          let postObject = {
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          };
          let token = jwtMaker.createJwt(dummyUser);

          const response = await request(server)
            .post(`/api/posts/user/posts`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(postObject);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          checkToSeeIsPostObject(response.body);
        } catch (error) {
          throw error;
        }
      });
      it('sends a 400 response if there is an issue', async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          let postObject = {};
          let token = jwtMaker.createJwt(dummyUser);

          const response = await request(server)
            .post(`/api/posts/user/posts`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send(postObject);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(400);
        } catch (error) {
          throw error;
        }
      });
    });
  });

  describe("endpoint: '/api/posts/user/posts/post/:postId', ", () => {
    describe('HTTP DELETE method', () => {
      it('it should require authorization', async () => {
        try {
          const response = await request(server).delete(
            '/api/posts/user/posts/post/:postId'
          );
          expect(response.status).toEqual(401);
        } catch (error) {
          throw error;
        }
      });
      it("should get all of the logged in user's post", async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          await dummyUser.createPost({
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Acceptable',
            category: 'Clarinet',
            status: 'Available'
          });
          let postId = 1;
          let token = jwtMaker.createJwt(dummyUser);

          const response = await request(server)
            .delete(`/api/posts/user/posts/post/${postId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.text).toEqual('Successfully deleted post');
        } catch (error) {
          throw error;
        }
      });
      it('sends a 404 response if there is an issue', async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          let postId = 1;
          let token = jwtMaker.createJwt(dummyUser);

          const response = await request(server)
            .delete(`/api/posts/user/posts/post/${postId}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', token);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(404);
        } catch (error) {
          throw error;
        }
      });
    });
  });

  describe("endpoint: '/api/posts/filter', ", () => {
    describe('HTTP GET method', () => {
      let dummyUser;
      beforeEach(async () => {
        dummyUser = await User.create({
          name: 'Dummy User',
          address: 'USA',
          username: 'dummy_username',
          email: 'dummay@email.com'
        });
        await dummyUser.createPost({
          title: 'Dummy Post 2',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Used - Acceptable',
          category: 'Clarinet',
          status: 'Available'
        });
        await dummyUser.createPost({
          title: 'Dummy Post3',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Used - Very Good',
          category: 'Clarinet',
          status: 'Available'
        });
        await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Used - Very Good',
          category: 'Trumpet',
          status: 'Available'
        });
      });

      it('can get all of a certain category', async () => {
        try {
          let searchTerm = 'Clarinet';
          let queryUrl = '?category=' + searchTerm;

          const response = await request(server)
            .get(`/api/posts/filter` + queryUrl)
            .set('Content-Type', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(2);
          response.body.forEach(object => checkToSeeIsPostObject(object));
        } catch (error) {
          throw error;
        }
      });
      it('can get all of a certain condition', async () => {
        try {
          let searchTerm = 'Used - Acceptable';
          let queryUrl = '?condition=' + searchTerm;

          const response = await request(server)
            .get(`/api/posts/filter` + queryUrl)
            .set('Content-Type', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(1);
          response.body.forEach(object => checkToSeeIsPostObject(object));
        } catch (error) {
          throw error;
        }
      });
      it('can get all the possible filter category names', async () => {
        try {
          const response = await request(server)
            .get('/api/posts//filter/category/names')
            .set('Content-Type', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(83);
        } catch (error) {
          throw error;
        }
      });
      it('can get all the possible filter ... names', async () => {
        try {
          const response = await request(server)
            .get('/api/posts/filter/condition/names')
            .set('Content-Type', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(6);
        } catch (error) {
          throw error;
        }
      });
    });
  });

  describe("endpoint: '/api/posts/search', ", () => {
    describe('HTTP GET method', () => {
      it('can search for posts based on title', async () => {
        try {
          let dummyUser = await User.create({
            name: 'Dummy User',
            address: 'USA',
            username: 'dummy_username',
            email: 'dummay@email.com'
          });
          await dummyUser.createPost({
            title: 'Dummy Post 2',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Acceptable',
            category: 'Clarinet',
            status: 'Available'
          });
          await dummyUser.createPost({
            title: 'Dummy Post3',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Clarinet',
            status: 'Available'
          });
          await Post.create({
            title: 'Dummy Post',
            price: 100.0,
            description: 'This is an instrument',
            condition: 'Used - Very Good',
            category: 'Trumpet',
            status: 'Available'
          });

          let searchTerm = '3';
          let queryUrl = '?query=' + searchTerm;

          const response = await request(server)
            .get(`/api/posts/search` + queryUrl)
            .set('Content-Type', 'application/json');

          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(1);
          response.body.forEach(object => checkToSeeIsPostObject(object));
        } catch (error) {
          throw error;
        }
      });
    });
  });
});
