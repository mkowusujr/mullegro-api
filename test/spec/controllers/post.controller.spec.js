const server = require('../../../src/server');
const postController = require('../../../src/api/controllers/post.controller');
const request = require('supertest');

const checkToSeeIsPostObject = (object) => {
  expect(object.hasOwnProperty('id')).toBeTrue();
  expect(object.hasOwnProperty('title')).toBeTrue();
  expect(object.hasOwnProperty('price')).toBeTrue();
  expect(object.hasOwnProperty('description')).toBeTrue();
  expect(object.hasOwnProperty('condition')).toBeTrue();
  expect(object.hasOwnProperty('address')).toBeTrue();
  expect(object.hasOwnProperty('type')).toBeTrue();
  expect(object.hasOwnProperty('status')).toBeTrue();
};

describe('Post Controller', () => {
  it('should be created', () => {
    expect(postController).toBeTruthy();
  });

  let db;
  let Post;
  let User;

  beforeEach(async () => {
    db = require('../../../src/api/models/index');
    await db.sequelize.sync({ force: true });
    Post = db.posts;
    User = db.users;
    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  describe("'endpoint: /api/posts/post/:id', ", () => {
    describe('HTTP GET method', () => {
      it('can get a post', async () => {
        let dummyPost = await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          type: 'Clarinet',
          status: 'Not Sold'
        });
        try {
          const response = await request(server)
            .get('/api/posts/post/1')
            .set('Content-Type', 'application/json');
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          checkToSeeIsPostObject(response.body);
        } catch (error) {
          fail(error);
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
          fail(error);
        }
      });
    });
    describe('HTTP PUT method', () => {
      it('can update a post', async () => {
        let dummyPost = await Post.create({
          title: 'Dummy Post',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'USA',
          type: 'Clarinet',
          status: 'Not Sold'
        });
        let newStatus = { status: 'sold' };

        try {
          const response = await request(server)
            .put('/api/posts/post/1')
            .set('Content-Type', 'application/json')
            .send(newStatus);
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.text).toBe('Successfully updated post');
        } catch (error) {
          fail(error);
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
          fail(error);
        }
      });
    });
  });

  describe("endpoint: '/api/posts/users/user/:username/posts', ", () => {
    describe('HTTP GET method', () => {
      it("can get all of a user's post", async () => {
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
          condition: 'Mid',
          address: 'CANADA',
          type: 'Clarinet',
          status: 'Not Sold'
        });
        await dummyUser.createPost({
          title: 'Dummy Post3',
          price: 100.0,
          description: 'This is an instrument',
          condition: 'Good',
          address: 'JAPAN',
          type: 'Clarinet',
          status: 'Not Sold'
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

        try {
          const response = await request(server)
            .get(`/api/posts/users/user/${dummyUser.username}/posts`)
            .set('Content-Type', 'application/json');
          expect(console.log).toHaveBeenCalled();
          expect(response.status).toEqual(200);
          expect(response.body.length).toEqual(2);
          checkToSeeIsPostObject(response.body[0]);
          checkToSeeIsPostObject(response.body[1]);
        } catch (error) {
          fail(error);
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
          fail(error);
        }
      });
    });
  });
});
